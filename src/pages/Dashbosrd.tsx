import { FC, FormEvent, useState } from 'react';
import { FiAlertCircle, FiUsers, FiLayers } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';

// Types for program and client
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

// Sample chart data (placeholder for real data)
const chartData = [
  { month: 'Jan', enrollments: 30 },
  { month: 'Feb', enrollments: 45 },
  { month: 'Mar', enrollments: 60 },
  { month: 'Apr', enrollments: 50 },
  { month: 'May', enrollments: 70 },
  { month: 'Jun', enrollments: 90 },
];

const Dashboard: FC = () => {
  const [programForm, setProgramForm] = useState<ProgramForm>({ name: '', description: '' });
  const [clientForm, setClientForm] = useState<ClientForm>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleProgramSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!programForm.name) {
      setErrors({ programName: 'Program name is required' });
      return;
    }
    // Placeholder: Log and show success toast
    console.log('Program created:', programForm);
    toast.success('Program created successfully!', { position: 'top-right' });
    setProgramForm({ name: '', description: '' });
    setErrors({});
  };

  const handleClientSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Basic validation
    const newErrors: { [key: string]: string } = {};
    if (!clientForm.firstName) newErrors.firstName = 'First name is required';
    if (!clientForm.lastName) newErrors.lastName = 'Last name is required';
    if (!clientForm.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientForm.email)) newErrors.email = 'Invalid email';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    // Placeholder: Log and show success toast
    console.log('Client registered:', clientForm);
    toast.success('Client registered successfully!', { position: 'top-right' });
    setClientForm({ firstName: '', lastName: '', email: '', dateOfBirth: '' });
    setErrors({});
  };

  return (
    <div className="space-y-8">
      {/* Toast Container */}
      <ToastContainer />

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FiLayers className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Programs</p>
            <p className="text-2xl font-semibold text-gray-800">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FiUsers className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Clients</p>
            <p className="text-2xl font-semibold text-gray-800">245</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <FiAlertCircle className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Actions</p>
            <p className="text-2xl font-semibold text-gray-800">3</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Program Enrollment Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                labelStyle={{ color: '#374151' }}
              />
              <Line type="monotone" dataKey="enrollments" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Program Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Create Health Program</h3>
          <form onSubmit={handleProgramSubmit} className="space-y-4">
            <div>
              <label htmlFor="programName" className="block text-sm font-medium text-gray-600 mb-1">
                Program Name
              </label>
              <input
                id="programName"
                type="text"
                value={programForm.name}
                onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                placeholder="e.g., Malaria"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.programName ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.programName}
                aria-required="true"
              />
              {errors.programName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" /> {errors.programName}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="programDescription" className="block text-sm font-medium text-gray-600 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="programDescription"
                value={programForm.description}
                onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                placeholder="Program details"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              Create Program
            </button>
          </form>
        </div>

        {/* Register Client Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Register Client</h3>
          <form onSubmit={handleClientSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={clientForm.firstName}
                onChange={(e) => setClientForm({ ...clientForm, firstName: e.target.value })}
                placeholder="First Name"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.firstName}
                aria-required="true"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" /> {errors.firstName}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-600 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={clientForm.lastName}
                onChange={(e) => setClientForm({ ...clientForm, lastName: e.target.value })}
                placeholder="Last Name"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.lastName}
                aria-required="true"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" /> {errors.lastName}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={clientForm.email}
                onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                placeholder="Email"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.email}
                aria-required="true"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" /> {errors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-600 mb-1">
                Date of Birth (Optional)
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={clientForm.dateOfBirth}
                onChange={(e) => setClientForm({ ...clientForm, dateOfBirth: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              Register Client
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;