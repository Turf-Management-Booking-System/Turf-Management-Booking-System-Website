import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { setLoader } from "../../slices/authSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { DarkModeContext } from "../../context/DarkModeContext";
import whiteBg from "../../assets/Images/whiteBg.png";
import blackBg from "../../assets/Images/blackBg.png";
import greenBg from "../../assets/Images/greenBg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Users,
  CalendarDays,
  TrendingUp,
  X,
  ChevronRight,
  BarChart3,
  PieChart,
  Settings,
  Menu,
} from "lucide-react";
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
} from "recharts";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import AdminPanel from "./AdminPanel";
import UserManagement from "./UserManagement";
import BookingManagement from "./BookingManagement";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { darkMode } = useContext(DarkModeContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
  const [isMobile, setIsMobile] = useState(false);
  const [monthlyBookings, setMonthlyBookings] = useState(false);
  const [monthlyRevenue, setMonthlyRevenue] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState("");
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const allUsers = useSelector((state) => state.admin.allUsers);
  const totalUsers = allUsers.length;
  const [allBookings, setAllBookings] = useState([]);
  const turfs = useSelector((state) => state.turf.turfs);
  const totalTurfs = turfs.length;
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [recentActivities, setRecentActivities] = useState([]);
  const [turfUtilization, setTurfUtilization] = useState([]);

  // Check if screen is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // On larger screens, sidebar should be open by default
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Initial check
    checkIsMobile();

    // Adding event listener for window resize
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    if (allUsers && allUsers.length > 0) {
      const activities = allUsers.flatMap((user) =>
        user.recentActivity.map((activity) => ({
          ...activity,
          user: `${user.firstName} ${user.lastName}`,
          avatar: user.image,
        }))
      );

      activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const latestActivities = activities.slice(0, 6);
      setRecentActivities(latestActivities);
    }
  }, [allUsers]);

  const fetchMontlyBookings = async () => {
    try {
      dispatch(setLoader(true));

      const response = await axios.get(
        `http://localhost:4000/api/v1/turf/getMonthlyBookings`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Response from backend monthly bookings", response.data);
      setMonthlyBookings(response.data);
    } catch (error) {
      console.log("Error", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Unable to fetch monthly bookings"
      );
    } finally {
      dispatch(setLoader(false));
    }
  };

  const fetchMontlyRevenue = async () => {
    try {
      dispatch(setLoader(true));

      const response = await axios.get(
        `http://localhost:4000/api/v1/turf/getMonthlyRevenue`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Response from backend monthly revenue", response.data);
      setMonthlyRevenue(response.data);
    } catch (error) {
      console.log("Error", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Unable to fetch monthly revenue"
      );
    } finally {
      dispatch(setLoader(false));
    }
  };
  const fetchTotalRevenue = async () => {
    try {
      dispatch(setLoader(true));

      const response = await axios.get(
        `http://localhost:4000/api/v1/turf/getTotalRevenue`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Response from backend total revenue", response.data.total);
      setTotalRevenue(response.data.total);
    } catch (error) {
      console.log("Error", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Unable to fetch total revenue"
      );
    } finally {
      dispatch(setLoader(false));
    }
  };
  const sportsData = async () => {
    try {
      dispatch(setLoader(true));

      const response = await axios.get(
        `http://localhost:4000/api/v1/turf/getSportsUtilization`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Response from backend sports data", response.data);
      setTurfUtilization(response.data);
    } catch (error) {
      console.log("Error", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Unable to fetch sports data"
      );
    } finally {
      dispatch(setLoader(false));
    }
  };
  const fetchAllBookings = async () => {
    try {
      dispatch(setLoader(true));

      const response = await axios.get(
        `http://localhost:4000/api/v1/booking/getAllBookings`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(
        "Response from backend all Bookings",
        response.data.allBookings
      );
      setAllBookings(response.data.allBookings);
    } catch (error) {
      console.log("Error", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Unable to fetch bookings data"
      );
    } finally {
      dispatch(setLoader(false));
    }
  };
  useEffect(() => {
    fetchMontlyBookings();
    fetchMontlyRevenue();
    fetchTotalRevenue();
    sportsData();
    fetchAllBookings();
  }, [token]);

  const renderContent = () => {
    switch (selectedItem) {
      case "Dashboard":
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                {
                  title: "Total Users",
                  value: totalUsers,
                  icon: Users,
                  color: "blue",
                },
                {
                  title: "Total Bookings",
                  value: allBookings.length,
                  icon: CalendarDays,
                  color: "green",
                },
                {
                  title: " Total Revenue",
                  value: totalRevenue,
                  icon: TrendingUp,
                  color: "purple",
                },
                {
                  title: "Active Turfs",
                  value: totalTurfs,
                  icon: BarChart3,
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
                    <div
                      className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900`}
                    >
                      <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                    </div>
                  </div>
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-serif font-medium">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-sans font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-2xl font-serif font-semibold mb-4 text-gray-900 dark:text-white">
                  Monthly Bookings
                </h3>
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
                <h3 className="text-2xl font-serif font-semibold mb-4 text-gray-900 dark:text-white">
                  Revenue Overview
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white h-[75vh] sm:h-[65vh] dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-2xl font-serif font-semibold mb-4 text-gray-900 dark:text-white">
                  Turf Utilization
                </h3>
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
                        dataKey="count"
                      >
                        {turfUtilization.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 sm:flex sm:justify-center sm:space-x-3 gap-2 mt-6">
                    {turfUtilization.map((entry, index) => (
                      <div
                        key={`legend-${index}`}
                        className="flex items-center space-x-2"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {entry.sport}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-2xl font-semibold font-serif mb-4 text-gray-900 dark:text-white">
                  Recent Activities
                </h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4"
                    >
                      <img
                        src={activity.avatar || "/placeholder.svg"}
                        alt={activity.user}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-sans font-medium text-gray-900 dark:text-white">
                          {activity.user?.charAt(0).toUpperCase() +
                            activity.user?.slice(1)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.action}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
      case "User Management":
        return <UserManagement />;
      case "Booking Management":
        return <BookingManagement />;
      case "Turf management":
        return <AdminPanel />;
        case "Settings":
          return <SettingsSection user={user} />;  
      default:
        return null;
    }
  };

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen mt-16 dark:bg-gray-900 flex relative">
      {/* Sidebar*/}
      <aside
        style={{
          backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
        }}
        className={`w-72 h-[93vh] fixed sm:sticky sm:top-16 top-12 bottom-0 z-30 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 border-r border-gray-200 dark:border-gray-700 flex-shrink-0`}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-2xl pt-3 pl-3 font-serif font-bold text-green-500">
            TurfAdmin
          </h2>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <nav className="space-y-2 p-4">
          {[
            { icon: BarChart3, label: "Dashboard" },
            { icon: Users, label: "User Management" },
            { icon: CalendarDays, label: "Booking Management" },
            { icon: PieChart, label: "Turf management" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setSelectedItem(item.label);
                if (isMobile) toggleSidebar(); // Close sidebar on mobile after selection
              }}
              className={`flex items-center w-full p-3 rounded-lg text-left space-x-3 ${
                selectedItem === item.label
                  ? "bg-gray-100 dark:bg-gray-700 text-green-600 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {selectedItem === item.label && (
                <ChevronRight className="h-5 w-5 ml-auto" />
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 sm:mt-44 mt-36 border-t dark:border-gray-700">
                      <button
                        onClick={() => {}}
                        className="flex  items-center w-full p-2 rounded-lg text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
                        <span className={isSidebarOpen ? "" : "hidden"}>Logout</span>
                      </button>
                    </div>
      </aside>

      {/* Main Content*/}
      <div
        style={{
          backgroundImage: `url(${darkMode ? blackBg : greenBg})`,
        }}
        className={`flex-1 p-4 transition-all duration-300 ${
          isSidebarOpen && !isMobile ? "" : ""
        }`}
      >
        <header className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            {/* Mobile sidebar toggle button in header */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold font-orbitron text-gray-800 dark:text-white">
              Welcome,{" "}
              <span className="capitalize text-green-500 font-serif">
                {user.firstName} {user.lastName}
              </span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user.image || "/placeholder.svg"}
                alt={""}
                className="w-10 h-10 rounded-full border-2 border-green-500 dark:border-green-400"
              />
            </div>
          </div>
        </header>
        {renderContent()}
      </div>
    </div>
  );
  
}

const SettingsSection = ({ user }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      Settings
    </h2>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Profile Information
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            value={`${user?.firstName} ${user?.lastName}`}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={user?.email}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Preferences
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">
            Enable Notifications
          </span>
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-green-600"
            checked
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-green-600"
            checked
          />
        </div>
      </div>
    </div>
  </div>
);
