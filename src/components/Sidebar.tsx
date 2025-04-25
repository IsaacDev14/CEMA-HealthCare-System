import { FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiLayers, FiLogOut } from 'react-icons/fi';

const Sidebar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Dashboard', icon: <FiHome className="w-5 h-5" />, ariaLabel: 'Go to Dashboard' },
    { to: '/clients', label: 'Clients', icon: <FiUsers className="w-5 h-5" />, ariaLabel: 'View Clients' },
    { to: '/programs', label: 'Programs', icon: <FiLayers className="w-5 h-5" />, ariaLabel: 'Manage Programs' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token'); // Placeholder for token clearing
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-blue-900 text-white shadow-lg flex flex-col">
      <div className="px-6 py-6 border-b border-blue-800">
        <h1 className="text-2xl font-bold tracking-wide">CEMACare</h1>
      </div>
      <nav className="flex-1 px-4 mt-6">
        <ul className="space-y-2">
          {links.map(({ to, label, icon, ariaLabel }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === to
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
                aria-label={ariaLabel}
              >
                {icon}
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-6 py-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-blue-100 hover:bg-blue-800 hover:text-white rounded-lg transition-all duration-200"
          aria-label="Log out"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
        <p className="text-sm text-blue-200 border-t border-blue-800 pt-4 mt-4 text-center">
          © {new Date().getFullYear()} CEMACare
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;