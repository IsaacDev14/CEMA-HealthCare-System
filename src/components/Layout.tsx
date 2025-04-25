// src/components/Layout.tsx
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Render child routes here */}
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
