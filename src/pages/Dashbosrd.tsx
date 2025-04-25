// Dashboard.tsx

import { FC, FormEvent, useState } from 'react';
import { FiAlertCircle, FiUsers, FiLayers } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';

// Types for form data
interface ProgramForm {
  name: string;
  description: string;
}

interface ClientForm {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}

// Sample chart data
const chartData = [
  { month: 'Jan', enrollments: 30, clients: 40 },
  { month: 'Feb', enrollments: 45, clients: 60 },
  { month: 'Mar', enrollments: 60, clients: 75 },
  { month: 'Apr', enrollments: 50, clients: 65 },
  { month: 'May', enrollments: 70, clients: 80 },
  { month: 'Jun', enrollments: 90, clients: 95 },
];

const Dashboard: FC = () => {
  // State to hold form data and errors
  const [programForm, setProgramForm] = useState<ProgramForm>({ name: '', description: '' });
  const [clientForm, setClientForm] = useState<ClientForm>({ firstName: '', lastName: '', email: '', dateOfBirth: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle Program form submission
  const handleProgramSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!programForm.name) {
      setErrors({ programName: 'Program name is required' });
      return;
    }
    toast.success('Program created successfully!');
    setProgramForm({ name: '', description: '' });
    setErrors({});
  };

  // Handle Client form submission
  const handleClientSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!clientForm.firstName) newErrors.firstName = 'First name is required';
    if (!clientForm.lastName) newErrors.lastName = 'Last name is required';
    if (!clientForm.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientForm.email)) newErrors.email = 'Invalid email';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    toast.success('Client registered successfully!');
    setClientForm({ firstName: '', lastName: '', email: '', dateOfBirth: '' });
    setErrors({});
  };

  return (
    <div className="space-y-10">
      <ToastContainer />
       {/* === Page Title === */}
       <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* === Summary Metrics === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
          <FiLayers className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Total Programs</p>
            <p className="text-xl font-bold text-gray-800">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
          <FiUsers className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Total Clients</p>
            <p className="text-xl font-bold text-gray-800">245</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
          <FiAlertCircle className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Pending Actions</p>
            <p className="text-xl font-bold text-gray-800">3</p>
          </div>
        </div>
      </div>

      {/* === Enhanced Form Section (Now at the Top) === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* === Create Program Form === */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">📋 Create Health Program</h2>
          <form onSubmit={handleProgramSubmit} className="space-y-4">
            <div>
              <label htmlFor="programName" className="text-sm font-medium text-gray-700">Program Name</label>
              <input
                id="programName"
                type="text"
                value={programForm.name}
                onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                placeholder="e.g., Malaria"
                className={`w-full mt-1 p-3 rounded-lg border ${errors.programName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`}
              />
              {errors.programName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" /> {errors.programName}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="programDescription" className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="programDescription"
                value={programForm.description}
                onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                placeholder="Program details"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Create Program</button>
          </form>
        </div>

        {/* === Register Client Form === */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">🧑 Register Client</h2>
          <form onSubmit={handleClientSubmit} className="space-y-4">
            {['firstName', 'lastName', 'email'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="text-sm font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  id={field}
                  type={field === 'email' ? 'email' : 'text'}
                  value={(clientForm as any)[field]}
                  onChange={(e) => setClientForm({ ...clientForm, [field]: e.target.value })}
                  placeholder={field === 'email' ? 'Email address' : `Enter ${field}`}
                  className={`w-full mt-1 p-3 rounded-lg border ${errors[field] ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`}
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" /> {errors[field]}
                  </p>
                )}
              </div>
            ))}
            <div>
              <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                id="dateOfBirth"
                type="date"
                value={clientForm.dateOfBirth}
                onChange={(e) => setClientForm({ ...clientForm, dateOfBirth: e.target.value })}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Register Client</button>
          </form>
        </div>
      </div>

      

      {/* === Charts Section === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart for Enrollments */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">📈 Enrollment Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enrollments" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart for Clients */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">📊 Clients Registered</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clients" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
