// app/api/webhooks/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const text = await req.text();
  const signature = req.headers.get('stripe-signature');

  try {
    const event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handleSuccessfulPayment(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object;
        await handleFailedPayment(failedIntent);
        break;

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}

// In your webhook handler (api/webhooks/route.js)
async function handleSuccessfulPayment(paymentIntent) {
  try {
    const bookingId = paymentIntent.metadata?.bookingId;
    
    if (bookingId) {
      // Update existing booking
      await updateBookingStatus(bookingId, 'confirmed', paymentIntent.id);
    } else {
      // Create new booking from metadata (fallback)
      const bookingData = {
        ParkingName: paymentIntent.metadata.name || 'Customer',
        CustomerEmail: paymentIntent.metadata.email,
        CustomerPhone: paymentIntent.metadata.phone,
        CarNumber: paymentIntent.metadata.licensePlate,
        Airport: paymentIntent.metadata.airport,
        Location: paymentIntent.metadata.parking,
        PaidAmount: (paymentIntent.amount / 100).toFixed(2),
        PaymentMethod: paymentIntent.payment_method_types[0],
        status: 'confirmed',
        paymentIntentId: paymentIntent.id,
        OrderId: paymentIntent.metadata.orderId || `SP-${Date.now()}`
      };
      
      await createBooking(bookingData);
      await processCustomerData(bookingData);
      await sendBookingEmail(bookingData);
    }
  } catch (error) {}
}

async function handleFailedPayment(paymentIntent) {
  try {
    const bookingId = paymentIntent.metadata?.bookingId;
    if (!bookingId) throw new Error('No booking ID in metadata');

    await fetch(`${process.env.NEXTAUTH_URL}/api/update-booking`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: bookingId,
        status: 'payment_failed'
      })
    });
  } catch (error) {}
}