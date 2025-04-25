import { FC, FormEvent, useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

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
    // Placeholder: Log and reset form
    console.log('Program created:', programForm);
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
    // Placeholder: Log and reset form
    console.log('Client registered:', clientForm);
    setClientForm({ firstName: '', lastName: '', email: '', dateOfBirth: '' });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Program Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Create Health Program</h3>
          <form onSubmit={handleProgramSubmit} className="space-y-4">
            <div>
              <label htmlFor="programName" className="block text-sm font-medium text-gray-600">
                Program Name
              </label>
              <input
                id="programName"
                type="text"
                value={programForm.name}
                onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                placeholder="e.g., Malaria"
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                aria-invalid={!!errors.programName}
                aria-required="true"
              />
              {errors.programName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FiAlertCircle /> {errors.programName}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="programDescription" className="block text-sm font-medium text-gray-600">
                Description (Optional)
              </label>
              <textarea
                id="programDescription"
                value={programForm.description}
                onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                placeholder="Program details"
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
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
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={clientForm.firstName}
                onChange={(e) => setClientForm({ ...clientForm, firstName: e.target.value })}
                placeholder="First Name"
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                aria-invalid={!!errors.firstName}
                aria-required="true"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FiAlertCircle /> {errors.firstName}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={clientForm.lastName}
                onChange={(e) => setClientForm({ ...clientForm, lastName: e.target.value })}
                placeholder="Last Name"
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                aria-invalid={!!errors.lastName}
                aria-required="true"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FiAlertCircle /> {errors.lastName}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={clientForm.email}
                onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                placeholder="Email"
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                aria-invalid={!!errors.email}
                aria-required="true"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FiAlertCircle /> {errors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-600">
                Date of Birth (Optional)
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={clientForm.dateOfBirth}
                onChange={(e) => setClientForm({ ...clientForm, dateOfBirth: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
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