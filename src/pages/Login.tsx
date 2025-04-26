// ✅ Imports at very top
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';
import image from '../assets/image copy.png';

// ✅ Component starts AFTER imports
const Login: FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setIsLoading(false);
      setError('Please fill in both fields');
      toast.error('Please fill in both fields', { position: 'top-right' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      localStorage.setItem('token', response.data.token);
      toast.success('Login successful! Redirecting...', { position: 'top-right' });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response
          ? err.response.data.error || 'An unexpected error occurred'
          : 'An unexpected error occurred';

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
          <img src={image} alt="Login Background" className="w-full h-full object-cover rounded-l-lg" />
        </div>
        <div className="w-full lg:w-1/2 p-8 bg-white rounded-r-lg shadow-xl flex flex-col items-center justify-center">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="CEMACare Logo" className="h-20" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">Welcome Back to CEMA</h2>
          <h3 className="text-lg text-gray-600 text-center mb-4">Please log in to continue managing your health programs.</h3>

          {error && (
            <div className="flex items-center justify-start mb-4 p-2 bg-red-100 text-red-600 rounded-lg shadow-md w-full">
              <FiAlertCircle className="mr-2" size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FiUser className="text-gray-600 mr-3" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full p-2 outline-none bg-transparent text-gray-700"
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FiLock className="text-gray-600 mr-3" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-2 outline-none bg-transparent text-gray-700"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <FiLoader className="animate-spin" size={20} />
              ) : (
                <>
                  <span className="mr-2">Login</span>
                  <FiLock size={20} />
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-4">
            Don’t have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-600 hover:underline"
            >
              Sign up
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

export default Login;
