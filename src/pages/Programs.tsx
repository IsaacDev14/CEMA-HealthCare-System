import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { FiSearch, FiTrash2, FiEye, FiEdit, FiX, FiAlertCircle } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';

// Types for Program
interface Program {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface ProgramsProps {
  programs: Program[];
  setPrograms: (programs: Program[]) => void;
}

const Programs: FC<ProgramsProps> = ({ programs, setPrograms }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewProgram, setViewProgram] = useState<Program | null>(null);
  const [editProgram, setEditProgram] = useState<Program | null>(null);
  const [editForm, setEditForm] = useState<Partial<Program>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const filteredPrograms = programs.filter((program) =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleView = (program: Program) => {
    setViewProgram(program);
  };

  const handleEdit = (program: Program) => {
    setEditProgram(program);
    setEditForm(program);
  };

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!editForm.name) newErrors.name = 'Program name is required';
    if (!editForm.description) newErrors.description = 'Program description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields.', { position: 'top-right' });
      return;
    }

    setPrograms(programs.map((p) => (p.id === editProgram!.id ? { ...p, ...editForm } : p)));
    toast.success('Program updated successfully!', { position: 'top-right' });
    setEditProgram(null);
    setEditForm({});
    setErrors({});
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
                          onClick={() => handleView(program)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          aria-label={`View ${program.name}`}
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(program)}
                          className="text-green-600 hover:text-green-800 transition-colors duration-200"
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

      {/* View Modal */}
      {viewProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Program Details</h3>
              <button onClick={() => setViewProgram(null)} className="text-gray-500 hover:text-gray-700">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              <p><strong>Name:</strong> {viewProgram.name}</p>
              <p><strong>Description:</strong> {viewProgram.description}</p>
              <p><strong>Created At:</strong> {viewProgram.createdAt}</p>
            </div>
            <button
              onClick={() => setViewProgram(null)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Edit Program</h3>
              <button onClick={() => setEditProgram(null)} className="text-gray-500 hover:text-gray-700">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="text-sm font-medium text-gray-700">Program Name</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g., Malaria"
                  className={`w-full mt-1 p-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" /> {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="edit-description" className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="edit-description"
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Program details"
                  className={`w-full mt-1 p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" /> {errors.description}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;