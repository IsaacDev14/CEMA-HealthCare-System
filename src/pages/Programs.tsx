import { FC, useState, ChangeEvent, FormEvent } from 'react';
import {
  FiSearch,
  FiTrash2,
  FiEye,
  FiEdit,
  FiX,
  FiAlertCircle
} from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

// Program interface to define the structure of each program
interface Program {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface ProgramsProps {
  programs: Program[]; // List of programs
  setPrograms: (programs: Program[]) => void; // Function to update the programs
}

const Programs: FC<ProgramsProps> = ({ programs, setPrograms }) => {
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [viewProgram, setViewProgram] = useState<Program | null>(null); // State for viewing a program
  const [editProgram, setEditProgram] = useState<Program | null>(null); // State for editing a program
  const [editForm, setEditForm] = useState<Partial<Program>>({}); // State for editing form values
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Validation errors
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const itemsPerPage = 5; // Programs per page

  // Filter programs based on search term
  const filteredPrograms = programs.filter((program) =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

  // Slice the filtered programs for the current page
  const paginatedPrograms = filteredPrograms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle the change in search term
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  // Set the program to view
  const handleView = (program: Program) => {
    setViewProgram(program);
  };

  // Set the program to edit
  const handleEdit = (program: Program) => {
    setEditProgram(program);
    setEditForm(program); // Pre-fill the form with program data
  };

  // Handle form submission for editing program
  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {}; // Clear errors before validation

    // Validate form inputs
    if (!editForm.name) newErrors.name = 'Program name is required';
    if (!editForm.description)
      newErrors.description = 'Program description is required';

    // If there are validation errors, show a toast message and do not submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields.', { position: 'top-right' });
      return;
    }

    // Update the programs list with the edited program
    setPrograms(
      programs.map((p) =>
        p.id === editProgram!.id ? { ...p, ...editForm } : p
      )
    );

    // Show success toast
    toast.success('Program updated successfully!', { position: 'top-right' });

    // Reset the state
    setEditProgram(null);
    setEditForm({});
    setErrors({});
  };

  // Handle deletion of a program
  const handleDelete = (id: string) => {
    setPrograms(programs.filter((program) => program.id !== id)); // Filter out the deleted program
    toast.success('Program deleted successfully!', { position: 'top-right' });
  };

  return (
    <div className="space-y-8">
      {/* Toast notifications */}
      <ToastContainer />
      <h2 className="text-2xl font-semibold text-gray-800">Programs</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search programs by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 placeholder-gray-400"
              aria-label="Search programs"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Programs table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Table headers */}
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
              {/* Animation for rendering the rows */}
              <AnimatePresence>
                {paginatedPrograms.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      No programs found.
                    </td>
                  </motion.tr>
                ) : (
                  // Render paginated programs
                  paginatedPrograms.map((program) => (
                    <motion.tr
                      key={program.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {program.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{program.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* Actions column with View, Edit, and Delete buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(program)}
                            className="text-blue-600 hover:text-blue-800"
                            aria-label={`View ${program.name}`}
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(program)}
                            className="text-green-600 hover:text-green-800"
                            aria-label={`Edit ${program.name}`}
                          >
                            <FiEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(program.id)}
                            className="text-red-600 hover:text-red-800"
                            aria-label={`Delete ${program.name}`}
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* View Program Modal */}
      <AnimatePresence>
        {viewProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Program Modal */}
      <AnimatePresence>
        {editProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.form
              onSubmit={handleEditSubmit}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-6 w-full max-w-md space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Edit Program</h3>
                <button onClick={() => setEditProgram(null)} type="button" className="text-gray-500 hover:text-gray-700">
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                    <FiAlertCircle /> {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                />
                {errors.description && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                    <FiAlertCircle /> {errors.description}
                  </p>
                )}
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                Save Changes
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Programs;
