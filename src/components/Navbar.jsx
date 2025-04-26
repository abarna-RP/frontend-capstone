import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  //const [jwtToken, setJwtToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu toggle

  // Function to sync data from localStorage
  const syncAuthData = () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");

    if (token && userRole && storedUsername) {
      setIsAuthenticated(true);
      setRole(userRole);
     // setJwtToken(token);
      setUsername(storedUsername);
    } else {
      setIsAuthenticated(false);
      setRole(null);
     // setJwtToken(null);
      setUsername(null);
    }
  };

  useEffect(() => {
    syncAuthData();
    setLoading(false);

    // Listen to storage change (from other tabs)
    const handleStorageChange = () => {
      syncAuthData();
    };

    // Listen to custom event (from same tab)
    window.addEventListener('authChange', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('authChange', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole(null);
    //setJwtToken(null);
    setUsername(null);
    // Trigger custom event so other components can listen
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-16 bg-gradient-to-r from-sky-400 to-green-500">
        <div className="spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full text-white"></div>
      </div>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-sky-400 to-green-500 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white font-bold text-xl">
              COUNSELING PLATFORM
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            {isAuthenticated && (
              <>
                <Link
                  className="text-white hover:underline"
                  to={role === 'counselor' ? '/counselor' : '/client'}
                >
                  Dashboard
                </Link>
                <Link className="text-white hover:underline" to="/appointments">
                  My Appointments
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <>
                <span className="text-white">Welcome, {username}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-green-600 font-semibold px-4 py-1 rounded hover:bg-gray-200 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="text-white hover:underline" to="/login">
                  Login
                </Link>
                <Link className="text-white hover:underline" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 space-y-2">
            {isAuthenticated && (
              <>
                <Link
                  className="block text-white"
                  to={role === 'counselor' ? '/counselor' : '/client'}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  className="block text-white"
                  to="/appointments"
                  onClick={() => setMenuOpen(false)}
                >
                  My Appointments
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <>
                <span className="block text-white">Welcome, {username}!</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left bg-white text-green-600 font-semibold px-4 py-1 rounded hover:bg-gray-200 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="block text-white"
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  className="block text-white"
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
