import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';
import image from '../assets/image copy.png';

interface ErrorResponse {
  error?: string;
}

const Signup: FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      toast.error('Please fill in all fields', { position: 'top-right' });
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match', { position: 'top-right' });
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      toast.error('Password must be at least 6 characters', { position: 'top-right' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      toast.success('Registration successful! Redirecting to login...', { position: 'top-right' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorMessage =
        (err as AxiosError<ErrorResponse>).response?.data?.error || 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage, { position: 'top-right' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="flex w-full max-w-screen-xl">
        <div className="w-1/2 hidden lg:block">
          <img src={image} alt="Signup Background" className="w-full h-full object-cover rounded-l-lg" />
        </div>
        <div className="w-full lg:w-1/2 p-8 bg-white rounded-r-lg shadow-xl flex flex-col items-center justify-center transform transition-all duration-500 hover:scale-102">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="CEMACare Logo" className="h-20" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">Join CEMA</h2>
          <h3 className="text-lg text-gray-600 text-center mb-4">Create an account to manage health programs.</h3>
          {error && (
            <div className="flex items-center justify-start mb-4 p-2 bg-red-100 text-red-600 rounded-lg shadow-md w-full">
              <FiAlertCircle className="mr-2" size={20} />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
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
            <div className="flex items-center border border-gray-300 rounded-md p-2 transition-transform duration-300 focus-within:ring-4 focus-within:ring-blue-500 hover:scale-105">
              <FiLock className="text-gray-600 mr-3" size={20} />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full p-2 outline-none bg-transparent text-gray-700"
                aria-required="true"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              {isLoading ? (
                <FiLoader className="animate-spin" size={20} />
              ) : (
                <>
                  <span className="mr-2">Sign Up</span>
                  <FiUser size={20} />
                </>
              )}
            </button>
          </form>
          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">
              Log in
            </button>
          </p>
          <p className="text-sm text-gray-500 text-center mt-8">
            © {new Date().getFullYear()} CEMA. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;