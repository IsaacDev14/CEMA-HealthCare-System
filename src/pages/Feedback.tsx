import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FiSearch, FiTrash2, FiEye, FiStar } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

interface Feedback {
  id: number;
  title: string;
  description: string;
  rating: number;
  category: string;
  dateSubmitted: string;
}

const Feedback: FC = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: 3,
    category: 'Service Quality',
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['Service Quality', 'System Usability', 'Other'];

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/feedback', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbackList(response.data);
      } catch (err) {
        toast.error('Error fetching feedback');
      }
    };

    fetchFeedback();
  }, []);

  const filteredFeedback = feedbackList.filter((feedback) => {
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || feedback.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }));
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
      const response = await axios.post('http://localhost:5000/api/feedback', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbackList((prev) => [...prev, response.data]);
      setFormData({ title: '', description: '', rating: 3, category: 'Service Quality' });
      toast.success('Feedback submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error submitting feedback');
    }
  };

  const handleView = (id: number) => {
    toast.info(`View feedback with ID: ${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbackList(feedbackList.filter((feedback) => feedback.id !== id));
      toast.success('Feedback deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error deleting feedback');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <FiStar
            key={index}
            className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <ToastContainer />
      <h2 className="text-2xl font-semibold text-gray-800">Feedback</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Submit Feedback</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-600 mb-1">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter feedback title"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-600 mb-1">Rating (1-5)</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>{value} Star{value !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your feedback"
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows={4}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Submit Feedback
          </button>
        </form>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search feedback by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="w-full sm:w-48">
          <select
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFeedback.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No feedback found.</td>
                </tr>
              ) : (
                filteredFeedback.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{feedback.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feedback.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderStars(feedback.rating)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{feedback.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(feedback.dateSubmitted).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button onClick={() => handleView(feedback.id)} className="text-blue-600 hover:text-blue-800">
                          <FiEye className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(feedback.id)} className="text-red-600 hover:text-red-800">
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

export default Feedback;