"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { setLoader } from "../../slices/authSlice"
import axios from "axios"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
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
import { useSelector } from "react-redux"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const token = useSelector((state) => state.auth.token)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(setLoader(true))
        const response = await axios.get("http://localhost:4000/api/v1/auth/fetchAllUsers", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })

        if (response.data.success) {
          toast.success("Fetched All Users Details")
          const mappedUsers = response.data.allUsers.map((user) => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            image:user.image,
            status: user.isVerified ? "Active" : "Inactive", 
            lastLogin: new Date(user.lastLogin).toLocaleString(), 
            registrationDate: new Date(user.createdAt).toLocaleDateString(),
            recentActivity: user.recentActivity.length > 0 ? user.recentActivity[0].action : "No recent activity", 
          }))
          setUsers(mappedUsers)
        } else {
          toast.error("Error Fetching Users!")
        }
      } catch (error) {
        console.error("Error:", error.response?.data || error.message)
        toast.error(error.response?.data?.message || "Error fetching users")
        setError(error.response?.data?.message || "Error fetching users")
      } finally {
        dispatch(setLoader(false))
        setLoading(false)
      }
    }

    fetchUsers()
  }, [token, dispatch])

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
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>
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
                {["Name", "Email", "Role", "Registration Date", "Recent Activity", "Actions"].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort(header.toLowerCase().replace(" ", ""))}
                  >
                    <div className="flex items-center">
                      {header}
                      {sortColumn === header.toLowerCase().replace(" ", "") && (
                        <FontAwesomeIcon icon={sortDirection === "asc" ? faSortUp : faSortDown} className="ml-1" />
                      )}
                    </div>
                  </th>
                ))}
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
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {user.recentActivity}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mr-3">
          <FontAwesomeIcon icon={faTrash} />
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
                      {users.filter((user) => user.role === "Player").length}
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
    {users
      .filter((user) => user.recentActivity !== "No recent activity") 
      .slice(0, 1) 
      .map((user) => (
        <div key={user.id} className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <img
              className="h-8 w-8 rounded-full"
              src={user.image}
              alt={user.name}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.recentActivity}</p>
          </div>
          <div className="inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
            {user.lastLogin}
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