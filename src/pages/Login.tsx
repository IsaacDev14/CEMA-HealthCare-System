import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiAlertCircle } from 'react-icons/fi';
import logo from '../assets/logo.png'; // Importing the logo for the top of the login screen
import image from '../assets/image copy.png'; // Importing an image to the left side of the page

const Login: FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>(''); // State for error message handling

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username === '' || password === '') {
      setError('Please fill in both fields');
      return;
    }
    // Placeholder: Redirect to dashboard (no authentication yet)
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Main container for the whole page, split into two sections */}
      <div className="flex w-full max-w-screen-xl ">
        
        {/* Left Section: Image */}
        <div className="w-1/2 hidden lg:block">
          <img src={image} alt="Login Background" className="w-full h-full object-cover rounded-l-lg" />
        </div>

        {/* Right Section: Login Form */}
        <div className="w-full lg:w-1/2 p-8 bg-white rounded-r-lg shadow-xl flex flex-col items-center justify-center transform transition-all duration-500 hover:scale-102">
          
          {/* Logo - Centered and styled for a modern look */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="CEMACare Logo" className="h-20" />
          </div>

          {/* Main header with bold text */}
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">
            Welcome Back to CEMA
          </h2>

          {/* Subheading with a friendly tone */}
          <h3 className="text-lg text-gray-600 text-center mb-4">
            Please log in to continue managing your health programs.
          </h3>

          {/* Error Alert if fields are not filled correctly */}
          {error && (
            <div className="flex items-center justify-start mb-4 p-2 bg-red-100 text-red-600 rounded-lg shadow-md">
              <FiAlertCircle className="mr-2" size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 w-full">

            {/* Username input with icon and focus effect */}
            <div className="flex items-center border border-gray-300 rounded-md p-2 transition-transform duration-300 focus-within:ring-4 focus-within:ring-blue-500 hover:scale-105">
              <FiUser className="text-gray-600 mr-3" size={20} />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full p-2 outline-none bg-transparent text-gray-700"
                aria-required="true"
              />
            </div>

            {/* Password input with icon and focus effect */}
            <div className="flex items-center border border-gray-300 rounded-md p-2 transition-transform duration-300 focus-within:ring-4 focus-within:ring-blue-500 hover:scale-105">
              <FiLock className="text-gray-600 mr-3" size={20} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-2 outline-none bg-transparent text-gray-700"
                aria-required="true"
              />
            </div>

            {/* Submit button with hover effect */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              <span className="mr-2">Login</span>
              <FiLock size={20} />
            </button>
          </form>

          {/* Footer with current year */}
          <p className="text-sm text-gray-500 text-center mt-8">
            © {new Date().getFullYear()} CEMA. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
