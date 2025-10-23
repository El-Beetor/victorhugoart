# Stripe Checkout Setup Guide

This guide will help you set up Stripe Checkout for your art shop on Vercel.

## Prerequisites

1. Create a Stripe account at https://stripe.com
2. Complete your Stripe account setup and verification
3. Have your site deployed on Vercel

## Step 1: Get Your Stripe API Keys

1. Go to your Stripe Dashboard: https://dashboard.stripe.com/apikeys
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode) - Click "Reveal test key"
3. Copy both keys - you'll need them in the next step

## Step 2: Configure Environment Variables

### Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Stripe keys to `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_placeholder_for_now
   ```

3. **IMPORTANT**: Never commit `.env.local` to git (it's already in `.gitignore`)

### Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these three variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = Your publishable key
   - `STRIPE_SECRET_KEY` = Your secret key
   - `STRIPE_WEBHOOK_SECRET` = (we'll add this after setting up webhooks)

4. Redeploy your site for the changes to take effect

## Step 3: Set Up Webhook Endpoint

Webhooks notify your site when a payment succeeds or fails.

### For Vercel (Production)

1. Get your Vercel deployment URL (e.g., `https://yoursite.vercel.app`)
2. Go to Stripe Dashboard → **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Enter your webhook URL: `https://yoursite.vercel.app/api/webhook`
5. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
6. Click **Add endpoint**
7. Click on the newly created webhook to reveal the **Signing secret** (starts with `whsec_`)
8. Copy this secret and add it to your Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
9. Redeploy your site

### For Local Development

1. Install the Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhook events to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
4. Copy the webhook signing secret from the output
5. Add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

## Step 4: Test the Integration

### Using Test Cards

Stripe provides test card numbers that simulate different scenarios:

- **Success**: `4242 4242 4242 4242`
- **Requires authentication**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 9995`

Use any future expiry date and any 3-digit CVC.

### Test Flow

1. Go to your shop page
2. Click "Purchase with Stripe" on any artwork
3. You'll be redirected to Stripe's checkout page
4. Enter test card details:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - Email: Your email
5. Complete the payment
6. You'll be redirected to the success page

## Step 5: Going Live

When you're ready to accept real payments:

### 1. Activate Your Stripe Account
- Complete the activation process in your Stripe Dashboard
- Provide business details and banking information

### 2. Get Live API Keys
1. In Stripe Dashboard, toggle from "Test mode" to "Live mode" (top right)
2. Go to **Developers** → **API keys**
3. Copy your **live** keys (they start with `pk_live_` and `sk_live_`)

### 3. Update Environment Variables
1. In Vercel, update your environment variables with the **live** keys:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`
   - `STRIPE_SECRET_KEY` = `sk_live_...`
2. Create a new webhook endpoint for production with live mode selected
3. Update `STRIPE_WEBHOOK_SECRET` with the new live webhook secret
4. Redeploy your site

## Security Checklist

✅ Never commit `.env.local` or expose secret keys
✅ Use test mode for development
✅ Verify webhook signatures (already implemented)
✅ Use HTTPS in production (Vercel handles this)
✅ Keep Stripe libraries updated

## Customization

To customize the checkout experience:

1. **Add more product details**: Edit the product array in `app/shop/page.tsx`
2. **Modify success page**: Edit `app/shop/success/page.tsx`
3. **Handle webhooks**: Update logic in `app/api/webhook/route.ts`
4. **Shipping options**: Modify the checkout session in `app/api/checkout/route.ts`

## Support

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Checkout**: https://stripe.com/docs/payments/checkout
- **Webhooks Guide**: https://stripe.com/docs/webhooks
- **For issues with your art shop**: vicgarcia.art@pm.me

## Common Issues

**Issue**: Webhook not working
- **Solution**: Make sure the webhook URL matches your deployment URL exactly
- **Solution**: Verify the webhook secret is correctly set in environment variables

**Issue**: Checkout not redirecting
- **Solution**: Check that `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
- **Solution**: Check browser console for errors

**Issue**: Payment succeeds but webhook doesn't fire
- **Solution**: Check webhook logs in Stripe Dashboard
- **Solution**: Make sure your webhook endpoint is publicly accessible
