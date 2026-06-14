import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/app/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const stripe = getStripe();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const error = err as Error;
    console.error(`Webhook signature verification failed: ${error.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;

      // Fulfill the order here
      console.log('Payment successful:', session.id);
      console.log('Product ID:', session.metadata?.productId);

      // Mark product as sold (unavailable)
      if (session.metadata?.productId) {
        try {
          // Get existing product to preserve other metadata
          const product = await stripe.products.retrieve(session.metadata.productId);

          await stripe.products.update(session.metadata.productId, {
            metadata: {
              ...product.metadata, // Preserve existing metadata (category, size, etc.)
              available: 'false', // Mark as sold
            },
          });
          console.log(`Product ${session.metadata.productId} marked as sold`);
        } catch (error) {
          console.error('Error marking product as sold:', error);
        }
      }

      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
