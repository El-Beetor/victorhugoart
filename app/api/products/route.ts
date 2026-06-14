import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/app/lib/stripe';

export async function GET() {
  try {
    const stripe = getStripe();

    // Fetch all active products with their prices
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    // Transform Stripe products into our format
    const formattedProducts = products.data.map((product) => {
      const price = product.default_price as Stripe.Price;

      return {
        id: product.id,
        priceId: price?.id || null,
        title: product.name,
        price: price ? (price.unit_amount || 0) / 100 : 0, // Convert from cents to dollars
        category: product.metadata?.category || 'Uncategorized',
        size: product.metadata?.size || '',
        available: product.metadata?.available !== 'false', // If 'false' string, then unavailable (sold)
        description: product.description || '',
        images: product.images || [],
      };
    });

    return NextResponse.json({ products: formattedProducts });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
