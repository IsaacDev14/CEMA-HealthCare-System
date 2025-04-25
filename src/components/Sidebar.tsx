// src/components/Sidebar.tsx
import { FiHome, FiUser, FiClipboard } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white">
      <div className="flex items-center justify-center p-4">
        <h2 className="text-xl font-semibold">CEMACare</h2>
      </div>
      <nav className="mt-5">
        <ul>
          <li>
            <Link to="/" className="flex items-center p-3 hover:bg-gray-700">
              <FiHome className="h-5 w-5 mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/clients" className="flex items-center p-3 hover:bg-gray-700">
              <FiUser className="h-5 w-5 mr-2" />
              Clients
            </Link>
          </li>
          <li>
            <Link to="/programs" className="flex items-center p-3 hover:bg-gray-700">
              <FiClipboard className="h-5 w-5 mr-2" />
              Programs
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
