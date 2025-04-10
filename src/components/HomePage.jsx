import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">
        Welcome to Our Counseling Platform
      </h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        We provide professional counseling services to help you navigate life's challenges.
        Connect with experienced counselors and find the support you need.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Register
        </Link>
      </div>
      <div className="mt-8">
        <Link to="/about" className="text-blue-500 hover:underline mr-4">
          About Us
        </Link>
        <Link to="/contact" className="text-blue-500 hover:underline">
          Contact Us
        </Link>
      </div>
    </div>
  );
}

export default HomePage;