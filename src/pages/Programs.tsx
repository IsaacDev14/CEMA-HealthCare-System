// src/pages/Programs.tsx
import { FC, useState } from 'react'
import { FiPlusCircle, FiStethoscope, FiActivity, FiHeart, FiAlertTriangle } from 'react-icons/fi'

interface Program {
  id: number
  name: string
  description: string
  icon: JSX.Element
}

const defaultPrograms: Program[] = [
  { id: 1, name: 'Tuberculosis', description: 'National TB Control Program', icon: <FiStethoscope className="text-red-600" /> },
  { id: 2, name: 'HIV/AIDS', description: 'Care and treatment program', icon: <FiHeart className="text-pink-500" /> },
  { id: 3, name: 'Malaria', description: 'Mosquito-borne disease program', icon: <FiAlertTriangle className="text-green-600" /> },
]

const Programs: FC = () => {
  const [programs, setPrograms] = useState<Program[]>(defaultPrograms)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleAddProgram = () => {
    if (!name || !description) return
    const newProgram: Program = {
      id: programs.length + 1,
      name,
      description,
      icon: <FiActivity className="text-blue-500" />,
    }
    setPrograms([...programs, newProgram])
    setName('')
    setDescription('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-blue-800">
          <FiStethoscope className="text-4xl" />
          Health Programs
        </h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Create New Program</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Program name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 flex-1"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 flex-1"
          />
          <button
            onClick={handleAddProgram}
            className="bg-blue-700 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-blue-800 transition"
          >
            <FiPlusCircle />
            Add
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div
            key={program.id}
            className="bg-white p-5 rounded-lg shadow-md border border-blue-100 flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{program.icon}</div>
              <h4 className="text-lg font-semibold">{program.name}</h4>
            </div>
            <p className="text-gray-600">{program.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Programs
