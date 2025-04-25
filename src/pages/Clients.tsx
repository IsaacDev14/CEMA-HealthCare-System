import { FC, useState, ChangeEvent } from 'react';
import { FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';

// Types for Client
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  enrolledPrograms: string[];
}

// Mock programs data (same as Programs page for filtering)
const programsList = [
  { id: '1', name: 'Malaria' },
  { id: '2', name: 'HIV/AIDS' },
  { id: '3', name: 'Tuberculosis' },
  { id: '4', name: 'Vaccination Drive' },
];

const Clients: FC = () => {
  // Mock data for clients (replace with real data from backend later)
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      dateOfBirth: '1990-05-15',
      enrolledPrograms: ['Malaria', 'Vaccination Drive'],
    },
    {
      id: '2',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      dateOfBirth: '1985-08-22',
      enrolledPrograms: ['HIV/AIDS'],
    },
    {
      id: '3',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      dateOfBirth: '1995-03-10',
      enrolledPrograms: ['Tuberculosis', 'Malaria'],
    },
    {
      id: '4',
      firstName: 'Bob',
      lastName: 'Brown',
      email: 'bob.brown@example.com',
      dateOfBirth: '1978-11-30',
      enrolledPrograms: ['Vaccination Drive'],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [programFilter, setProgramFilter] = useState<string>('All');

  // Filter clients based on search term and enrolled program
  const filteredClients = clients.filter((client) => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesProgram =
      programFilter === 'All' || client.enrolledPrograms.includes(programFilter);
    return matchesSearch && matchesProgram;
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleProgramFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setProgramFilter(e.target.value);
  };

  const handleEdit = (id: string) => {
    // Placeholder for edit functionality
    toast.info(`Edit client with ID: ${id}`, { position: 'top-right' });
  };

  const handleDelete = (id: string) => {
    // Placeholder for delete functionality
    setClients(clients.filter((client) => client.id !== id));
    toast.success('Client deleted successfully!', { position: 'top-right' });
  };

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <ToastContainer />

      <h2 className="text-2xl font-semibold text-gray-800">Clients</h2>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search clients by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-gray-600 placeholder-gray-400"
              aria-label="Search clients"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
        <div className="w-full sm:w-48">
          <select
            value={programFilter}
            onChange={handleProgramFilterChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-gray-600"
            aria-label="Filter by enrolled program"
          >
            <option value="All">All Programs</option>
            {programsList.map((program) => (
              <option key={program.id} value={program.name}>
                {program.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrolled Programs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No clients found.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.firstName} ${client.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{client.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.dateOfBirth || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {client.enrolledPrograms.join(', ') || 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(client.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          aria-label={`Edit ${client.firstName} ${client.lastName}`}
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          aria-label={`Delete ${client.firstName} ${client.lastName}`}
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clients;