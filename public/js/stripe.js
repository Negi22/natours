/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe('pk_test_51IBfAOJRE704xpNnLPobKJ8v0TPnPIJyZQbUr2W4nyfYulVU3iI5x6Gw9hA706aHuqL3eoOzG9Uiftmw3aXK6d7Z00oe6YBQU3');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    })
  } catch (err) {
    showAlert('error', err);
  }
}