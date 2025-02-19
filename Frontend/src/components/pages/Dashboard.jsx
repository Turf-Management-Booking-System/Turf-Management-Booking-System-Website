import { useState, useContext } from "react"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { loadNotification } from '../../slices/notificationSlice';
import { useSelector,useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  faSignOutAlt,
  faTachometerAlt,
  faCalendarAlt,
  faHistory,
  faCog,
  faBell,
  faFutbol,
  faClock,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons"
import { DarkModeContext } from "../../context/DarkModeContext"

const Dashboard = () => {
  const dispatch = useDispatch();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const quickStats = [
    { icon: faFutbol, title: "Total Bookings", value: 15 },
    { icon: faClock, title: "Hours Played", value: 30 },
    { icon: faMapMarkerAlt, title: "Favorite Turf", value: "Green Valley" },
  ]

  const recentBookings = [
    { id: 1, turf: "Green Valley", date: "2023-05-15", time: "18:00 - 19:00" },
    { id: 2, turf: "City Central", date: "2023-05-10", time: "20:00 - 21:00" },
    { id: 3, turf: "Sunset Arena", date: "2023-05-05", time: "17:00 - 18:00" },
  ]

  const upcomingEvents = [
    { id: 1, title: "Football Match", date: "2023-05-20", time: "16:00 - 18:00" },
    { id: 2, title: "Cricket Tournament", date: "2023-05-25", time: "09:00 - 17:00" },
  ]

 const notifications = useSelector((state)=>state.notification.notifications);
    console.log("notifications in dasboard",notifications)
    useEffect( ()=>{
           dispatch(loadNotification());
         },[dispatch])

  return (
    <div className={"min-h-screen mt-16"}>
      <div className="flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        {/* Sidebar */}
        <aside
          className={`bg-white dark:bg-gray-800 w-full md:w-64 md:min-h-screen md:flex md:flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? "block" : "hidden md:flex"}`}
        >
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-2xl font-semibold">Dashboard</h2>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md"
                >
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  <span>Overview</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>Bookings</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md"
                >
                  <FontAwesomeIcon icon={faHistory} />
                  <span>History</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md"
                >
                  <FontAwesomeIcon icon={faCog} />
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-md p-4 mb-4 rounded-lg flex justify-between items-center">
            <button className="md:hidden" onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faBell} />
            </button>
            <h1 className="text-2xl font-semibold">Welcome, John Doe</h1>
            <div className="flex items-center space-x-4">
              <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                {darkMode ? "🌞" : "🌙"}
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <FontAwesomeIcon icon={faBell} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>
          </header>

          {/* Quick Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={stat.icon} className="text-3xl text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold">{stat.title}</h3>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Recent Bookings and Upcoming Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Recent Bookings */}
            <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
              <ul className="space-y-2">
                {recentBookings.map((booking) => (
                  <li key={booking.id} className="border-b dark:border-gray-700 pb-2">
                    <p className="font-semibold">{booking.turf}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {booking.date} | {booking.time}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Upcoming Events */}
            <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
              <ul className="space-y-2">
                {upcomingEvents.map((event) => (
                  <li key={event.id} className="border-b dark:border-gray-700 pb-2">
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.date} | {event.time}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Calendar Component (Placeholder) */}
          <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Calendar</h2>
            <div className="border dark:border-gray-700 rounded-lg p-4 text-center">Calendar Component Placeholder</div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard

