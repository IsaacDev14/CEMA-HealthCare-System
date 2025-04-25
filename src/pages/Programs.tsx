import { FC, useState, ChangeEvent } from 'react';
import { FiSearch, FiTrash2, FiEye } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';

// Types for Program
interface Program {
  id: string;
  name: string;
  description: string;
  createdAt: string; // Added
}

interface ProgramsProps {
  programs: Program[];
  setPrograms: (programs: Program[]) => void;
}

const Programs: FC<ProgramsProps> = ({ programs, setPrograms }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredPrograms = programs.filter((program) =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleView = (id: string) => {
    toast.info(`View program with ID: ${id}`, { position: 'top-right' });
  };

  const handleDelete = (id: string) => {
    setPrograms(programs.filter((program) => program.id !== id));
    toast.success('Program deleted successfully!', { position: 'top-right' });
  };

  return (
    <div className="space-y-8">
      {/* Toast Container */}
      <ToastContainer />

      <h2 className="text-2xl font-semibold text-gray-800">Programs</h2>

      {/* Search */}
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(program.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          aria-label={`View ${program.name}`}
                        >
                          <FiEye className="w-5 h-5" />
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