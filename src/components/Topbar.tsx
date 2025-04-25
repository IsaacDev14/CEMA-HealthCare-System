import { FC, useState } from 'react';
import { FiBell, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Topbar: FC = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Placeholder for token clearing
    navigate('/login');
  };

  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">CEMACare Health System</h2>
      <div className="flex items-center gap-4">
        <button
          className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="View notifications"
        >
          <FiBell className="w-5 h-5" />
        </button>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="User menu"
            aria-expanded={isDropdownOpen}
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">Dr. John Doe</span>
            <FiChevronDown className="w-4 h-4 text-gray-600" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                aria-label="Log out"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;