import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEye, FiTrash2 } from "react-icons/fi";

interface Feedback {
  id: string;
  title: string;
  category: string;
  rating: number;
  description: string;
  dateSubmitted: string;
}

const Feedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get("/api/feedback");
      setFeedbacks(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to fetch feedback");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }
    try {
      await axios.delete(`/api/feedback/${id}`);
      setFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
      toast.success("Feedback deleted successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to delete feedback");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleView = (id: string) => {
    // You can implement viewing in detail if needed
    toast.info(`Viewing feedback ID: ${id}`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push("⭐");
    }
    return <div>{stars.join(" ")}</div>;
  };

  const filteredFeedback = feedbacks.filter((fb) =>
    fb.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Feedback</h1>
        <input
          type="text"
          placeholder="Search feedback..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-4 py-2"
        />
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedback.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No feedback found.
                  </td>
                </tr>
              ) : (
                filteredFeedback.map((feedback) => (
                  <tr key={feedback.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {feedback.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {feedback.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStars(feedback.rating)}
                    </td>
                    <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500">
                      {feedback.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(feedback.dateSubmitted).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => handleView(feedback.id)}
                        className="text-blue-500 hover:text-blue-700"
                        title="View"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => handleDelete(feedback.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
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
