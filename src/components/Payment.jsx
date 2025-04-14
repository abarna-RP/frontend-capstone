import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
function Payment({ token, setError }) {
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const { amount } = useParams();
  const { appointmentId } = useParams();
  const { counselorId } = useParams();
  const handlePayment = async (event) => {
    event.preventDefault();
    setLoading(true);
    setPaymentError(null);

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/payments/checkout`; // Use /payments/checkout endpoint

      console.log({
        client: appointmentId,
        counselor: counselorId,
        amount: amount,
        paymentMethod: 'Credit Card',
      })
      console.log("1")
      const response = await axios.post(apiUrl, {
        client: appointmentId,
        counselor: counselorId,
        amount: amount,
        paymentMethod: 'Credit Card',
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Include authorization header
        },
      });

      console.log("1")
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
  <form onSubmit={handlePayment} className="flex justify-center mt-6">
    <button
      type="submit"
      disabled={loading}
      className={`px-6 py-3 rounded-xl font-semibold transition duration-300 
        ${loading 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
        }`}
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  </form>
);

}

export default Payment;