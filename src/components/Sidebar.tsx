import { FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiLayers, FiLogOut, FiMessageSquare, FiHeart } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Dashboard', icon: <FiHome className="w-5 h-5" />, ariaLabel: 'Go to Dashboard', isPlaceholder: false },
    { to: '/clients', label: 'Clients', icon: <FiUsers className="w-5 h-5" />, ariaLabel: 'View Clients', isPlaceholder: false },
    { to: '/programs', label: 'Programs', icon: <FiLayers className="w-5 h-5" />, ariaLabel: 'Manage Programs', isPlaceholder: false },
    { to: '/suggestions', label: 'Suggestions', icon: <FiMessageSquare className="w-5 h-5" />, ariaLabel: 'View Suggestions', isPlaceholder: false },
    { to: '/feedback', label: 'Feedback', icon: <FiHeart className="w-5 h-5" />, ariaLabel: 'Provide Feedback', isPlaceholder: false },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token'); // Placeholder for token clearing
    navigate('/login');
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl flex flex-col transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'
      } lg:static lg:translate-x-0 lg:w-64 z-30`}
    >
      {/* Logo/Title */}
      <div className="px-6 py-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold tracking-tight">CEMACare</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-6 overflow-y-auto">
        <ul className="space-y-2">
          {links.map(({ to, label, icon, ariaLabel, isPlaceholder }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                  location.pathname === to
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white hover:shadow-sm'
                }`}
                aria-label={ariaLabel}
              >
                {icon}
                <span className="font-medium text-sm">{label}</span>
                {isPlaceholder && (
                  <span className="absolute right-2 text-xs bg-gray-600 text-gray-100 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-blue-100 hover:bg-blue-700 hover:text-white rounded-lg transition-all duration-200 shadow-sm"
          aria-label="Log out"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
        <p className="text-xs text-blue-200 border-t border-blue-700 pt-4 mt-4 text-center">
          © {new Date().getFullYear()} CEMACare
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;