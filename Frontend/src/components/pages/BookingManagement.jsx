import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { DarkModeContext } from "../../context/DarkModeContext"
import greenBg from "../../assets/Images/greenBg.png"
import blackBg from "../../assets/Images/blackBg.png"
import whiteBg from "../../assets/Images/whiteBg.png"
import axios from "axios"
import toast from "react-hot-toast"
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  DollarSign,
  BarChart2,
  Download,
} from "lucide-react"

// Assuming you have these actions in your Redux store
// import { setBookings, updateBooking, deleteBooking } from "../../slices/bookingSlice"
import { setLoader } from "../../slices/authSlice"

const BookingManagement = () => {
  const dispatch = useDispatch()
  const { darkMode } = React.useContext(DarkModeContext)
  const token = useSelector((state) => state.auth.token)
  const bookings = useSelector((state) => state.booking.allBookings)

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [sortBy, setSortBy] = useState("date")
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingsPerPage] = useState(10)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    status: "",
    date: "",
    timeSlot: [],
  })

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      dispatch(setLoader(true))
      const response = await axios.get("http://localhost:4000/api/v1/booking/getAllBookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.data.success) {
        dispatch(setBookings(response.data.bookings))
      }
    } catch (error) {
      toast.error("Failed to fetch bookings")
    } finally {
      dispatch(setLoader(false))
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value)
    setCurrentPage(1)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
    setCurrentPage(1)
  }

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen)

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.turf.turfName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "All" || booking.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const sortedBookings = filteredBookings.sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date) - new Date(a.date)
    } else if (sortBy === "status") {
      return a.status.localeCompare(b.status)
    }
    return 0
  })

  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = sortedBookings.slice(indexOfFirstBooking, indexOfLastBooking)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const openEditModal = (booking) => {
    setSelectedBooking(booking)
    setEditFormData({
      status: booking.status,
      date: booking.date,
      timeSlot: booking.timeSlot,
    })
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedBooking(null)
    setEditFormData({ status: "", date: "", timeSlot: [] })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(setLoader(true))
      const response = await axios.put(
        `http://localhost:4000/api/v1/booking/updateBooking/${selectedBooking._id}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (response.data.success) {
        dispatch(updateBooking({ id: selectedBooking._id, updates: editFormData }))
        toast.success("Booking updated successfully")
        closeEditModal()
      }
    } catch (error) {
      toast.error("Failed to update booking")
    } finally {
      dispatch(setLoader(false))
    }
  }

  const handleDeleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        dispatch(setLoader(true))
        const response = await axios.delete(`http://localhost:4000/api/v1/booking/deleteBooking/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.data.success) {
          dispatch(deleteBooking(id))
          toast.success("Booking deleted successfully")
        }
      } catch (error) {
        toast.error("Failed to delete booking")
      } finally {
        dispatch(setLoader(false))
      }
    }
  }

  return (
    <div 
    style={{
            backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
          }} className={`min-h-screen p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-600 dark:text-white">Booking Management</h1>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-grow max-w-sm">
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button
              onClick={toggleFilter}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
            >
              <Filter size={20} className="mr-2" />
              Filter & Sort
              <ChevronDown
                size={20}
                className={`ml-2 transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label
                    htmlFor="filterStatus"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Filter by Status
                  </label>
                  <select
                    id="filterStatus"
                    value={filterStatus}
                    onChange={handleFilterChange}
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="All">All</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sort by
                  </label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={handleSortChange}
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="date">Date</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bookings Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Turf
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Time Slot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {booking._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {booking.turf.turfName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {`${booking.user.firstName} ${booking.user.lastName}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {booking.timeSlot.join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === "Confirmed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : booking.status === "Completed"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(booking)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {/* <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{indexOfFirstBooking + 1}</span> to{" "}
            <span className="font-medium">{Math.min(indexOfLastBooking, sortedBookings.length)}</span> of{" "}
            <span className="font-medium">{sortedBookings.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastBooking >= sortedBookings.length}
              className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div> */}

        {/* Edit Booking Modal */}
        <AnimatePresence>
          {isEditModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit Booking</h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={editFormData.date.split("T")[0]}
                      onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="timeSlot"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Time Slot
                    </label>
                    <input
                      type="text"
                      id="timeSlot"
                      value={editFormData.timeSlot.join(", ")}
                      onChange={(e) => setEditFormData({ ...editFormData, timeSlot: e.target.value.split(", ") })}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Total Bookings</h3>
              <Calendar className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Confirmed Bookings</h3>
              <CheckCircle className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {bookings.filter((booking) => booking.status === "Confirmed").length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Completed Bookings</h3>
              <CheckCircle className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {bookings.filter((booking) => booking.status === "Completed").length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Cancelled Bookings</h3>
              <XCircle className="text-red-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {bookings.filter((booking) => booking.status === "Cancelled").length}
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Activity</h3>
            <ul className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <li key={booking._id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {booking.status === "Confirmed" && <Clock className="text-blue-500" size={20} />}
                    {booking.status === "Completed" && <CheckCircle className="text-green-500" size={20} />}
                    {booking.status === "Cancelled" && <XCircle className="text-red-500" size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {booking.user.firstName} {booking.user.lastName} booked {booking.turf.turfName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(booking.date).toLocaleDateString()} | {booking.timeSlot.join(", ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-300">
                <User className="mr-2" size={20} />
                <span>Manage Users</span>
              </button>
              <button className="flex items-center justify-center p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-300">
                <MapPin className="mr-2" size={20} />
                <span>Manage Turfs</span>
              </button>
              <button className="flex items-center justify-center p-4 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-300">
                <DollarSign className="mr-2" size={20} />
                <span>View Revenue</span>
              </button>
              <button className="flex items-center justify-center p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors duration-300">
                <BarChart2 className="mr-2" size={20} />
                <span>Analytics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Export Data */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Export Data</h3>
          <div className="flex space-x-4">
            <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300">
              <Download className="mr-2" size={20} />
              <span>Export to Excel</span>
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
              <Download className="mr-2" size={20} />
              <span>Export to PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingManagement

