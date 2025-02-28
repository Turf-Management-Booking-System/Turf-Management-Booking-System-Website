import { useState, useContext, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { loadNotification } from "../../slices/notificationSlice"
import { useSelector, useDispatch } from "react-redux"
import greenBg from "../../assets/Images/greenBg.png"
import blackBg from "../../assets/Images/blackBg.png"
import { useNavigate } from "react-router-dom"
import {
  faTachometerAlt,
  faCalendarAlt,
  faHistory,
  faCog,
  faBell,
  faFutbol,
  faMapMarkerAlt,
  faTicketAlt,
  faChartLine,
  faSignOutAlt,
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

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [sortBy, setSortBy] = useState("date")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen)

  const notifications = useSelector((state) => state.notification.notifications)
  const user = useSelector((state) => state.auth.user)
  const allBookings = useSelector((state) => state.booking.allBookings)
  const currentBookings = useSelector((state) => state.booking.currentBookings)
  const cancelBooked = useSelector((state) => state.booking.cancelBooked)
  const rescheduledBookings = useSelector((state) => state.booking.rescheduledBookings)
  const previousBookings = useSelector((state) => state.booking.previousBookings)

  useEffect(() => {
    dispatch(loadNotification())
  }, [dispatch])

  const isOverviewPage = activeSection === "overview";

  const quickStats = [
    { icon: faFutbol, title: "Total Bookings", value: allBookings.length },
    { icon: faMapMarkerAlt, title: "Favorite Turf", value: getMostBookedTurf() },
    { icon: faTicketAlt, title: "Upcoming Bookings", value: currentBookings.length },
    { icon: faChartLine, title: "Completed Bookings", value: previousBookings.length },
  ]

  const bookingStatusData = [
    { name: "Confirmed", value: currentBookings.length },
    { name: "Completed", value: previousBookings.length },
    { name: "Cancelled", value: cancelBooked.length },
  ]

  const bookingTrendData = getBookingTrendData()

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

  return (
    <div style={{
            backgroundImage: `url(${darkMode ? blackBg : greenBg})`,
          }} className={`min-h-screen mt-12 bg-gray-100 dark:bg-gray-900 ${darkMode ? "dark" : ""}`}>
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "w-64" : "w-20"
          } bg-white dark:bg-gray-800 min-h-screen transition-all duration-300 ease-in-out`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className={`text-2xl mt-8 font-bold text-green-600 dark:text-green-400 ${isSidebarOpen ? "" : "hidden"}`}>
                User Dashboard
              </h2>
              
            </div>
            <nav className="flex-1 overflow-y-auto">
              <ul className="p-4 space-y-3">
                {sidebarItems.map((item) => (
                  <li key={item.section}>
                    <button
                      onClick={() => setActiveSection(item.section)}
                      className={`flex items-center w-full p-2 rounded-lg transition-colors duration-200 ${
                        activeSection === item.section
                          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                      <span className={isSidebarOpen ? "" : "hidden"}>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t dark:border-gray-700">
              <button
                onClick={() => {
                  /* Add logout logic */
                }}
                className="flex items-center w-full p-2 rounded-lg text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
                <span className={isSidebarOpen ? "" : "hidden"}>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Header */}
          {isOverviewPage && (
        <header className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg flex justify-between items-center mb-2">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Welcome, {user?.firstName} {user?.lastName}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user?.avatar || ""}
                alt={""}
                className="w-10 h-10 rounded-full border-2 border-green-500 dark:border-green-400"
              />
              {user?.isSubscribed && (
                <span className="absolute bottom-0 right-0 bg-green-500 rounded-full h-3 w-3 border-2 border-white dark:border-gray-800"></span>
              )}
              </div>
            </div>
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
        </main>
      </div>
    </div>
  )
}

const QuickStats = ({ stats }) => (
  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {stats.map((stat, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <FontAwesomeIcon icon={stat.icon} className="text-2xl text-green-500 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
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
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
  >
    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Booking Status</h2>
    <div className="h-64">
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
    <div className="flex justify-center mt-4">
      {data.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center mx-2">
          <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colors[index % colors.length] }}></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}</span>
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
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
  >
    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Booking Trend</h2>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
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
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
  >
    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{title}</h2>
    <ul className="space-y-3">
      {bookings.map((booking) => (
        <li key={booking._id} className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">{booking.turf?.turfName}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(booking.date).toLocaleDateString()} | {booking.timeSlot.join(", ")}
            </p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
  </motion.section>
)

const SettingsSection = ({ user }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Settings</h2>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Profile Information</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            value={`${user?.firstName} ${user?.lastName}`}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={user?.email}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            readOnly
          />
        </div>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Enable Notifications</span>
          <input type="checkbox" className="form-checkbox h-5 w-5 text-green-600" checked />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
          <input type="checkbox" className="form-checkbox h-5 w-5 text-green-600" checked />
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
  // Implement logic to get the most booked turf
  return "Green Valley"
}

const getBookingTrendData = () => {
  // Implement logic to get booking trend data
  return [
    { name: "Jan", bookings: 4 },
    { name: "Feb", bookings: 3 },
    { name: "Mar", bookings: 5 },
    { name: "Apr", bookings: 7 },
    { name: "May", bookings: 6 },
  ]
}

export default Dashboard

