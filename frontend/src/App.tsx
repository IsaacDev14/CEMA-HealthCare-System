import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Programs from './pages/Programs'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/programs" element={<Programs />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App
