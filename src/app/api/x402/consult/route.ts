// src/app/api/x402/consult/route.ts
// X402 Protected Endpoint: Product Consultation ($0.10 USDC per request)
//
// Accepts a JSON body with { product, question } and returns a consultation response.
// Without payment:   → 402 Payment Required
// With valid payment → 200 OK + consultation response
//
// Supported products: mvp, scalup, sitebuild, chatbot
// External clients can discover this via GET /api/x402/discovery

import { NextResponse } from "next/server";
import { withX402Payment } from "@/lib/x402/middleware";
import { x402ConsultProducts } from "@/lib/x402/config";

export const runtime = "edge";

export const POST = withX402Payment(
  {
    amount: "100000",        // $0.10 USDC
    description: "Paid consultation for MOTA products — submit your question and get an expert response.",
    productName: "Product Consultation",
    productSlug: "consult",
    mimeType: "application/json",
  },
  async (req, paymentInfo) => {
    let body: { product?: string; question?: string } = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body. Expected JSON with: product, question" },
        { status: 400 }
      );
    }

    const { product, question } = body;

    if (!product || !question) {
      return NextResponse.json(
        {
          error: "Missing required fields: product, question",
          availableProducts: Object.keys(x402ConsultProducts),
        },
        { status: 400 }
      );
    }

    const productInfo = x402ConsultProducts[product];
    if (!productInfo) {
      return NextResponse.json(
        {
          error: `Unknown product: ${product}`,
          availableProducts: Object.keys(x402ConsultProducts),
        },
        { status: 400 }
      );
    }

    // Generate a consultation response
    // In production, this could call an AI model or route to a human expert queue
    const consultation = {
      product: productInfo.name,
      productSlug: product,
      question,
      response: generateConsultationResponse(product, question),
      consultedAt: new Date().toISOString(),
      followUp: "For detailed project discussions, please contact our sales team at contract@motaiot.com or visit our Contact page.",
    };

    return NextResponse.json({
      success: true,
      data: consultation,
      payment: {
        payer: paymentInfo.payer,
        amount: paymentInfo.amount,
        network: paymentInfo.network,
        transactionId: paymentInfo.paymentRecord.id,
      },
    });
  }
);

/**
 * Generate a consultation response based on product and question
 *
 * In a real implementation, this would integrate with:
 * - An AI model (GPT, Claude, etc.) for automated responses
 * - A queue system for human expert review
 * - A knowledge base specific to each product
 */
function generateConsultationResponse(product: string, question: string): string {
  const responses: Record<string, string> = {
    mvp: `Thank you for your consultation about our MVP Development service. Based on your question: "${question}"\n\nOur MVP service is designed for rapid validation with a typical delivery of 1-4 weeks. We recommend starting with a focused feature set, leveraging our proven tech stack (Next.js, React, Supabase) to minimize time-to-market. Our team will work with you to define core user flows and build a production-ready product.\n\nKey recommendations:\n1. Define 3-5 core features for initial launch\n2. Use serverless architecture for cost efficiency\n3. Plan for iterative feedback cycles\n\nFor a detailed project scope and timeline, please contact our sales team.`,

    scalup: `Thank you for your consultation about our Scale Up service. Based on your question: "${question}"\n\nScaling requires careful architecture planning. We specialize in performance optimization, database scaling, and infrastructure automation. Common scaling strategies we implement include:\n\n1. Horizontal scaling with load balancing\n2. Database read replicas and caching layers\n3. CDN integration and edge computing\n4. Monitoring and auto-scaling policies\n\nWe recommend starting with a performance audit to identify bottlenecks before implementing scaling solutions.\n\nFor a detailed scaling roadmap, please contact our sales team.`,

    sitebuild: `Thank you for your consultation about our Site Build service. Based on your question: "${question}"\n\nWe build modern, high-performance websites using Next.js with server-side rendering and static generation. Our approach includes:\n\n1. Responsive design with mobile-first methodology\n2. SEO optimization and Core Web Vitals compliance\n3. CMS integration (headless architecture)\n4. Multi-language support with next-intl\n5. Edge deployment for global performance\n\nDelivery typically ranges from 1-6 weeks depending on complexity.\n\nFor a detailed project proposal, please contact our sales team.`,

    chatbot: `Thank you for your consultation about our Enterprise Knowledge Chatbot. Based on your question: "${question}"\n\nOur chatbot solution uses Retrieval-Augmented Generation (RAG) for accurate, context-aware responses from your knowledge base. Key features include:\n\n1. Custom knowledge base integration (documents, APIs, databases)\n2. Multi-model support (OpenAI, Claude, Gemini)\n3. Enterprise security with OAuth 2.0\n4. Real-time streaming responses\n5. Edge deployment for low latency\n\nDeployment options include cloud-hosted, on-premise, or hybrid.\n\nFor a detailed implementation plan, please contact our sales team.`,
  };

  return responses[product] || `Thank you for your consultation. We've received your question about ${product}: "${question}". Our team will review and provide a detailed response. For immediate assistance, contact us at contract@motaiot.com.`;
}

/**
 * GET handler — returns available products for consultation
 * (Free endpoint, no payment required)
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/x402/consult",
    price: "$0.10 USDC",
    description: "Paid product consultation via X402 protocol",
    availableProducts: Object.entries(x402ConsultProducts).map(([slug, info]) => ({
      slug,
      name: info.name,
      description: info.description,
    })),
    usage: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "PAYMENT-SIGNATURE": "<base64-encoded X402 payment payload>",
      },
      body: {
        product: "mvp | scalup | sitebuild | chatbot",
        question: "Your consultation question here",
      },
    },
  });
}
