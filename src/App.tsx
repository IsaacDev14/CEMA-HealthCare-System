import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Clients from './pages/Clients';
import Programs from './pages/Programs';
import Suggestions from './pages/Suggestions';
import Feedback from './pages/Feedback';
import Dashboard from './pages/Dashbosrd';

// Types for Client and Program
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}

interface Program {
  id: string;
  name: string;
  description: string;
}

const App = () => {
  // State for clients
  const [clients, setClients] = useState<Client[]>([
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', dateOfBirth: '1978-05-15' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', dateOfBirth: '1992-08-22' },
  ]);

  // State for programs
  const [programs, setPrograms] = useState<Program[]>([
    { id: '1', name: 'Diabetes Management', description: 'A program to manage diabetes.' },
    { id: '2', name: 'Hypertension Care', description: 'A program to monitor blood pressure.' },
  ]);

  // Functions to add new clients and programs
  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient: Client = { ...client, id: (clients.length + 1).toString() };
    setClients((prev) => [...prev, newClient]);
  };

  const addProgram = (program: Omit<Program, 'id'>) => {
    const newProgram: Program = { ...program, id: (programs.length + 1).toString() };
    setPrograms((prev) => [...prev, newProgram]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Dashboard addClient={addClient} addProgram={addProgram} />}
          />
          <Route path="/clients" element={<Clients clients={clients} setClients={setClients} />} />
          <Route path="/programs" element={<Programs programs={programs} setPrograms={setPrograms} />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/feedback" element={<Feedback />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;