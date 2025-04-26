import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FiSearch, FiTrash2, FiEye, FiEdit, FiX } from 'react-icons/fi';
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

interface ErrorResponse {
  error?: string;
}

const Clients: FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editForm, setEditForm] = useState<Partial<Client>>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [deleteClientId, setDeleteClientId] = useState<number | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/clients', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data);
      } catch (error) {
        const errorMessage =
          (error as AxiosError<ErrorResponse>).response?.data?.error || 'Error fetching clients';
        toast.error(errorMessage, { autoClose: 3000 });
      }
    };

    fetchClients();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleView = (client: Client) => {
    setSelectedClient(client);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setEditForm({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      dateOfBirth: client.dateOfBirth,
    });
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteRequest = (id: number) => {
    setDeleteClientId(id);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteClientId) return;

    try {
      const token = localStorage.getItem('token');
      const client = clients.find((c) => c.id === deleteClientId);
      await axios.delete(`http://localhost:5000/api/clients/${deleteClientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(clients.filter((client) => client.id !== deleteClientId));
      toast.success(
        `Client "${client ? `${client.firstName} ${client.lastName}` : 'Unknown'}" deleted successfully!`,
        { autoClose: 3000, theme: 'colored' }
      );
    } catch (error) {
      const errorMessage =
        (error as AxiosError<ErrorResponse>).response?.data?.error || 'Error deleting client';
      toast.error(errorMessage, { autoClose: 3000 });
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteClientId(null);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteOpen(false);
    setDeleteClientId(null);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    const newErrors: { [key: string]: string } = {};
    if (!editForm.firstName) newErrors.firstName = 'First name is required';
    if (!editForm.lastName) newErrors.lastName = 'Last name is required';
    if (!editForm.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email || '')) newErrors.email = 'Invalid email format';
    if (!editForm.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    else {
      const today = new Date();
      const dob = new Date(editForm.dateOfBirth);
      if (dob >= today) newErrors.dateOfBirth = 'Date of birth must be in the past';
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      toast.error('Please correct the errors in the form.', { autoClose: 3000 });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/clients/${selectedClient.id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClients(clients.map((client) => (client.id === selectedClient.id ? response.data : client)));
      setModalOpen(false);
      setFormErrors({});
      toast.success(
        `Client "${editForm.firstName} ${editForm.lastName}" updated successfully!`,
        { autoClose: 3000, theme: 'colored' }
      );
    } catch (error) {
      const errorMessage =
        (error as AxiosError<ErrorResponse>).response?.data?.error || 'Error updating client';
      toast.error(errorMessage, { autoClose: 3000 });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedClient(null);
    setEditForm({});
    setFormErrors({});
  };

  const filteredClients = clients.filter((client) =>
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Clients</h2>
      <div className="relative">
        <input
          type="text"
          placeholder="Search clients by name..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No clients found.</td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${client.firstName} ${client.lastName}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(client.dateOfBirth).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(client.registeredAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.Programs.map((p) => p.name).join(', ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button onClick={() => handleView(client)} className="text-blue-600 hover:text-blue-800" title="View">
                          <FiEye className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleEdit(client)} className="text-green-600 hover:text-green-800" title="Edit">
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteRequest(client.id)} className="text-red-600 hover:text-red-800" title="Delete">
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
      {modalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {modalMode === 'view' ? 'Client Details' : 'Edit Client'}
              </h3>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {modalMode === 'view' ? (
              <div className="space-y-4">
                <p><strong>Name:</strong> {selectedClient.firstName} {selectedClient.lastName}</p>
                <p><strong>Email:</strong> {selectedClient.email}</p>
                <p><strong>Date of Birth:</strong> {new Date(selectedClient.dateOfBirth).toLocaleDateString()}</p>
                <p><strong>Registered At:</strong> {new Date(selectedClient.registeredAt).toLocaleDateString()}</p>
                <p><strong>Programs:</strong> {selectedClient.Programs.map((p) => p.name).join(', ') || 'None'}</p>
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
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={editForm.firstName || ''}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className={`w-full p-2 border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  />
                  {formErrors.firstName && <p className="text-red-500 text-sm">{formErrors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={editForm.lastName || ''}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className={`w-full p-2 border ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  />
                  {formErrors.lastName && <p className="text-red-500 text-sm">{formErrors.lastName}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className={`w-full p-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  />
                  {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                </div>
                <div>
                  <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={editForm.dateOfBirth || ''}
                    onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                    className={`w-full p-2 border ${formErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  />
                  {formErrors.dateOfBirth && <p className="text-red-500 text-sm">{formErrors.dateOfBirth}</p>}
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
              {clients.find((c) => c.id === deleteClientId)
                ? `"${clients.find((c) => c.id === deleteClientId)!.firstName} ${clients.find((c) => c.id === deleteClientId)!.lastName}"`
                : 'this client'}? This action cannot be undone.
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

export default Clients;