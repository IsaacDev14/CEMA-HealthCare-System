import Sidebar from './Sidebar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  )
}

export default Layout
