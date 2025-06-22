"use client"

import { useState, useEffect, useContext, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DarkModeContext } from "../../context/DarkModeContext"
import { useDispatch, useSelector } from "react-redux"
import { setTurfs } from "../../slices/turfSlice"
import { setLoader } from "../../slices/authSlice"
import toast from "react-hot-toast"
import axios from "axios"
import blackBg from "../../assets/Images/blackBg.png"
import whiteBg from "../../assets/Images/whiteBg.png"
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  MapPin,
  DollarSign,
  Users,
  Shield,
  Info,
  ClubIcon as Football,
  SortAsc,
  Grid,
  List,
} from "lucide-react"

const AdminPanel = () => {
  const { darkMode } = useContext(DarkModeContext)
  const dispatch = useDispatch()
  const turfs = useSelector((state) => state.turf.turfs)
  const token = useSelector((state) => state.auth.token)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTurf, setCurrentTurf] = useState(null)
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name") // name, price, location
  const [sortOrder, setSortOrder] = useState("asc") // asc or desc

  const [formData, setFormData] = useState({
    turfName: "",
    turfDescription: "",
    turfTitle: "",
    turfOwner: "",
    turfPricePerHour: "",
    turfLocation: "",
    turfImages: [],
    turfAddress: "",
    turfAmentities: [],
    turfRules: [],
    turfSize: "",
    turfAvailability: true,
    turfOwnerPhoneNumber: "",
    sports: [],
  })

  // Backend integration functions remain unchanged
  const fetchTurfByLocationsOrAll = useCallback(async () => {
    try {
      dispatch(setLoader(true))
      const url = `${VITE_API_BASE_URL}/api/v1/turf/getAllTurf`

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })

      if (response.data.success) {
        const fetchedTurfs = response.data.fetchAllTurf
        dispatch(setTurfs(fetchedTurfs))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong while fetching turf data!")
      console.error(error)
    } finally {
      dispatch(setLoader(false))
      setIsLoading(false)
    }
  }, [dispatch, token])

  useEffect(() => {
    fetchTurfByLocationsOrAll()
  }, [token, fetchTurfByLocationsOrAll])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleArrayInputChange = (e, field) => {
    const { value } = e.target
    setFormData({ ...formData, [field]: value.split(",") })
  }

  const addTurf = async (data) => {
    try {
      dispatch(setLoader(true))
      const url = `${VITE_API_BASE_URL}/api/v1/turf/createTurf`

      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })

      if (response.data.success) {
        toast.success("Turf Created Successfully!")
        await fetchTurfByLocationsOrAll()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong while creating turf data!")
    } finally {
      dispatch(setLoader(false))
      setIsLoading(false)
    }
  }

  const updateTurf = async (id, data) => {
    try {
      dispatch(setLoader(true))
      const url = `${VITE_API_BASE_URL}/api/v1/turf/updateTurf`

      const response = await axios.put(
        url,
        {
          turfId: id,
          data,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      )

      if (response.data.success) {
        toast.success("Turf Updated Successfully!")
        await fetchTurfByLocationsOrAll()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating turf")
    } finally {
      dispatch(setLoader(false))
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      dispatch(setLoader(true))
      const url = `${VITE_API_BASE_URL}/api/v1/turf/deleteTurf`

      const response = await axios.delete(url, {
        data: { turfId: id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })

      if (response.data.success) {
        toast.success("Deleted The Turf Successfully!!")
        dispatch(setTurfs(turfs.filter((turf) => turf._id !== id)))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong while deleting turf data!")
    } finally {
      dispatch(setLoader(false))
      setIsLoading(false)
    }
  }

  const getChangedFields = (formData, currentTurf) => {
    const changedFields = {}

    for (const key in formData) {
      if (key === "sports") {
        const formattedSports = formData[key].map((sport) => (typeof sport === "object" ? sport.sports : sport))
        const currentSports = currentTurf[key].map((sport) => (typeof sport === "object" ? sport.sports : sport))

        if (JSON.stringify(formattedSports) !== JSON.stringify(currentSports)) {
          changedFields[key] = formData[key]
        }
      } else if (Array.isArray(formData[key])) {
        if (JSON.stringify(formData[key]) !== JSON.stringify(currentTurf[key])) {
          changedFields[key] = formData[key]
        }
      } else if (formData[key] !== currentTurf[key]) {
        changedFields[key] = formData[key]
      }
    }

    return changedFields
  }

  const handleEdit = (turf) => {
    setCurrentTurf(turf)
    const formattedSports = turf.sports.map((sport) => (typeof sport === "object" ? sport.sports : sport))

    setFormData({
      ...turf,
      sports: formattedSports,
    })

    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanedFormData = {
      ...formData,
      turfImages: cleanArray(formData.turfImages),
      turfAmentities: cleanArray(formData.turfAmentities),
      turfRules: cleanArray(formData.turfRules),
      sports: cleanArray(formData.sports),
      turfPricePerHour: Number(formData.turfPricePerHour),
      turfSize: Number(formData.turfSize),
    }

    if (currentTurf) {
      const changedFields = getChangedFields(cleanedFormData, currentTurf)
      if (Object.keys(changedFields).length === 0) {
        toast.error("No changes were made!")
        return
      }

      await updateTurf(currentTurf._id, changedFields)
    } else {
      await addTurf(cleanedFormData)
    }

    handleCloseModal()
  }

  const cleanArray = (arr) => {
    if (!Array.isArray(arr)) {
      return []
    }
    return arr.map((item) => {
      if (typeof item === "string") {
        return item.replace(/"/g, "")
      } else if (item && typeof item === "object" && item.sports) {
        return item.sports.replace(/"/g, "")
      }
      return item
    })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentTurf(null)
    setFormData({
      turfName: "",
      turfDescription: "",
      turfTitle: "",
      turfOwner: "",
      turfPricePerHour: "",
      turfLocation: "",
      turfImages: [],
      turfAddress: "",
      turfAmentities: [],
      turfRules: [],
      turfSize: "",
      turfAvailability: true,
      turfOwnerPhoneNumber: "",
      sports: [],
    })
  }

  // Filter and sort turfs
  const filteredAndSortedTurfs = [...turfs]
    .filter((turf) => turf.turfName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.turfName.localeCompare(b.turfName)
          break
        case "price":
          comparison = a.turfPricePerHour - b.turfPricePerHour
          break
        case "location":
          comparison = a.turfLocation.localeCompare(b.turfLocation)
          break
        default:
          comparison = 0
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  return (
    <div
      style={{
        backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
      }}
      className={`min-h-screen pt-4 pb-6 px-3 sm:pt-6 sm:pb-8 sm:px-6 lg:px-8 transition-colors duration-300`}
    >
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-8">
          <div className="mb-3 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-white">Turf Management</h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Manage your turf listings and bookings
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm transition-colors duration-200 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Add New Turf
          </motion.button>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 max-w-full sm:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search turfs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 sm:p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 sm:p-2 rounded-lg ${
                    viewMode === "list"
                      ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <List className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="location">Sort by Location</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-1.5 sm:p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <SortAsc className={`w-4 h-4 sm:w-5 sm:h-5 transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Turfs Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 animate-spin" />
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                : "space-y-3 sm:space-y-4"
            }
          >
            {filteredAndSortedTurfs.map((turf) => (
              <motion.div
                key={turf._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden ${
                  viewMode === "list" ? "" : ""
                }`}
              >
                <div className={viewMode === "list" ? "w-28 h-20 pb-32 sm:pb-0 sm:w-48 sm:h-48 flex-shrink-0" : ""}>
                  <img
                    src={turf.turfImages[0] || "/placeholder.svg"}
                    alt={turf.turfName}
                    className="w-full h-32 sm:h-48 object-cover"
                  />
                </div>
                <div className="p-3 sm:p-4 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                      {turf.turfName}
                    </h2>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      {turf.turfAvailability ? "Available" : "Not Available"}
                    </span>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {turf.turfLocation}
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />₹{turf.turfPricePerHour}/hr
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <Football className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {turf.sports[0]?.sports?.join(", ")}
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 flex items-center justify-end space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(turf)}
                      className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200"
                    >
                      <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(turf._id)}
                      className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {currentTurf ? "Edit Turf" : "Add New Turf"}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Basic Information */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <Info className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                          Basic Information
                        </h3>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Turf Name
                          </label>
                          <input
                            type="text"
                            name="turfName"
                            value={formData.turfName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            name="turfDescription"
                            value={formData.turfDescription}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            name="turfTitle"
                            value={formData.turfTitle}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>
                      </div>

                      {/* Location and Pricing */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                          Location & Pricing
                        </h3>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            name="turfLocation"
                            value={formData.turfLocation}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Address
                          </label>
                          <textarea
                            name="turfAddress"
                            value={formData.turfAddress}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Price per Hour (₹)
                          </label>
                          <input
                            type="number"
                            name="turfPricePerHour"
                            value={formData.turfPricePerHour}
                            onChange={handleInputChange}
                            min="200"
                            max="1000"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>
                      </div>

                      {/* Features and Amenities */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                          Features & Rules
                        </h3>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Amenities (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={formData.turfAmentities.join(",")}
                            onChange={(e) => handleArrayInputChange(e, "turfAmentities")}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Rules (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={formData.turfRules.join(",")}
                            onChange={(e) => handleArrayInputChange(e, "turfRules")}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Sports (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={formData.sports.join(",")}
                            onChange={(e) => handleArrayInputChange(e, "sports")}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                          Additional Details
                        </h3>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Owner Name
                          </label>
                          <input
                            type="text"
                            name="turfOwner"
                            value={formData.turfOwner}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Owner Phone Number
                          </label>
                          <input
                            type="tel"
                            name="turfOwnerPhoneNumber"
                            value={formData.turfOwnerPhoneNumber}
                            onChange={handleInputChange}
                            pattern="[0-9]{10}"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Turf Size (sq. meters)
                          </label>
                          <input
                            type="number"
                            name="turfSize"
                            value={formData.turfSize}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Images (comma-separated URLs)
                          </label>
                          <input
                            type="text"
                            value={formData.turfImages.join(",")}
                            onChange={(e) => handleArrayInputChange(e, "turfImages")}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Availability
                          </label>
                          <select
                            name="turfAvailability"
                            value={formData.turfAvailability}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          >
                            <option value={true}>Available</option>
                            <option value={false}>Not Available</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 sm:space-x-4 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-3 py-2 sm:px-4 sm:py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center text-sm sm:text-base"
                      >
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                        {currentTurf ? "Update Turf" : "Add Turf"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AdminPanel
