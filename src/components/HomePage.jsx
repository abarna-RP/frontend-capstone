import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
const navigate = useNavigate()

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    console.log(storedUsername)
    storedUsername && navigate("client")
  }, [])

  return (
    <div 
      className="d-flex align-items-center justify-content-center vh-100 w-100"
      style={{
        backgroundImage: "url('/lll.png')", // Replace with your actual image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h1 className="display-4 mb-4">Welcome to Our Counseling Platform</h1>
            <p className="lead mb-5">
              We provide professional counseling services to help you navigate
              life's challenges. Connect with experienced counselors and find the
              support you need.
            </p>
            <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
              <Link to="/login" className="btn btn-success btn-lg px-4 gap-3">Login</Link>
              <Link to="/register" className="btn btn-info btn-lg px-4">Register</Link>
            </div>
            <div className="mt-4">
              <p className="text-muted">
                <Link to="/about" className="me-3">About Us</Link>
                <Link to="/contact">Contact Us</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
