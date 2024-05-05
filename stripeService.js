import Stripe from 'stripe';

import express from 'express';

export const STRIPE_SECRET_KEY = 'sk_test_51OURt4SIANzm4t2k2eV5accl2S7NfkreV5WvNcDKIf0vDt8wLBj0XAocom2fZOUJAukbW59pNkOIxHlJI0ntQy5f00Mkx3wVR4';
export const STRIPE_PUBLIC_KEY = 'pk_test_51OURt4SIANzm4t2kI3Uij8JRDaNvgqTQuuhOY1QbNhKvHnwRsuD9f6s6xFKCnIqcR2FXeQ0t8m8cVdMLmpsYrHxw00WenAPqtW';


const stripeServiceapp = express();

stripeServiceapp.use(express.json());


const stripe = new Stripe(STRIPE_SECRET_KEY);


stripeServiceapp.post('/stripeService', async (req, res) => {
  
  if (!req.body.hasOwnProperty('amount') || !req.body.hasOwnProperty('currency') || !req.body.hasOwnProperty('paymentMethodId')) {
    return res.status(400).send('Missing parameters in request body');
  }


  const amount = req.body.amount;
  const currency = req.body.currency;
  const paymentMethodId = req.body.paymentMethodId;

  try {
    
    const paymentIntent = await createPaymentIntent(amount, currency, paymentMethodId);
    console.log('Payment intent created:', paymentIntent);

    const confirmedPaymentIntent = await confirmPaymentIntent(paymentIntent.id);
    console.log('Payment intent confirmed:', confirmedPaymentIntent);

  
    console.log('Payment successful!');
    res.json({ message: 'Payment successful' });
  } catch (error) {
    console.error('Error:', error.message);

    console.log('Payment failed. Please try again.');
    res.status(500).json({ error: 'Payment failed', message: error.message });
  }
});


export const createPaymentIntent = async (amount, currency, paymentMethodId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'https://demo.stripe.com/success', // Set to true to confirm the Payment Intent immediately
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










export default stripeServiceapp;