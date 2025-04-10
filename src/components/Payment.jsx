import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
function Payment({   token, setError, clientId, counselorId  }) {
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const { amount } = useParams();
  const handlePayment = async (event) => {
    event.preventDefault();
    setLoading(true);
    setPaymentError(null);

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/payments/checkout`; // Use /payments/checkout endpoint

      const response = await axios.post(apiUrl, {
        client: clientId,
        counselor: counselorId,
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
      let errorMessage = 'Payment failed. Please try again.';
      if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
      }
      setPaymentError(errorMessage);
      setError(errorMessage);
      setLoading(false);
  } finally {
      setLoading(false);
  }
};
  if (loading) {
    return <div>Loading...</div>;
  }

  if (paymentError) { // Check local error state
    return <div style={{ color: 'red' }}>{paymentError}</div>;
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