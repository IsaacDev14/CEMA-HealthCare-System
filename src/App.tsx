import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Clients from './pages/Clients';
import Programs from './pages/Programs';
import Dashboard from './pages/Dashbosrd';
import Login from './pages/Login';

const App: FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/programs" element={<Programs />} />
      </Route>
    </Routes>
  );
};

export default App;