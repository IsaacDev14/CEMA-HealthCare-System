import { FC, useState, ChangeEvent } from 'react';
import { FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';

// Types for Program
interface Program {
  id: string;
  name: string;
  description: string;
  enrollmentCount: number;
  status: 'Active' | 'Inactive';
}

const Programs: FC = () => {
  // Mock data for programs (replace with real data from backend later)
  const [programs, setPrograms] = useState<Program[]>([
    { id: '1', name: 'Malaria', description: 'Malaria prevention program', enrollmentCount: 120, status: 'Active' },
    { id: '2', name: 'HIV/AIDS', description: 'HIV/AIDS awareness campaign', enrollmentCount: 85, status: 'Active' },
    { id: '3', name: 'Tuberculosis', description: 'TB treatment initiative', enrollmentCount: 45, status: 'Inactive' },
    { id: '4', name: 'Vaccination Drive', description: 'Childhood vaccination program', enrollmentCount: 200, status: 'Active' },
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter programs based on search term and status
  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || program.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleEdit = (id: string) => {
    // Placeholder for edit functionality
    toast.info(`Edit program with ID: ${id}`, { position: 'top-right' });
  };

  const handleDelete = (id: string) => {
    // Placeholder for delete functionality
    setPrograms(programs.filter((program) => program.id !== id));
    toast.success('Program deleted successfully!', { position: 'top-right' });
  };

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <ToastContainer />

      <h2 className="text-2xl font-semibold text-gray-800">Health Programs</h2>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search programs by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-gray-600 placeholder-gray-400"
              aria-label="Search programs"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-gray-600"
            aria-label="Filter by status"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Programs Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No programs found.
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {program.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{program.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {program.enrollmentCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          program.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {program.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(program.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          aria-label={`Edit ${program.name}`}
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(program.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          aria-label={`Delete ${program.name}`}
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

export default Programs;