"use client"

import { useState, useContext, useEffect } from "react"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { loadNotification } from "../../slices/notificationSlice"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  faTachometerAlt,
  faCalendarAlt,
  faHistory,
  faCog,
  faBell,
  faFutbol,
  faMapMarkerAlt,
  faStar,
  faTicketAlt,
} from "@fortawesome/free-solid-svg-icons"
import { DarkModeContext } from "../../context/DarkModeContext"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const notifications = useSelector((state) => state.notification.notifications)

  useEffect(() => {
    dispatch(loadNotification())
  }, [dispatch])

  // Mock data - replace with actual data from your state or API
  const user = {
    name: "John Doe",
    avatar: "/placeholder.svg?height=128&width=128",
    isSubscribed: true,
  }

  const quickStats = [
    { icon: faFutbol, title: "Total Bookings", value: 15 },
    { icon: faMapMarkerAlt, title: "Favorite Turf", value: "Green Valley" },
    { icon: faTicketAlt, title: "Upcoming Bookings", value: 3 },
  ]

  const recentBookings = [
    { id: 1, turf: "Green Valley", date: "2023-05-15", time: "18:00 - 19:00", status: "Completed" },
    { id: 2, turf: "City Central", date: "2023-05-10", time: "20:00 - 21:00", status: "Upcoming" },
    { id: 3, turf: "Sunset Arena", date: "2023-05-05", time: "17:00 - 18:00", status: "Cancelled" },
  ]

  const userFeedback = [
    { id: 1, turf: "Green Valley", rating: 5, review: "Excellent facilities and staff!" },
    { id: 2, turf: "City Central", rating: 4, review: "Great location, but could use better lighting." },
  ]

  const bookingStatusData = [
    { name: "Completed", value: 8 },
    { name: "Upcoming", value: 4 },
    { name: "Cancelled", value: 2 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 ${darkMode ? "dark" : ""}`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className={`bg-white dark:bg-gray-800 w-full md:w-64 md:min-h-screen md:flex md:flex-col transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "block" : "hidden md:flex"
          }`}
        >
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">TurfZone</h2>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center w-full space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md transition duration-200"
                >
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  <span>Overview</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/mybookings")}
                  className="flex items-center w-full space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md transition duration-200"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>Bookings</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/bookinghistory")}
                  className="flex items-center w-full space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md transition duration-200"
                >
                  <FontAwesomeIcon icon={faHistory} />
                  <span>History</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/settings")}
                  className="flex items-center w-full space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md transition duration-200"
                >
                  <FontAwesomeIcon icon={faCog} />
                  <span>Settings</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-lg p-4 mb-6 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <button className="md:hidden mr-4" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBell} className="text-gray-600 dark:text-gray-300" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Welcome, {user.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {darkMode ? "🌞" : "🌙"}
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 relative">
                <FontAwesomeIcon icon={faBell} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              <div className="relative">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
                />
                {user.isSubscribed && (
                  <span className="absolute bottom-0 right-0 bg-green-500 rounded-full h-3 w-3"></span>
                )}
              </div>
            </div>
          </header>

          {/* Quick Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={stat.icon} className="text-4xl text-blue-500 dark:text-blue-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{stat.title}</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Booking Status Chart */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Booking Status</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {bookingStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-4">
                {bookingStatusData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center mx-2">
                    <div
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{entry.name}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Recent Bookings */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Bookings</h2>
              <ul className="space-y-3">
                {recentBookings.map((booking) => (
                  <li key={booking.id} className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{booking.turf}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.date} | {booking.time}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : booking.status === "Upcoming"
                            ? "bg-blue-200 text-blue-800"
                            : "bg-red-200 text-red-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Feedback */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Feedback</h2>
              <ul className="space-y-4">
                {userFeedback.map((feedback) => (
                  <li key={feedback.id} className="border-b dark:border-gray-700 pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-gray-800 dark:text-white">{feedback.turf}</p>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">{feedback.rating}</span>
                        <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{feedback.review}</p>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Subscription Status */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Subscription Status</h2>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`text-lg font-semibold ${user.isSubscribed ? "text-green-500" : "text-red-500"}`}>
                  {user.isSubscribed ? "Subscribed" : "Not Subscribed"}
                </span>
              </div>
              {user.isSubscribed && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Enjoy premium features and priority booking!
                </p>
              )}
              {!user.isSubscribed && (
                <button
                  onClick={() => navigate("/subscribe")}
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                  Subscribe Now
                </button>
              )}
            </motion.section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard

