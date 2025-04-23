// frontend/src/components/Payment.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Payment({ token, setError }) {
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const { appointmentId, amount, counselorId } = useParams();

  const handlePayment = async (event) => {
    event.preventDefault();
    setLoading(true);
    setPaymentError(null);

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/payments/checkout`;

      const response = await axios.post(apiUrl, {
        client: appointmentId,
        counselor: counselorId,
        amount: amount,
        paymentMethod: 'Credit Card',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { url } = response.data;
      window.location.assign(url);

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
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }

  if (paymentError) {
    return <div className="container mt-5 alert alert-danger" role="alert">{paymentError}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Payment</h2>
      <p className="lead mb-3">You are about to pay ${amount} for your session.</p>
      <form onSubmit={handlePayment} className="d-flex justify-content-center">
        <button
          type="submit"
          className={`btn btn-success btn-lg ${loading ? 'disabled' : ''}`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}

export default Payment;