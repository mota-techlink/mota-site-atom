import { createClient } from '@supabase/supabase-js';
import { google } from '@ai-sdk/google';
import { streamText, convertToCoreMessages } from 'ai'; // 🟢 确保从 'ai' 引入
import { createOpenAI } from '@ai-sdk/openai';

export const runtime = 'edge';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const cloudflare = createOpenAI({
  baseURL: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
  apiKey: process.env.CLOUDFLARE_API_WORKAI_TOKEN,
});

async function getEmbedding(text: string) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/baai/bge-base-en-v1.5`,
    {
      headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_WORKAI_TOKEN}` },
      method: 'POST',
      body: JSON.stringify({ text: [text] }),
    }
  );
  const json = await response.json();
  
  // 错误处理
  if (!json.success) {
    throw new Error(`Cloudflare Embedding Error: ${JSON.stringify(json.errors)}`);
  }
  
  return json.result.data[0];
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1];
    const userQuery = lastUserMessage.content;
    const isChinese = /[\u4e00-\u9fa5]/.test(userQuery);
    // --- RAG 检索开始 ---
    let searchQuery = userQuery;
    
    // 简单的判断：如果包含中文，则进行翻译
    if (isChinese) {
        const translationResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`,
            {
                headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_WORKAI_TOKEN}` },
                method: 'POST',
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: 'You are a translator. Translate the following user query into English keywords for a search engine. Output ONLY the English translation, no other text.' },
                        { role: 'user', content: userQuery }
                    ]
                }),
            }
        );
        const transJson = await translationResponse.json();
        if (transJson.result && transJson.result.response) {
            searchQuery = transJson.result.response.trim();
            console.log(`🔤 Translated Query: "${userQuery}" -> "${searchQuery}"`);
        }
    }
    
    // A. 生成向量
    const embedding = await getEmbedding(searchQuery);
    
    const { data: documents } = await getSupabase().rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.3, 
      match_count: 5,
    });    

    // C. 组装上下文
    const contextText = documents?.map((doc: any) => doc.content).join('\n---\n') || '';
    const languageInstruction = isChinese
      ? `CRITICAL: The user asked in Chinese. You MUST reply in Simplified Chinese (简体中文), even if the context provided below is in English. Do not reply in English.`
      : `Reply in the same language as the user's question.`;
    // --- RAG 检索结束 ---

    // D. 构建 Prompt
    const systemPrompt = `
      You are the AI support assistant for MOTA TECHLINK.
      
      Instructions:
      1. Answer the question based ONLY on the context below.
      2. If the answer is not in the context, say you don't know.
      3. ${languageInstruction}
      
      Context:
      ${contextText}
    `;

    // E. 调用模型 (Llama 3)
    const result = await streamText({
      // 指定 Cloudflare 上的模型 ID
      model: cloudflare('@cf/meta/llama-3-8b-instruct') as any,
      system: systemPrompt,
      messages: convertToCoreMessages(messages),
    });

    // F. 返回流
    return result.toDataStreamResponse();
    
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Error processing request' }), { status: 500 });
  }
}