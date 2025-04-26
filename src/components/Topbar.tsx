import { FC, useState } from 'react';
import { FiBell, FiChevronDown, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Topbar: FC<TopbarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-gray-300 shadow-sm p-4 flex items-center justify-between z-20 transition-all duration-300 ${
        isSidebarOpen ? 'lg:left-64' : 'lg:left-60'
      }`}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
        <h2 className="text-xl font-semibold text-gray-800 hidden md:block">
          CEMA Health System
        </h2>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            aria-label="Search clients"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button
          className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="View notifications"
        >
          <FiBell className="w-5 h-5" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="User menu"
            aria-expanded={isDropdownOpen}
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
            <span className="text-sm font-medium text-gray-700 hidden lg:block">
              Dr. John Doe
            </span>
            <FiChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
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
