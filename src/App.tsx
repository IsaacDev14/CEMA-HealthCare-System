import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Clients from './pages/Clients';
import Programs from './pages/Programs';
import Suggestions from './pages/Suggestions';
import Feedback from './pages/Feedback';

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
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/feedback" element={<Feedback />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;