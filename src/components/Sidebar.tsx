// src/components/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiUsers, FiLayers } from 'react-icons/fi'

const Sidebar = () => {
  const location = useLocation()

  const links = [
    { to: '/', label: 'Dashboard', icon: <FiHome /> },
    { to: '/clients', label: 'Clients', icon: <FiUsers /> },
    { to: '/programs', label: 'Programs', icon: <FiLayers /> },
  ]

  return (
    <div className="w-64 min-h-screen bg-blue-900 text-white shadow-lg flex flex-col">
      <div className="px-6 py-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold tracking-wide">CEMACare</h1>
      </div>
      <nav className="flex-1 px-4 mt-6">
        <ul className="space-y-2">
          {links.map(({ to, label, icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === to
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <span className="text-lg">{icon}</span>
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-6 py-4 mt-auto text-sm text-blue-200 border-t border-blue-700">
        &copy; {new Date().getFullYear()} CEMACare
      </div>
    </div>
  )
}

export default Sidebar
