import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup'; // Import Signup from pages
import Clients from './pages/Clients';
import Programs from './pages/Programs';
import Suggestions from './pages/Suggestions';
import Feedback from './pages/Feedback';

// Types for Client and Program
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  registeredAt: string;
  programIds: string[];
}

interface Program {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const App = () => {
  // State for clients
  const [clients, setClients] = useState<Client[]>([
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', dateOfBirth: '1978-05-15', registeredAt: '2025-01-15', programIds: ['1'] },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', dateOfBirth: '1992-08-22', registeredAt: '2025-02-10', programIds: ['2'] },
  ]);

  // State for programs
  const [programs, setPrograms] = useState<Program[]>([
    { id: '1', name: 'Diabetes Management', description: 'A program to manage diabetes.', createdAt: '2025-01-20' },
    { id: '2', name: 'Hypertension Care', description: 'A program to monitor blood pressure.', createdAt: '2025-03-12' },
  ]);

  // Functions to add new clients and programs
  const addClient = (client: Omit<Client, 'id' | 'registeredAt' | 'programIds'>) => {
    const newClient: Client = { 
      ...client, 
      id: (clients.length + 1).toString(), 
      registeredAt: new Date().toISOString().split('T')[0],
      programIds: [],
    };
    setClients((prev) => [...prev, newClient]);
  };

  const addProgram = (program: Omit<Program, 'id' | 'createdAt'>) => {
    const newProgram: Program = { 
      ...program, 
      id: (programs.length + 1).toString(), 
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPrograms((prev) => [...prev, newProgram]);
  };

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> {/* Add Signup route */}
          <Route element={<Layout />}>
            <Route
              path="/"
              element={<Dashboard addClient={addClient} addProgram={addProgram} clients={clients} programs={programs} />}
            />
            <Route path="/clients" element={<Clients clients={clients} setClients={setClients} programs={programs} />} />
            <Route path="/programs" element={<Programs programs={programs} setPrograms={setPrograms} />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/feedback" element={<Feedback />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
};

export default App;