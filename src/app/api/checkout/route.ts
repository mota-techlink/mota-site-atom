// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge';

// 懒加载：build 阶段不初始化，运行时才创建
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY in environment variables');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tier = searchParams.get('tier');
  const priceString = searchParams.get('price'); // e.g. "$1,000"
  const productName = searchParams.get('product') || 'Mota Service';
  

  if (!tier || !priceString) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // 1. 解析价格 (简单的字符串转数字逻辑)
  // ⚠️ 安全提示：在生产环境中，最好在服务器端根据 tier 映射价格，而不是信任 URL 传来的价格
  const priceAmount = parseFloat(priceString.replace(/[^0-9.]/g, ''));

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  
  if (isNaN(priceAmount)) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
  }

  const origin = request.nextUrl.origin;
  const returnPath = searchParams.get('return_path') || '/';
  
  try {
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'JP', 'CN'], // 定义您支持发货的国家
      },
      line_items: [
        {
          
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${productName} - ${tier} Tier`,
            },
            unit_amount: Math.round(priceAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`, // 确保带上 /en 或 /zh
            
      cancel_url: `${origin}/checkout/cancel?return_to=${encodeURIComponent(returnPath)}`,
      // 🟢 2. 将关键信息放入 metadata，Webhook 会用到       
      metadata: {
        userId: user?.id || '',
        tier: tier!,
        product: productName,
        returnPath:returnPath,
        source: 'web_checkout' // 标记来源
      }
    };

    // 🟢 3. 如果用户已登录，锁定邮箱 (解决"未登录"的一致性问题)
    if (user?.email) {
      sessionConfig.customer_email = user.email;
    }

    const session = await getStripe().checkout.sessions.create(sessionConfig);

    if (session.url) {
      return NextResponse.redirect(session.url, 303);
    }

  } catch (err: any) {
    console.error('Stripe Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}