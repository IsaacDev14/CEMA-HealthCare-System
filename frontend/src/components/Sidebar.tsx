import { Link } from 'react-router-dom'
import { HomeIcon, UserIcon, CollectionIcon } from '@heroicons/react/outline'

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-full">
      <div className="p-4 text-xl font-semibold">CEMACare</div>
      <ul className="space-y-4 mt-8">
        <li>
          <Link to="/" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <HomeIcon className="h-6 w-6" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/clients" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <UserIcon className="h-6 w-6" />
            <span>Clients</span>
          </Link>
        </li>
        <li>
          <Link to="/programs" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <CollectionIcon className="h-6 w-6" />
            <span>Programs</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
