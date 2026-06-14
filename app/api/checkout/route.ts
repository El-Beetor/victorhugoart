import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/app/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { priceId, productId } = await req.json();
    const stripe = getStripe();

    // Create Checkout Session using Stripe Price ID
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Use the Price ID from Stripe
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/shop?canceled=true`,
      metadata: {
        productId: productId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
