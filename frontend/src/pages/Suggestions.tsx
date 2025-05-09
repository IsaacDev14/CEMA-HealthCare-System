import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FiSearch, FiTrash2, FiEye } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { api } from '../App';

interface Suggestion {
  id: number;
  title: string;
  description: string;
  category: string;
  dateSubmitted: string;
}

const Suggestions: FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'System Improvement',
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['System Improvement', 'Client Care', 'Other'];

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${api}/suggestions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuggestions(response.data);
      } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        toast.error(err.response?.data?.error || 'Error fetching suggestions');
      }
    };

    fetchSuggestions();
  }, []);

  const filteredSuggestions = suggestions.filter((suggestion) => {
    const matchesSearch = suggestion.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || suggestion.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Title is required!');
      return;
    }
    if (!formData.description) {
      toast.error('Description is required!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${api}/suggestions`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions((prev) => [...prev, response.data]);
      setFormData({ title: '', description: '', category: 'System Improvement' });
      toast.success('Suggestion submitted successfully!');
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      toast.error(err.response?.data?.error || 'Error submitting suggestion');
    }
  };

  const handleView = (id: number) => {
    toast.info(`View suggestion with ID: ${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${api}/suggestions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions((prev) => prev.filter((suggestion) => suggestion.id !== id));
      toast.success('Suggestion deleted successfully!');
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      toast.error(err.response?.data?.error || 'Error deleting suggestion');
    }
  };

  return (
    <div className="space-y-8">
      <ToastContainer />
      <h2 className="text-2xl font-semibold text-gray-800">Suggestions</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Submit Suggestion</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-600 mb-1">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter suggestion title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your suggestion"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={4}
              aria-required="true"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Submit Suggestion
          </button>
        </form>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search suggestions by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="w-full sm:w-48">
          <select
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuggestions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No suggestions found.
                  </td>
                </tr>
              ) : (
                filteredSuggestions.map((suggestion) => (
                  <tr key={suggestion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {suggestion.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {suggestion.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{suggestion.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(suggestion.dateSubmitted).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(suggestion.id)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label={`View suggestion ${suggestion.title}`}
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(suggestion.id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label={`Delete suggestion ${suggestion.title}`}
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

export default Suggestions;
