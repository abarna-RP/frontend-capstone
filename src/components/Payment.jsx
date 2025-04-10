import React, { useState } from 'react';
import axios from 'axios';

function Payment({ client, counselor, amount, token, apiBaseUrl }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${apiBaseUrl}/payments/checkout`; // Use /payments/checkout endpoint

      const response = await axios.post(apiUrl, {
        client: client,
        counselor: counselor,
        amount: amount,
        paymentMethod: 'Credit Card',
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Include authorization header
        },
      });

      const { url } = response.data;
      window.location.assign(url); // Redirect to Stripe Checkout

    } catch (err) {
      console.error(err);
      setError('Payment failed. Please try again.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <form onSubmit={handlePayment}>
      <button type="submit" disabled={loading}>
        Pay
      </button>
    </form>
  );
}

export default Payment;