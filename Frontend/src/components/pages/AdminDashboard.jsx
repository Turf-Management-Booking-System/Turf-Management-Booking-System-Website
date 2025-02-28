import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { setLoader } from "../../slices/authSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { DarkModeContext } from "../../context/DarkModeContext";
import whiteBg from "../../assets/Images/whiteBg.png"
import blackBg from "../../assets/Images/blackBg.png"
import greenBg from "../../assets/Images/greenBg.png"
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
import { useSelector } from "react-redux";
import AdminPanel from "./AdminPanel";
import UserManagement from "./UserManagement";
import BookingManagement from "./BookingManagement";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const {darkMode} = useContext(DarkModeContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [monthlyBookings, setMonthlyBookings] = useState(false);
  const [monthlyRevenue, setMonthlyRevenue] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState("");
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const allUsers = useSelector((state) => state.admin.allUsers);
  const totalUsers = allUsers.length;
  const allBookings = useSelector((state) => state.booking.allBookings);
  const totalBookings = allBookings.length;
  const turfs = useSelector((state) => state.turf.turfs);
  const totalTurfs = turfs.length;
  const token = useSelector((state) => state.auth.token);
  const [recentActivities, setRecentActivities] = useState([]);
  const [turfUtilization, setTurfUtilization] = useState([]);

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
      toast.error(error.response?.data?.message || "Unable to fetch monthly bookings");
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
      toast.error(error.response?.data?.message || "Unable to fetch monthly revenue");
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
      toast.error(error.response?.data?.message || "Unable to fetch total revenue");
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
      toast.error(error.response?.data?.message || "Unable to fetch sports data");
    } finally {
      dispatch(setLoader(false));
    }
  };

  useEffect(() => {
    fetchMontlyBookings();
    fetchMontlyRevenue();
    fetchTotalRevenue();
    sportsData();
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
                  value: totalBookings,
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
                    <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                    </div>
                  </div>
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-2xl font-serif font-semibold mb-4 text-gray-900 dark:text-white">Monthly Bookings</h3>
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
                <h3 className="text-2xl font-serif font-semibold mb-4 text-gray-900 dark:text-white">Revenue Overview</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
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
                <h3 className="text-2xl font-serif font-semibold mb-4 text-gray-900 dark:text-white">Turf Utilization</h3>
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
                        <span className="text-sm text-gray-600 dark:text-gray-400">{entry.sport}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-2xl font-semibold font-serif mb-4 text-gray-900 dark:text-white">Recent Activities</h3>
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
          return <AdminPanel/>
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-16 dark:bg-gray-900 flex">
  {/* Sidebar */}
  <aside 
  style={{
        backgroundImage: `url(${darkMode ? blackBg : whiteBg})`
      }}
    className={`w-72 h-screen transition-transform ${
      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0`}
  >
    <div className="flex items-center justify-between p-4">
      <h2 className="text-2xl pt-3 pl-3 font-serif font-bold text-green-500">TurfAdmin</h2>
      <button
        onClick={() => setIsSidebarOpen(false)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
          onClick={() => setSelectedItem(item.label)}
          className={`flex items-center w-full p-3 rounded-lg text-left  space-x-3 ${
            selectedItem === item.label
              ? "bg-gray-100 dark:bg-gray-700 text-green-600 dark:text-green-400"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
          {selectedItem === item.label && <ChevronRight className="h-5 w-5 ml-auto" />}
        </button>
      ))}
    </nav>
  </aside>

  {/* Main Content */}
  <div style={{
        backgroundImage: `url(${darkMode ? blackBg : greenBg})`
      }} className="flex-1 p-4">
    <header className="bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg flex justify-between items-center mb-2">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold font-orbitron text-gray-800 dark:text-white">
              Welcome, <span className="text-green-500 font-serif">Nagma Shaikh</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={"" || ""}
                alt={""}
                className="w-10 h-10 rounded-full border-2 border-green-500 dark:border-green-400"
              />
              </div>
            </div>
          </header>

    {/* Render Content Based on Selected Item */}
    {renderContent()}
  </div>
</div>
  )
}