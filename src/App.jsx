import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import Counselor from "./components/Counselor";
import Client from "./components/Client";
import Appointment from "./components/Appointment";
import Payment from "./components/Payment";
import VideoCall from "./components/VideoCall";
import AppointmentsList from "./components/AppointmentsList";
import Navbar from "./components/Navbar";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logout from "./components/Logout";
import MyAppointments from "./components/MyAppointments";

// Stripe setup
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

function App() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [jwtToken, setJwtToken] = useState(null);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        // Check for JWT token and set state accordingly
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");
        const storedUsername = localStorage.getItem("username");

        if (token && userRole && storedUsername) {
            setIsAuthenticated(true);
            setRole(userRole);
            setJwtToken(token);
            setUsername(storedUsername);
        }

        setLoading(false);
    }, [username]);

    // Protected route wrapper for role-based access
    const ProtectedRoute = ({ children, requiredRole }) => {
        if (loading) {
            return (
                <div className="d-flex justify-content-center mt-5">
                    <div className="spinner-border"></div>
                </div>
            );
        }
        if (error) return <div className="alert alert-danger">{error}</div>;
        console.log(isAuthenticated);
        // Role-based route protection
        if (!isAuthenticated) return <Navigate to="/login" />;
        if (requiredRole && role !== requiredRole) return <Navigate to="/login" />;

        return children;
    };

    return (
        <Router>
            <Navbar isAuthenticated={isAuthenticated} username={username} setIsAuthenticated={setIsAuthenticated} />
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route
                        path="/counselor"
                        element={
                            // <ProtectedRoute requiredRole="counselor">
                                <Counselor />
                            // </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/client"
                        element={
                            // <ProtectedRoute requiredRole="client">
                                <Client />
                            // </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/appointments"
                        element={
                            // <ProtectedRoute>
                                <AppointmentsList />
                            // </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/appointment-booking/:counselorId"
                        element={
                            // <ProtectedRoute requiredRole="client">
                                <Appointment />
                            // </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/payment/:appointmentId/:amount/:counselorId"
                        element={
                            <Elements stripe={stripePromise}>
                                <Payment token={jwtToken} setError={setError} />
                            </Elements>
                        }
                    />
                    <Route
                        // Updated path to match the navigation in Counselor.js
                        path="/video-call/:appointmentId/:counselorId"
                        element={
                            // <ProtectedRoute>
                                <VideoCall />
                            // </ProtectedRoute>
                        }
                    />
                    <Route path="/myappointments" element={<MyAppointments />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
