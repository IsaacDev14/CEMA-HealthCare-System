import { FC, FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiUsers, FiLayers } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  registeredAt: string;
  Programs: { id: number; name: string }[];
}

interface Program {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

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

interface ErrorResponse {
  error?: string;
}

const getMonthName = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'short' });
};

const aggregateChartData = (clients: Client[], programs: Program[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = months.slice(0, 6).map((month) => ({
    month,
    enrollments: 0,
    clients: 0,
  }));

  programs.forEach((program) => {
    const monthName = getMonthName(program.createdAt);
    const index = chartData.findIndex((data) => data.month === monthName);
    if (index !== -1) chartData[index].enrollments += 1;
  });

  clients.forEach((client) => {
    const monthName = getMonthName(client.registeredAt);
    const index = chartData.findIndex((data) => data.month === monthName);
    if (index !== -1) chartData[index].clients += 1;
  });

  return chartData;
};

const Dashboard: FC = () => {
  const [programForm, setProgramForm] = useState<ProgramForm>({ name: '', description: '' });
  const [clientForm, setClientForm] = useState<ClientForm>({ firstName: '', lastName: '', email: '', dateOfBirth: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please log in to access the dashboard.', { autoClose: 3000 });
          navigate('/login');
          return;
        }

        const [clientsRes, programsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/clients', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/programs', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setClients(clientsRes.data);
        setPrograms(programsRes.data);
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errorMessage = axiosError.response?.data?.error || 'Error fetching data';
        toast.error(errorMessage, { autoClose: 3000 });
        if (axiosError.response?.status === 401) {
          toast.error('Session expired. Please log in again.', { autoClose: 3000 });
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const totalPrograms = programs.length;
  const totalClients = clients.length;
  const pendingActions = clients.filter((client) => client.Programs.length > 0).length;
  const chartData = aggregateChartData(clients, programs);

  const handleProgramSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!programForm.name) newErrors.programName = 'Program name is required';
    if (!programForm.description) newErrors.programDescription = 'Program description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields.', { autoClose: 3000 });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to create a program.', { autoClose: 3000 });
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/programs',
        { name: programForm.name, description: programForm.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPrograms((prev) => [...prev, response.data]);
      setProgramForm({ name: '', description: '' });
      setErrors({});
      toast.success('Program created successfully!', { autoClose: 3000, theme: 'colored' });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Error creating program';
      toast.error(errorMessage, { autoClose: 3000 });
      if (axiosError.response?.status === 401) {
        toast.error('Session expired. Please log in again.', { autoClose: 3000 });
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleClientSubmit = async (e: FormEvent) => {
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
      toast.error('Please correct the errors in the form.', { autoClose: 3000 });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to register a client.', { autoClose: 3000 });
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/clients',
        {
          firstName: clientForm.firstName,
          lastName: clientForm.lastName,
          email: clientForm.email,
          dateOfBirth: clientForm.dateOfBirth,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClients((prev) => [...prev, response.data]);
      setClientForm({ firstName: '', lastName: '', email: '', dateOfBirth: '' });
      setErrors({});
      toast.success('Client registered successfully!', { autoClose: 3000, theme: 'colored' });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Error registering client';
      toast.error(errorMessage, { autoClose: 3000 });
      if (axiosError.response?.status === 401) {
        toast.error('Session expired. Please log in again.', { autoClose: 3000 });
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const clientFields: (keyof ClientForm)[] = ['firstName', 'lastName', 'email'];

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">📋 Create Health Program</h2>
          <form onSubmit={handleProgramSubmit} className="space-y-4">
            <div>
              <label htmlFor="programName" className="text-sm font-medium text-gray-700">
                Program Name
              </label>
              <input
                id="programName"
                type="text"
                value={programForm.name}
                onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                placeholder="e.g., Malaria"
                className={`w-full mt-1 p-3 rounded-lg border ${
                  errors.programName ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500`}
                aria-required="true"
              />
              {errors.programName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" /> {errors.programName}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="programDescription" className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="programDescription"
                value={programForm.description}
                onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                placeholder="Program details"
                className={`w-full mt-1 p-3 border ${
                  errors.programDescription ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500`}
                rows={3}
                aria-required="true"
              />
              {errors.programDescription && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" /> {errors.programDescription}
                </p>
              )}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Create Program
            </button>
          </form>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">🧑 Register Client</h2>
          <form onSubmit={handleClientSubmit} className="space-y-4">
            {clientFields.map((field) => (
              <div key={field}>
                <label htmlFor={field} className="text-sm font-medium text-gray-700 capitalize">
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  id={field}
                  type={field === 'email' ? 'email' : 'text'}
                  value={clientForm[field]}
                  onChange={(e) => setClientForm({ ...clientForm, [field]: e.target.value })}
                  placeholder={field === 'email' ? 'Email address' : `Enter ${field}`}
                  className={`w-full mt-1 p-3 rounded-lg border ${
                    errors[field] ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500`}
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
              <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={clientForm.dateOfBirth}
                onChange={(e) => setClientForm({ ...clientForm, dateOfBirth: e.target.value })}
                className={`w-full mt-1 p-3 border ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500`}
                aria-required="true"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" /> {errors.dateOfBirth}
                </p>
              )}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Register Client
            </button>
          </form>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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