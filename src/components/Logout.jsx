import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');


    const timer = setTimeout(() => {
      navigate('/login');
    }, 1500); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-2xl text-center">
        <h1 className="text-xl font-semibold text-gray-800">Logging out...</h1>
        <p className="text-gray-500 mt-2">Please wait while we redirect you to the login page.</p>
        <div className="mt-4 animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default Logout;