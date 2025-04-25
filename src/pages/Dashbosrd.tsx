import { FC } from 'react';

const Dashboard: FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Welcome to CEMACare</h3>
        <p className="text-gray-600">
          Manage health programs and clients from this dashboard. Use the sidebar to navigate.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;