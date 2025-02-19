import { useState, useEffect, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faEdit, faTrash, faTimes, faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { DarkModeContext } from "../../context/DarkModeContext"

const AdminPanel = () => {
  const { darkMode } = useContext(DarkModeContext)
  const [turfs, setTurfs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTurf, setCurrentTurf] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    sport: "",
    image: "",
  })

  useEffect(() => {
    setTimeout(() => {
      setTurfs([
        {
          id: 1,
          name: "Green Valley Turf",
          location: "Mumbai",
          price: 1200,
          sport: "Football",
          image: "",
        },
        {
          id: 2,
          name: "City Central Arena",
          location: "Delhi",
          price: 1500,
          sport: "Cricket",
          image: "",
        },
        {
          id: 3,
          name: "Sunset Sports Complex",
          location: "Bangalore",
          price: 1000,
          sport: "Tennis",
          image: "",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (currentTurf) {
      setTurfs(turfs.map((turf) => (turf.id === currentTurf.id ? { ...turf, ...formData } : turf)))
    } else {
      setTurfs([...turfs, { id: Date.now(), ...formData }])
    }
    handleCloseModal()
  }

  const handleEdit = (turf) => {
    setCurrentTurf(turf)
    setFormData(turf)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    setTurfs(turfs.filter((turf) => turf.id !== id))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentTurf(null)
    setFormData({ name: "", location: "", price: "", sport: "", image: "" })
  }

  return (
    <div className={`min-h-screen p-8  mt-16 ${darkMode ? "dark" : ""}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Turf Management</h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add New Turf
        </motion.button>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-green-500 dark:text-green-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {turfs.map((turf) => (
              <motion.div
                key={turf.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <img src={turf.image || ""} alt={""} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{turf.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">Location: {turf.location}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">Price: ₹{turf.price}/hr</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Sport: {turf.sport}</p>
                  <div className="flex justify-end space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                      onClick={() => handleEdit(turf)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                      onClick={() => handleDelete(turf.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                  {currentTurf ? "Edit Turf" : "Add New Turf"}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="location" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="price" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Price (₹/hr)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="sport" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Sport
                    </label>
                    <input
                      type="text"
                      id="sport"
                      name="sport"
                      value={formData.sport}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="image" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                    >
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      {currentTurf ? "Update" : "Add"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300"
                    >
                      <FontAwesomeIcon icon={faTimes} className="mr-2" />
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AdminPanel

