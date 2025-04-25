import { FC, FormEvent, useState } from 'react';
import { FiAlertCircle, FiUsers, FiLayers } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';

// Types for Client and Program
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  registeredAt: string;
}

interface Program {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface DashboardProps {
  addClient: (client: Omit<Client, 'id' | 'registeredAt'>) => void;
  addProgram: (program: Omit<Program, 'id' | 'createdAt'>) => void;
  clients: Client[];
  programs: Program[];
}

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

// Helper to get month name from date string
const getMonthName = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'short' });
};

// Aggregate data for charts
const aggregateChartData = (clients: Client[], programs: Program[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Initialize chart data for the last 6 months
  const chartData: { month: string; enrollments: number; clients: number }[] = months.slice(0, 6).map((month) => ({
    month,
    enrollments: 0,
    clients: 0,
  }));

  // Aggregate programs by creation month
  programs.forEach((program) => {
    const monthName = getMonthName(program.createdAt);
    const index = chartData.findIndex((data) => data.month === monthName);
    if (index !== -1) {
      chartData[index].enrollments += 1; // Increment enrollments for that month
    }
  });

  // Aggregate clients by registration month
  clients.forEach((client) => {
    const monthName = getMonthName(client.registeredAt);
    const index = chartData.findIndex((data) => data.month === monthName);
    if (index !== -1) {
      chartData[index].clients += 1; // Increment clients for that month
    }
  });

  return chartData;
};

const Dashboard: FC<DashboardProps> = ({ addClient, addProgram, clients, programs }) => {
  // State to hold form data and errors
  const [programForm, setProgramForm] = useState<ProgramForm>({ name: '', description: '' });
  const [clientForm, setClientForm] = useState<ClientForm>({ firstName: '', lastName: '', email: '', dateOfBirth: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Calculate summary metrics
  const totalPrograms = programs.length;
  const totalClients = clients.length;
  const pendingActions = clients.filter((client) => new Date(client.dateOfBirth) > new Date()).length; // Mock logic

  // Aggregate chart data
  const chartData = aggregateChartData(clients, programs);

  // Handle Program form submission
  const handleProgramSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!programForm.name) {
      newErrors.programName = 'Program name is required';
    }
    if (!programForm.description) {
      newErrors.programDescription = 'Program description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields.', { position: 'top-right' });
      return;
    }

    addProgram({
      name: programForm.name,
      description: programForm.description,
    });

    toast.success('Program created successfully!', { position: 'top-right' });
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
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientForm.email)) newErrors.email = 'Invalid email format';
    if (!clientForm.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    else {
      const today = new Date();
      const dob = new Date(clientForm.dateOfBirth);
      if (dob >= today) newErrors.dateOfBirth = 'Date of birth must be in the past';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please correct the errors in the form.', { position: 'top-right' });
      return;
    }

    addClient({
      firstName: clientForm.firstName,
      lastName: clientForm.lastName,
      email: clientForm.email,
      dateOfBirth: clientForm.dateOfBirth,
    });

    toast.success('Client registered successfully!', { position: 'top-right' });
    setClientForm({ firstName: '', lastName: '', email: '', dateOfBirth: '' });
    setErrors({});
  };

  // Define fields as a typed array
  const clientFields: (keyof ClientForm)[] = ['firstName', 'lastName', 'email'];

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
            <p className="text-xl font-bold text-gray-800">{totalPrograms}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
          <FiUsers className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Total Clients</p>
            <p className="text-xl font-bold text-gray-800">{totalClients}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
          <FiAlertCircle className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Pending Actions</p>
            <p className="text-xl font-bold text-gray-800">{pendingActions}</p>
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
                aria-required="true"
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
                className={`w-full mt-1 p-3 border ${errors.programDescription ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                rows={3}
                aria-required="true"
              />
              {errors.programDescription && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" /> {errors.programDescription}
                </p>
              )}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Create Program</button>
          </form>
        </div>

        {/* === Register Client Form === */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">🧑 Register Client</h2>
          <form onSubmit={handleClientSubmit} className="space-y-4">
            {clientFields.map((field) => (
              <div key={field}>
                <label htmlFor={field} className="text-sm font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  id={field}
                  type={field === 'email' ? 'email' : 'text'}
                  value={clientForm[field]}
                  onChange={(e) => setClientForm({ ...clientForm, [field]: e.target.value })}
                  placeholder={field === 'email' ? 'Email address' : `Enter ${field}`}
                  className={`w-full mt-1 p-3 rounded-lg border ${errors[field] ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`}
                  aria-required="true"
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
                className={`w-full mt-1 p-3 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                aria-required="true"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" /> {errors.dateOfBirth}
                </p>
              )}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Register Client</button>
          </form>
        </div>
      </div>

      {/* === Charts Section === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart for Enrollments */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">📈 Program Creation Trend</h3>
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