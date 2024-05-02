import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from './stripeConfig';

const stripe = new Stripe(STRIPE_SECRET_KEY);


export const createPaymentIntent = async (amount, currency, paymentMethodId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true, // Set to true to confirm the Payment Intent immediately
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(`Error creating payment intent: ${error.message}`);
  }
};


export const confirmPaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    throw new Error(`Error confirming payment intent: ${error.message}`);
  }
};

// Parse query parameters
const urlParams = new URLSearchParams(window.location.search);
const amount = parseInt(urlParams.get('amount'));
const currency = urlParams.get('currency');
const paymentMethodId = urlParams.get('paymentMethodId');

// Create and confirm Payment Intent
const handlePayment = async () => {
  try {
    const paymentIntent = await createPaymentIntent(amount, currency, paymentMethodId);
    console.log('Payment intent created:', paymentIntent);

    const confirmedPaymentIntent = await confirmPaymentIntent(paymentIntent.id);
    console.log('Payment intent confirmed:', confirmedPaymentIntent);

    // Handle successful payment (e.g., show success message to user)
    alert('Payment successful!');
  } catch (error) {
    console.error('Error:', error.message);
    // Handle payment error (e.g., show error message to user)
    alert('Payment failed. Please try again.');
  }
};

// Call handlePayment function
handlePayment();
