"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSearch,
  faUserPlus,
  faFileExport,
  faUsers,
  faUserClock,
  faSortUp,
  faSortDown,
  faEdit,
  faTrash,
  faEllipsisV,
  faUserTie,
  faUser,
} from "@fortawesome/free-solid-svg-icons"

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "User",
    status: "Active",
    lastLogin: "2023-05-15",
    registrationDate: "2023-01-10",
    recentActivity: "Updated profile",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2023-05-14",
    registrationDate: "2022-11-05",
    recentActivity: "Changed password",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Pending",
    lastLogin: "Never",
    registrationDate: "2023-05-01",
    recentActivity: "Registered",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "User",
    status: "Active",
    lastLogin: "2023-05-12",
    registrationDate: "2023-03-20",
    recentActivity: "Booked a turf",
  },
  {
    id: 5,
    name: "Charlie Davis",
    email: "charlie@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2023-05-13",
    registrationDate: "2022-09-15",
    recentActivity: "Added new turf",
  },
]

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")

  useEffect(() => {
    // In a real application, you would fetch users from an API here
  }, [])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const statusColors = {
    Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">User Management</h1>

        {/* Search and Actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="flex gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center">
              <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
              Add User
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center">
              <FontAwesomeIcon icon={faFileExport} className="mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {["Name", "Email", "Role", "Registration Date", "Recent Activity", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort(header.toLowerCase())}
                    >
                      <div className="flex items-center">
                        {header}
                        {sortColumn === header.toLowerCase() && (
                          <FontAwesomeIcon icon={sortDirection === "asc" ? faSortUp : faSortDown} className="ml-1" />
                        )}
                      </div>
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{user.registrationDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{user.recentActivity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mr-3">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Statistics */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Users</dt>
                    <dd className="text-3xl font-semibold text-gray-900 dark:text-white">{users.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <FontAwesomeIcon icon={faUserTie} className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Admin Users</dt>
                    <dd className="text-3xl font-semibold text-gray-900 dark:text-white">
                      {users.filter((user) => user.role === "Admin").length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <FontAwesomeIcon icon={faUser} className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Regular Users</dt>
                    <dd className="text-3xl font-semibold text-gray-900 dark:text-white">
                      {users.filter((user) => user.role === "User").length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <FontAwesomeIcon icon={faUserClock} className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      New Users (Last 30 days)
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900 dark:text-white">
                      {
                        users.filter((user) => {
                          const thirtyDaysAgo = new Date()
                          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                          return new Date(user.registrationDate) > thirtyDaysAgo
                        }).length
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* User Management Tips */}
        <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">User Management Tips</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Regularly review and update user permissions to maintain security.</li>
            <li>Encourage users to enable two-factor authentication for enhanced account security.</li>
            <li>Implement a clear process for onboarding new users and offboarding departing users.</li>
            <li>Periodically audit user activities to detect any unusual behavior or potential security risks.</li>
            <li>Provide clear guidelines and support for users to manage their account settings and preferences.</li>
          </ul>
        </div>

        {/* Recent User Activities */}
        <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent User Activities</h2>
          <div className="space-y-4">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt={user.name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.recentActivity}</p>
                </div>
                <div className="inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement

