import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import Counselor from "./components/Counselor";
import Client from "./components/Client";
import Appointment from "./components/Appointment";
import Payment from "./components/Payment";
import VideoCall from "./components/VideoCall";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
      setJwtToken(token);
    }

    setLoading(false);
  }, []);

  const ProtectedRoute = ({ children, requiredRole }) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    if (!isAuthenticated) return <Navigate to="/login" />;
    if (requiredRole && role !== requiredRole) return <Navigate to="/login" />;

    return children;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/counselor"
          element={
            <ProtectedRoute requiredRole="counselor">
              <Counselor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client"
          element={
            <ProtectedRoute requiredRole="client">
              <Client />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment-booking/:counselorId"
          element={
            <ProtectedRoute requiredRole="client">
              <Appointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:appointmentId/:amount/:counselorId" 
          element={
            <Elements stripe={stripePromise}>
              <Payment
                token={jwtToken}
                apiBaseUrl={import.meta.env.VITE_API_BASE_URL}
                setError={setError}
                clientId={localStorage.getItem("clientId")} 
                counselorId={localStorage.getItem("counselorId")} 
              />
            </Elements>
          }
        />
        <Route
          path="/video-call/:channelName/:uid"
          element={
            <ProtectedRoute>
              <VideoCall />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;