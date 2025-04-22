"use client"

import { useState, useContext, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { loadNotification } from "../../slices/notificationSlice"
import { useSelector, useDispatch } from "react-redux"
import greenBg from "../../assets/Images/greenBg.png"
import whiteBg from "../../assets/Images/whiteBg.png"
import blackBg from "../../assets/Images/blackBg.png"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { setLoader } from "../../slices/authSlice"
import {
  faTachometerAlt,
  faCalendarAlt,
  faHistory,
  faCog,
  faFutbol,
  faMapMarkerAlt,
  faTicketAlt,
  faChartLine,
  faSignOutAlt,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"
import { DarkModeContext } from "../../context/DarkModeContext"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import MyBookings from "./MyBookings"
import BookingHistory from "./BookingHistory"
import toast from "react-hot-toast"

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { darkMode } = useContext(DarkModeContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [sortBy, setSortBy] = useState("date")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // On larger screens, sidebar should be open by default
      if (!mobile) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    // Initial check
    checkIsMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen)

  const notifications = useSelector((state) => state.notification.notifications)
  const user = useSelector((state) => state.auth.user)
  const allBookings = useSelector((state) => state.booking.allBookings)
  const currentBookings = useSelector((state) => state.booking.currentBookings)
  const cancelBooked = useSelector((state) => state.booking.cancelBooked)
  const token = useSelector((state) => state.auth.token)
  const rescheduledBookings = useSelector((state) => state.booking.rescheduledBookings)
  const previousBookings = useSelector((state) => state.booking.previousBookings)
  const [trendData, setTrendData] = useState([])

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        dispatch(setLoader(true))

        const response = await axios.get(`http://localhost:4000/api/v1/turf/getMonthlyBookingsTrend/${user?._id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        console.log("Response from backend total monthly trend", response.data)
        setTrendData(response.data)
      } catch (error) {
        console.log("Error", error.response?.data || error.message)
        toast.error(error.response?.data?.message || "Unable to fetch trend Data")
      } finally {
        dispatch(setLoader(false))
      }
    }
    if (user && user._id) {
      fetchTrendData()
    }
  }, [user?._id, token, dispatch])

  useEffect(() => {
    dispatch(loadNotification())
  }, [dispatch])

  const isOverviewPage = activeSection === "overview"

  const quickStats = [
    { icon: faFutbol, title: "Total Bookings", value: allBookings.length },
    {
      icon: faMapMarkerAlt,
      title: "Favorite Turf",
      value: getMostBookedTurf(),
    },
    {
      icon: faTicketAlt,
      title: "Upcoming Bookings",
      value: currentBookings.length,
    },
    {
      icon: faChartLine,
      title: "Completed Bookings",
      value: previousBookings.length,
    },
  ]

  const bookingStatusData = [
    { name: "Confirmed", value: currentBookings.length },
    { name: "Completed", value: previousBookings.length },
    { name: "Cancelled", value: cancelBooked.length },
  ]

  const bookingTrendData = trendData

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const sidebarItems = [
    { icon: faTachometerAlt, label: "Overview", section: "overview" },
    { icon: faCalendarAlt, label: "My Bookings", section: "mybookings" },
    { icon: faHistory, label: "Booking History", section: "history" },
    { icon: faCog, label: "Settings", section: "settings" },
  ]

  const filteredBookings = allBookings
    .filter((booking) => {
      const matchesTurfName = booking.turf?.turfName?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSport = booking.turf?.sports?.some((sport) =>
        sport.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      const matchesStatus = filterStatus === "All" || booking.status === filterStatus
      return (matchesTurfName || matchesSport) && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date)
      if (sortBy === "price") return b.turf?.turfPricePerHour - a.turf?.turfPricePerHour
      return 0
    })

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            <QuickStats stats={quickStats} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <BookingStatusChart data={bookingStatusData} colors={COLORS} />
              <BookingTrendChart data={bookingTrendData} />
            </div>
            <RecentBookings bookings={currentBookings.slice(0, 5)} title="Recent Bookings" />
          </>
        )
      case "mybookings":
        return <MyBookings />
      case "history":
        return <BookingHistory />
      case "settings":
        return <SettingsSection user={user} />
      default:
        return null
    }
  }

  // Handle sidebar item click - on mobile, close sidebar after selection
  const handleSidebarItemClick = (section) => {
    setActiveSection(section)
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <div
      style={{
        backgroundImage: `url(${darkMode ? blackBg : greenBg})`,
      }}
      className={`min-h-screen mt-12 bg-gray-100 dark:bg-gray-900`}
    >
      <div className="flex relative">
        {/* Mobile Sidebar Toggle Button */}
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="md:hidden fixed z-50 bottom-6 left-6 p-3 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
            aria-label="Open sidebar"
          >
            <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
          </button>
        )}

        {/* Sidebar - with responsive classes */}
        <aside
          className={`fixed md:sticky h-[93vh] w-[80vw] sm:w-[60vw] md:w-[25vw] lg:w-[20vw] left-0 top-12 bottom-0 dark:border-gray-500 z-40 transition-all duration-300 ease-in-out overflow-y-auto
            ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 border-r border-gray-200 dark:border-gray-700 flex-shrink-0`}
        >
          <div
            style={{
              backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
            }}
            className="flex flex-col h-full"
          >
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl sm:text-2xl mt-4 sm:mt-8 font-serif font-bold text-green-600 dark:text-green-400">
                User Dashboard
              </h2>
              {isMobile && (
                <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
            <nav className="flex-1">
              <ul className="p-4 space-y-3">
                {sidebarItems.map((item) => (
                  <li key={item.section}>
                    <button
                      onClick={() => handleSidebarItemClick(item.section)}
                      className={`flex items-center w-full p-2 rounded-lg transition-colors duration-200 ${
                        activeSection === item.section
                          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t dark:border-gray-700">
              <button
                onClick={() => {}}
                className="flex items-center w-full p-2 rounded-lg text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content - with responsive padding */}
        <main
          className={`flex-1 p-3 sm:p-4 md:p-6 lg:p-8 transition-all duration-300 ${isSidebarOpen && !isMobile ? "md:ml-0" : ""}`}
        >
          <div className="overflow-y-auto" style={{ height: "calc(100vh - 48px)" }}>
            {/* Header */}
            {isOverviewPage && (
              <header className="bg-white dark:bg-gray-800 shadow-lg p-3 sm:p-4 rounded-lg flex justify-between items-center mb-2 sm:mb-4">
                <div className="flex items-center gap-2">
                  {/* Add hamburger menu button for mobile */}
                  <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon icon={faBars} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white font-orbitron">
                    Welcome,{" "}
                    <span className="text-green-500 font-serif">
                      {user?.firstName?.charAt(0).toUpperCase() + user?.firstName?.slice(1)}{" "}
                      {user?.lastName?.charAt(0).toUpperCase() + user?.lastName?.slice(1)}
                    </span>
                  </h1>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="relative">
                    <img
                      src={user?.image || "/placeholder.svg"}
                      alt={"User profile"}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-green-500 dark:border-green-400"
                    />
                  </div>
                </div>
              </header>
            )}

            {/* Add header with hamburger menu for non-overview pages on mobile */}
            {!isOverviewPage && (
              <header className="md:hidden bg-white dark:bg-gray-800 shadow-lg p-3 rounded-lg flex items-center mb-2 sm:mb-4">
                <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FontAwesomeIcon icon={faBars} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
                <h2 className="ml-2 text-lg font-bold text-gray-800 dark:text-white">
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </h2>
              </header>
            )}

            {/* Dynamic Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

const QuickStats = ({ stats }) => (
  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
    {stats.map((stat, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="p-2 sm:p-3 rounded-full bg-green-100 dark:bg-green-900">
            <FontAwesomeIcon
              icon={stat.icon}
              className="text-lg sm:text-xl md:text-2xl text-green-500 dark:text-green-400"
            />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        </div>
      </motion.div>
    ))}
  </section>
)

const BookingStatusChart = ({ data, colors }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
  >
    <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-800 dark:text-white">Booking Status</h2>
    <div className="h-48 sm:h-56 md:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="flex flex-wrap justify-center mt-2 sm:mt-4">
      {data.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center mx-1 sm:mx-2 mb-1">
          <div
            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1"
            style={{ backgroundColor: colors[index % colors.length] }}
          ></div>
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{entry.name}</span>
        </div>
      ))}
    </div>
  </motion.section>
)

const BookingTrendChart = ({ data }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
  >
    <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-800 dark:text-white">Booking Trend</h2>
    <div className="h-48 sm:h-56 md:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="bookings" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </motion.section>
)

const RecentBookings = ({ bookings, title }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
  >
    <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-800 dark:text-white">{title}</h2>
    {bookings.length > 0 ? (
      <ul className="space-y-2 sm:space-y-3">
        {bookings.map((booking) => (
          <li
            key={booking._id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b dark:border-gray-700 pb-2"
          >
            <div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">
                {booking.turf?.turfName}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {new Date(booking.date).toLocaleDateString()} | {booking.timeSlot.join(", ")}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold mt-1 sm:mt-0 inline-block sm:inline ${
                booking.status === "Confirmed"
                  ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : booking.status === "Completed"
                    ? "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {booking.status}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent bookings found.</p>
    )}
  </motion.section>
)

const SettingsSection = ({ user }) => (
  <div className="space-y-4 sm:space-y-6">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-4">Settings</h2>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
        Profile Information
      </h3>
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            value={`${user?.firstName || ""} ${user?.lastName || ""}`}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-2 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            readOnly
          />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</p>
            <p className="text-lg text-gray-800 dark:text-white mt-1 capitalize">
              {user?.additionalFields.gender || 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</p>
            <p className="text-lg text-gray-800 dark:text-white mt-1">
              {user?.additionalFields?.dateOfBirth  || 'Not specified'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          About You
        </h3>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</p>
          <p className="text-gray-800 dark:text-white whitespace-pre-line">
            {user?.additionalFields.description || 'No description provided'}
          </p>
        </div>
      </div>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">Preferences</h3>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Enable Notifications</span>
          <input type="checkbox" className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-green-600" checked />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Dark Mode</span>
          <input type="checkbox" className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-green-600" checked />
        </div>
      </div>
    </div>
  </div>
)

const getStatusColor = (status) => {
  switch (status) {
    case "Confirmed":
      return "text-green-600 dark:text-green-400"
    case "Completed":
      return "text-blue-600 dark:text-blue-400"
    case "Cancelled":
      return "text-red-600 dark:text-red-400"
    default:
      return "text-gray-600 dark:text-gray-400"
  }
}

const getMostBookedTurf = () => {
  return "Green Valley"
}

export default Dashboard
