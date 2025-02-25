"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  CalendarDays,
  TrendingUp,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data for charts
const monthlyBookings = [
  { name: "Jan", bookings: 65 },
  { name: "Feb", bookings: 59 },
  { name: "Mar", bookings: 80 },
  { name: "Apr", bookings: 81 },
  { name: "May", bookings: 56 },
  { name: "Jun", bookings: 55 },
  { name: "Jul", bookings: 40 },
]

const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4800 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 4500 },
  { name: "Jul", revenue: 5200 },
]

const turfUtilization = [
  { name: "Football", value: 400 },
  { name: "Cricket", value: 300 },
  { name: "Basketball", value: 200 },
  { name: "Tennis", value: 100 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const recentActivities = [
  {
    id: 1,
    user: "John Doe",
    action: "Booked Football Turf",
    time: "2 minutes ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "Cancelled Cricket Booking",
    time: "1 hour ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "Modified Booking Time",
    time: "3 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 mt-16 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">TurfAdmin</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <nav className="space-y-1 p-4">
          {[
            { icon: BarChart3, label: "Dashboard", active: true },
            { icon: Users, label: "User Management" },
            { icon: CalendarDays, label: "Bookings" },
            { icon: PieChart, label: "Analytics" },
            { icon: Activity, label: "Reports" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex items-center w-full p-3 rounded-lg text-left space-x-3 ${
                item.active
                  ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.active && <ChevronRight className="h-5 w-5 ml-auto" />}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`p-4 ${isSidebarOpen ? "lg:ml-64" : ""}`}>
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-[300px] rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <img src="/placeholder.svg" alt="Admin" className="h-8 w-8 rounded-full" />
                  <span className="text-gray-700 dark:text-gray-300">Admin User</span>
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700">
                    <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Settings
                    </button>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[
            {
              title: "Total Users",
              value: "1,234",
              icon: Users,
              trend: "+12.5%",
              color: "blue",
            },
            {
              title: "Total Bookings",
              value: "845",
              icon: CalendarDays,
              trend: "+8.2%",
              color: "green",
            },
            {
              title: "Revenue",
              value: "₹52,000",
              icon: TrendingUp,
              trend: "+15.3%",
              color: "purple",
            },
            {
              title: "Active Turfs",
              value: "12",
              icon: BarChart3,
              trend: "+2",
              color: "yellow",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                </div>
                <span className="text-green-500 text-sm font-medium">{stat.trend}</span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Monthly Bookings</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyBookings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Revenue Overview</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Turf Utilization</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={turfUtilization}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {turfUtilization.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                {turfUtilization.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <img
                    src={activity.avatar || "/placeholder.svg"}
                    alt={activity.user}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.user}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              View All Activities
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

