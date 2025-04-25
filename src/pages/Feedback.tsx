import { FC } from 'react';

const Feedback: FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Feedback</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Feedback (Coming Soon)</h3>
        <p className="text-gray-600">This feature is under development. Stay tuned for updates!</p>
      </div>
    </div>
  );
};

export default Feedback;