import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { FiSearch, FiTrash2, FiEye, FiEdit, FiX } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';

// Types for Client and Program
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  registeredAt: string;
  programIds: string[];
}

interface Program {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface ClientsProps {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  programs: Program[];
}

const Clients: FC<ClientsProps> = ({ clients, setClients, programs }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [conditionFilter, setConditionFilter] = useState<string>('All');
  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [editForm, setEditForm] = useState<Partial<Client>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const conditions = ['All', 'Hypertension', 'Diabetes', 'Asthma', 'Other'];

  const filteredClients = clients.filter((client) => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const clientCondition = client.email.includes('example') ? 'Unknown' : 'Other'; // Mock condition for demo
    const matchesCondition = conditionFilter === 'All' || clientCondition === conditionFilter;
    return matchesSearch && matchesCondition;
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleConditionFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setConditionFilter(e.target.value);
  };

  const handleView = (client: Client) => {
    setViewClient(client);
  };

  const handleEdit = (client: Client) => {
    setEditClient(client);
    setEditForm(client);
  };

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!editForm.firstName) newErrors.firstName = 'First name is required';
    if (!editForm.lastName) newErrors.lastName = 'Last name is required';
    if (!editForm.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email!)) newErrors.email = 'Invalid email format';
    if (!editForm.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    else {
      const today = new Date();
      const dob = new Date(editForm.dateOfBirth!);
      if (dob >= today) newErrors.dateOfBirth = 'Date of birth must be in the past';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please correct the errors in the form.', { position: 'top-right' });
      return;
    }

    setClients(clients.map((c) => (c.id === editClient!.id ? { ...c, ...editForm } : c)));
    toast.success('Client updated successfully!', { position: 'top-right' });
    setEditClient(null);
    setEditForm({});
    setErrors({});
  };

  const handleDelete = (id: string) => {
    setClients(clients.filter((client) => client.id !== id));
    toast.success('Client deleted successfully!', { position: 'top-right' });
  };

  const handleProgramToggle = (programId: string) => {
    const currentProgramIds = editForm.programIds || [];
    const updatedProgramIds = currentProgramIds.includes(programId)
      ? currentProgramIds.filter((id) => id !== programId)
      : [...currentProgramIds, programId];
    setEditForm({ ...editForm, programIds: updatedProgramIds });
  };

  return (
    <div className="space-y-8">
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
            value={conditionFilter}
            onChange={handleConditionFilterChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-gray-600"
            aria-label="Filter by condition"
          >
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No clients found.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.firstName} {client.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.dateOfBirth}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(client)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          aria-label={`View ${client.firstName} ${client.lastName}`}
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(client)}
                          className="text-green-600 hover:text-green-800 transition-colors duration-200"
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

      {/* View Modal */}
      {viewClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Client Details</h3>
              <button onClick={() => setViewClient(null)} className="text-gray-500 hover:text-gray-700">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              <p><strong>Name:</strong> {viewClient.firstName} {viewClient.lastName}</p>
              <p><strong>Email:</strong> {viewClient.email}</p>
              <p><strong>Date of Birth:</strong> {viewClient.dateOfBirth}</p>
              <p><strong>Registered At:</strong> {viewClient.registeredAt}</p>
              <p><strong>Enrolled Programs:</strong> {viewClient.programIds.length > 0 ? viewClient.programIds.map(id => programs.find(p => p.id === id)?.name).join(', ') : 'None'}</p>
            </div>
            <button
              onClick={() => setViewClient(null)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Edit Client</h3>
              <button onClick={() => setEditClient(null)} className="text-gray-500 hover:text-gray-700">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {['firstName', 'lastName', 'email'].map((field) => (
                <div key={field}>
                  <label htmlFor={`edit-${field}`} className="text-sm font-medium text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    id={`edit-${field}`}
                    type={field === 'email' ? 'email' : 'text'}
                    value={(editForm[field as keyof Client] as string) || ''}
                    onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                    placeholder={`Enter ${field}`}
                    className={`w-full mt-1 p-3 rounded-lg border ${errors[field] ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" /> {errors[field]}
                    </p>
                  )}
                </div>
              ))}
              <div>
                <label htmlFor="edit-dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  id="edit-dateOfBirth"
                  type="date"
                  value={editForm.dateOfBirth || ''}
                  onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                  className={`w-full mt-1 p-3 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" /> {errors.dateOfBirth}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Enrolled Programs</label>
                <div className="mt-1 space-y-2">
                  {programs.map((program) => (
                    <div key={program.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`program-${program.id}`}
                        checked={(editForm.programIds || []).includes(program.id)}
                        onChange={() => handleProgramToggle(program.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`program-${program.id}`} className="text-sm text-gray-700">{program.name}</label>
                    </div>
                  ))}
                </div>
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

export default Clients;