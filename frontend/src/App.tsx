import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Clients from './pages/Clients';
import Programs from './pages/Programs';
import Suggestions from './pages/Suggestions';
import Feedback from './pages/Feedback';
export const api = "https://cema-healthcare.onrender.com/api"

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="colored"
        aria-live="polite"
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/feedback" element={<Feedback />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
