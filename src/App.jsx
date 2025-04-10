import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");
     

      if (token && userRole) {
        setIsAuthenticated(true);
        setRole(userRole);
       
        setJwtToken(token);
      }
    } catch (err) {
      console.error("Error accessing localStorage:", err);
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const PrivateRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const ClientRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    return isAuthenticated && role === "client" ? children : <Navigate to="/login" />;
  };

  const CounselorRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    return isAuthenticated && role === "counselor" ? children : <Navigate to="/login" />;
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
            <CounselorRoute>
              <Counselor />
            </CounselorRoute>
          }
        />
        <Route
          path="/client"
          element={
            <ClientRoute>
              <Client />
            </ClientRoute>
          }
        />
        <Route
          path="/appointment-booking/:counselorId"
          element={
            <ClientRoute>
              <Appointment />
            </ClientRoute>
          }
        />
        <Route
          path="/payment/:appointmentId/:amount"
          element={
            <Elements stripe={stripePromise}>
              <Payment
              

                amount={100}
                token={jwtToken}
                apiBaseUrl={apiBaseUrl}
              />
            </Elements>
          }
        />
        <Route
          path="/video-call/:channelName/:uid"
          element={
            <PrivateRoute>
              <VideoCall />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
