import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setLoader } from "../../slices/authSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { deleteAccountUser } from "../../slices/authSlice";
import { deleteAccountNotification } from "../../slices/notificationSlice";
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
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { setAllUsers } from "../../slices/adminSlice";
import { DarkModeContext } from "../../context/DarkModeContext";
import blackBg from "../../assets/Images/blackBg.png";
import whiteBg from "../../assets/Images/whiteBg.png";

const UserManagement = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(setLoader(true));
        const response = await axios.get(
          "http://localhost:4000/api/v1/auth/fetchAllUsers",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          dispatch(setAllUsers(response.data.allUsers));
          const mappedUsers = response.data.allUsers.map((user) => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            image: user.image,
            status: user.isVerified ? "Active" : "Inactive",
            lastLogin: new Date(user.lastLogin).toLocaleString(),
            registrationDate: new Date(user.createdAt).toLocaleDateString(),
            recentActivity:
              user.recentActivity.length > 0
                ? user.recentActivity[0].action
                : "No recent activity",
          }));
          setUsers(mappedUsers);
        } else {
          toast.error("Error Fetching Users!");
        }
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Error fetching users");
        setError(error.response?.data?.message || "Error fetching users");
      } finally {
        dispatch(setLoader(false));
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, dispatch]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const statusColors = {
    Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const toggleUserExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const handleDeleteProfile = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        dispatch(setLoader(true));
        const response = await axios.delete(
          `http://localhost:4000/api/v1/auth/deleteProfile/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              withCredentials: true,
            },
          }
        );
        console.log("response Data", response.data);
        if (response.data.success) {
          dispatch(deleteAccountUser());
          dispatch(deleteAccountNotification());
          toast.success("User Deleted Successfully!");
          // Refresh user list
          const updatedUsers = users.filter((user) => user.id !== id);
          setUsers(updatedUsers);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something Went Wrong!");
        console.error("Error:", error.response?.data || error.message);
      } finally {
        dispatch(setLoader(false));
      }
    }
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
        }}
        className="min-h-screen flex items-center justify-center"
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
        }}
        className="min-h-screen flex items-center justify-center"
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
      }}
      className="min-h-screen bg-gray-100 dark:bg-gray-900 py-4 sm:py-8 px-3 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-green-600 dark:text-white mb-4 sm:mb-8">
          User Management
        </h1>

        {/* Search and Actions */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition duration-300 flex items-center justify-center text-xs sm:text-sm">
              <FontAwesomeIcon icon={faFileExport} className="mr-1 sm:mr-2" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* User Table - Desktop */}
        {!isMobileView && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {[
                      "Name",
                      "Email",
                      "Role",
                      "Status",
                      "Registration Date",
                      "Recent Activity",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() =>
                          handleSort(header.toLowerCase().replace(" ", ""))
                        }
                      >
                        <div className="flex items-center">
                          {header}
                          {sortColumn ===
                            header.toLowerCase().replace(" ", "") && (
                            <FontAwesomeIcon
                              icon={
                                sortDirection === "asc" ? faSortUp : faSortDown
                              }
                              className="ml-1"
                            />
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
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 mr-2 sm:mr-3">
                            <img
                              className="h-8 w-8 rounded-full"
                              src={user.image}
                              alt={user.name}
                            />
                          </div>
                          <div className="text-sm font-sans font-medium text-gray-900 dark:text-white">
                            {user.name?.charAt(0).toUpperCase() +
                              user.name?.slice(1)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {user.role}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-xs sm:text-sm px-2 sm:px-3 py-1 text-center rounded-full ${
                            statusColors[user.status]
                          }`}
                        >
                          {user.status}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {user.registrationDate}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {user.recentActivity}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteProfile(user.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Cards - Mobile */}
        {isMobileView && (
          <div className="space-y-3 mb-6">
            {sortedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div
                  className="p-3 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleUserExpand(user.id)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 mr-3">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.image}
                        alt={user.name}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name?.charAt(0).toUpperCase() +
                          user.name?.slice(1)}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        statusColors[user.status]
                      } mr-2`}
                    >
                      {user.status}
                    </div>
                    <FontAwesomeIcon
                      icon={
                        expandedUserId === user.id ? faChevronUp : faChevronDown
                      }
                      size="xs"
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {expandedUserId === user.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-3 pb-3"
                    >
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            Email
                          </p>
                          <p className="text-gray-900 dark:text-white truncate">
                            {user.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            Registered
                          </p>
                          <p className="text-gray-900 dark:text-white">
                            {user.registrationDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            Last Login
                          </p>
                          <p className="text-gray-900 dark:text-white">
                            {user.lastLogin}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            Activity
                          </p>
                          <p className="text-gray-900 dark:text-white">
                            {user.recentActivity}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDeleteProfile(user.id)}
                          className="text-xs px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800"
                        >
                          Delete User
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {/* User Statistics */}
        <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
          {[
            {
              title: "Total Users",
              value: users.length,
              icon: faUsers,
              color: "bg-blue-500",
            },
            {
              title: "Admin Users",
              value: users.filter((user) => user.role === "Admin").length,
              icon: faUserTie,
              color: "bg-green-500",
            },
            {
              title: "Regular Users",
              value: users.filter((user) => user.role === "Player").length,
              icon: faUser,
              color: "bg-yellow-500",
            },
            {
              title: "New Users",
              value: users.filter((user) => {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return new Date(user.registrationDate) > thirtyDaysAgo;
              }).length,
              icon: faUserClock,
              color: "bg-purple-500",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-3 sm:p-4">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.color} rounded-md p-2`}>
                    <FontAwesomeIcon
                      icon={stat.icon}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                    />
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.title}
                      </dt>
                      <dd className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* User Management Tips */}
        <div className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            User Management Tips
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            <li>Regularly review and update user permissions</li>
            <li>Encourage two-factor authentication</li>
            <li>Implement clear onboarding/offboarding processes</li>
            <li>Periodically audit user activities</li>
            <li>Provide account management guidelines</li>
          </ul>
        </div>

        {/* Recent User Activities */}
        <div className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Recent Activities
          </h2>
          <div className="space-y-3">
            {users
              .filter((user) => user.recentActivity !== "No recent activity")
              .slice(0, 3)
              .map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.image}
                      alt={user.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.name?.charAt(0).toUpperCase() + user.name?.slice(1)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.recentActivity}
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-gray-900 dark:text-white">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;