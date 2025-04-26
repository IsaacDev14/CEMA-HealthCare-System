import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FiSearch, FiTrash2, FiEye, FiEdit, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';

interface Program {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

interface ErrorResponse {
  error?: string;
}

const Programs: FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [editForm, setEditForm] = useState<Partial<Program>>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [deleteProgramId, setDeleteProgramId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/programs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrograms(response.data);
      } catch (error) {
        const errorMessage =
          (error as AxiosError<ErrorResponse>).response?.data?.error || 'Error fetching programs';
        toast.error(errorMessage, { autoClose: 3000 });
      }
    };

    fetchPrograms();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleView = (program: Program) => {
    setSelectedProgram(program);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEdit = (program: Program) => {
    setSelectedProgram(program);
    setEditForm({
      name: program.name,
      description: program.description,
    });
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteRequest = (id: number) => {
    setDeleteProgramId(id);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProgramId) return;

    try {
      const token = localStorage.getItem('token');
      const program = programs.find((p) => p.id === deleteProgramId);
      await axios.delete(`http://localhost:5000/api/programs/${deleteProgramId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrograms(programs.filter((program) => program.id !== deleteProgramId));
      toast.success(
        `Program "${program ? program.name : 'Unknown'}" deleted successfully!`,
        { autoClose: 3000, theme: 'colored' }
      );
    } catch (error) {
      const errorMessage =
        (error as AxiosError<ErrorResponse>).response?.data?.error || 'Error deleting program';
      toast.error(errorMessage, { autoClose: 3000 });
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteProgramId(null);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteOpen(false);
    setDeleteProgramId(null);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;

    const newErrors: { [key: string]: string } = {};
    if (!editForm.name) newErrors.name = 'Program name is required';
    if (!editForm.description) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      toast.error('Please correct the errors in the form.', { autoClose: 3000 });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/programs/${selectedProgram.id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPrograms(programs.map((program) => (program.id === selectedProgram.id ? response.data : program)));
      setModalOpen(false);
      setFormErrors({});
      toast.success(
        `Program "${editForm.name}" updated successfully!`,
        { autoClose: 3000, theme: 'colored' }
      );
    } catch (error) {
      const errorMessage =
        (error as AxiosError<ErrorResponse>).response?.data?.error || 'Error updating program';
      toast.error(errorMessage, { autoClose: 3000 });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProgram(null);
    setEditForm({});
    setFormErrors({});
  };

  const filteredPrograms = programs.filter((program) =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Programs</h2>
      <div className="relative">
        <input
          type="text"
          placeholder="Search programs by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No programs found.</td>
                </tr>
              ) : (
                filteredPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{program.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{program.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(program.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button onClick={() => handleView(program)} className="text-blue-600 hover:text-blue-800" title="View">
                          <FiEye className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleEdit(program)} className="text-green-600 hover:text-green-800" title="Edit">
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteRequest(program.id)} className="text-red-600 hover:text-red-800" title="Delete">
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

      {/* View/Edit Modal */}
      {modalOpen && selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {modalMode === 'view' ? 'Program Details' : 'Edit Program'}
              </h3>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {modalMode === 'view' ? (
              <div className="space-y-4">
                <p><strong>Name:</strong> {selectedProgram.name}</p>
                <p><strong>Description:</strong> {selectedProgram.description}</p>
                <p><strong>Created At:</strong> {new Date(selectedProgram.createdAt).toLocaleDateString()}</p>
                <button
                  onClick={closeModal}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">Program Name</label>
                  <input
                    id="name"
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={`w-full p-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  />
                  {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className={`w-full p-2 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                    rows={4}
                  />
                  {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Confirm Deletion</h3>
              <button onClick={handleDeleteCancel} className="text-gray-600 hover:text-gray-800">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{' '}
              {programs.find((p) => p.id === deleteProgramId)
                ? `"${programs.find((p) => p.id === deleteProgramId)!.name}"`
                : 'this program'}? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={handleDeleteCancel}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;