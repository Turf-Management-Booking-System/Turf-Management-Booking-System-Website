import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/authSlice";
import { TbMessageChatbot } from "react-icons/tb";
import { DarkModeContext } from "../../context/DarkModeContext";
import { setNotification } from "../../slices/notificationSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { FaKey, FaRobot } from "react-icons/fa";
import Chatbot from "../pages/Chatbot";
import logo from "../../assets/Images/Logo.png";
import { FaFutbol, FaHome, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const notifications = useSelector(
    (state) => state.notification.notifications
  );
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleChatbotToggle = () => {
    setShowChatbot((prev) => !prev);
  };

  const handleMenu = () => setMenuOpen((prev) => !prev);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setShowLogoutConfirmation(true);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logout());
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchNotification = async () => {
      if (user && user._id) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/notify/getNotifications/${user._id}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
                              withCredentials: true,
            }
          );
          if (response.data.success) {
            dispatch(setNotification(response.data.currentMessage || []));
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Something Went Wrong whie fetching notifications in navbar!");
        }
      }
    };
    fetchNotification();
  }, [dispatch, user]);

  const unreadCount = notifications.filter((notify) => !notify.isRead).length;

  // Mobile menu animation variants
  const menuVariants = {
    closed: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };

  const menuItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  return (
    <nav className="p-3 flex bg-[#5886a7] dark:bg-gray-900 text-white justify-between items-center fixed top-0 left-0 w-full z-50 shadow-md">
      <img
        src={logo || "/placeholder.svg"}
        alt="KickOnTurf Logo"
        className="w-12 h-12 md:block hidden rounded-full object-cover"
      />
      <div className="flex flex-1 ml-5 items-center gap-2">
        <Link to="/" className="text-xl font-orbitron font-bold">
          KickOnTurf
        </Link>
        <motion.div
          animate={{
            x: [0, 10, -10, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <FaFutbol className="text-2xl ml-2 text-white" />
        </motion.div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="p-2 lg:hidden z-50 relative"
        onClick={handleMenu}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <div className="w-6 h-5 flex flex-col justify-between relative">
          <span
            className={`w-full h-0.5 bg-white rounded-full transform transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`w-full h-0.5 bg-white rounded-full transform transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </div>
      </button>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex lg:items-center lg:gap-12">
        <Link
          to="/"
          className={`text-[20px] font-medium font-serif pb-2 relative ${
            location.pathname === "/" ? "after:w-full" : "after:w-0"
          } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full`}
        >
          Home
        </Link>

        {/* Turf Panel Link (for Admin) */}
        {isAuthenticated && user.role === "Admin" && (
          <Link
            to="/adminpanel"
            className={`text-[20px] font-medium font-serif pb-2 relative ${
              location.pathname === "/adminpanel" ? "after:w-full" : "after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full`}
          >
            Turf Panel
          </Link>
        )}
        {(!isAuthenticated || (isAuthenticated && user.role !== "Admin")) && (
          <Link
            to="/turf"
            className={`text-[20px] font-medium font-serif pb-2 relative ${
              location.pathname === "/turf" ? "after:w-full" : "after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full`}
          >
            Turf
          </Link>
        )}
        {["/about", "/contact"].map((path, index) => (
          <Link
            key={index}
            to={path}
            className={`text-[20px] font-medium font-serif pb-2 relative ${
              location.pathname === path ? "after:w-full" : "after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full`}
          >
            {path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
          </Link>
        ))}
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 left-0 w-4/5 h-screen bg-[#5886a7] dark:bg-gray-900 shadow-2xl z-40 lg:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-start p-4 border-b border-white/20">
              <img
                src={logo || "/placeholder.svg"}
                alt="KickOnTurf Logo"
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <h2 className="text-xl font-orbitron font-bold">KickOnTurf</h2>
            </div>

            {/* <div className="p-4">
              {isAuthenticated && (
                <div className="flex items-center gap-3 p-4 mb-4 bg-white/10 rounded-lg">
                  <img
                    src={user.image || "/placeholder.svg"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div>
                    <p className="font-semibold capitalize">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm opacity-80">{user.role}</p>
                  </div>
                </div>
              )} */}

            <div className="space-y-1">
              <motion.div variants={menuItemVariants}>
                <Link
                  to="/"
                  className={`flex items-center gap-3 mt-5 p-3 rounded-lg ${
                    location.pathname === "/" ? "bg-white/20" : ""
                  } hover:bg-white/10 transition-colors`}
                  onClick={handleLinkClick}
                >
                  <FaHome className="text-xl" />
                  <span className="text-lg font-medium">Home</span>
                </Link>
              </motion.div>

              <motion.div variants={menuItemVariants}>
                <Link
                  to="/turf"
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    location.pathname === "/turf" ? "bg-white/20" : ""
                  } hover:bg-white/10 transition-colors`}
                  onClick={handleLinkClick}
                >
                  <FaFutbol className="text-xl" />
                  <span className="text-lg font-medium">Turf</span>
                </Link>
              </motion.div>

              <motion.div variants={menuItemVariants}>
                <Link
                  to="/about"
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    location.pathname === "/about" ? "bg-white/20" : ""
                  } hover:bg-white/10 transition-colors`}
                  onClick={handleLinkClick}
                >
                  <FaInfoCircle className="text-xl" />
                  <span className="text-lg font-medium">About</span>
                </Link>
              </motion.div>

              <motion.div variants={menuItemVariants}>
                <Link
                  to="/contact"
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    location.pathname === "/contact" ? "bg-white/20" : ""
                  } hover:bg-white/10 transition-colors`}
                  onClick={handleLinkClick}
                >
                  <FaEnvelope className="text-xl" />
                  <span className="text-lg font-medium">Contact</span>
                </Link>
              </motion.div>
              {/* Mobile Dark Mode Toggle */}
              <motion.div variants={menuItemVariants}>
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center gap-3 p-3 w-full text-left rounded-lg hover:bg-white/10 transition-colors"
                >
                  {darkMode ? (
                    <>
                      <i className="bx bx-moon text-xl"></i>
                      <span className="text-lg font-medium">Light Mode</span>
                    </>
                  ) : (
                    <>
                      <i className="bx bx-sun text-xl"></i>
                      <span className="text-lg font-medium">Dark Mode</span>
                    </>
                  )}
                </button>
              </motion.div>

              <motion.div variants={menuItemVariants}>
                <Link
                  to="/chatbot"
                  className={`flex mb-5 items-center gap-3 p-3 rounded-lg ${
                    location.pathname === "/chatbot" ? "bg-white/20" : ""
                  } hover:bg-white/10 transition-colors`}
                  onClick={handleLinkClick}
                >
                  <FaRobot className="text-xl" />
                  <span className="text-lg font-medium">Chatbot</span>
                </Link>
              </motion.div>
              {/* Mobile Authentication */}
              {isAuthenticated ? (
                <motion.div variants={menuItemVariants}>
                  <button
                    onClick={() => {
                      handleLinkClick();
                      setShowLogoutConfirmation(true);
                    }}
                    className="flex items-center gap-3 p-3 w-full text-left rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <i className="bx bx-log-out text-xl"></i>
                    <span className="text-lg font-medium">Logout</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div variants={menuItemVariants}>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                    onClick={handleLinkClick}
                  >
                    <i className="bx bx-log-in text-xl"></i>
                    <span className="text-lg font-medium">Login</span>
                  </Link>
                </motion.div>
              )}
            </div>
            {/* </div> */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Right Side Menu */}
      <div className="hidden lg:flex flex-1 items-center justify-end gap-4 mr-5">
        <div className=" text-4xl">
          <button onClick={handleChatbotToggle} aria-label="Toggle chatbot">
            <TbMessageChatbot />
          </button>
        </div>
        {showChatbot && <Chatbot onClose={handleChatbotToggle} />}

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className=" text-lg rounded-full py-2 px-3 hover:bg-blue-50 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <i className="bx bx-moon text-2xl"></i>
          ) : (
            <i className="bx bx-sun text-2xl"></i>
          )}
        </button>

        {/* When Auth then Notification */}
        {isAuthenticated ? (
          <div className="relative flex items-center gap-4">
            <button
              onClick={() => navigate("/notification")}
              className=" relative p-2 hover:bg-[#8bb0ca] dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Notifications"
            >
              <i className="bx bx-bell text-2xl"></i>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center min-w-[18px] h-[18px] text-xs bg-red-500 text-white rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown when authenticated */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2"
                aria-label="Open profile menu"
              >
                <img
                  src={user.image || "/placeholder.svg"}
                  alt="Profile"
                  className="w-12 h-12  rounded-full border-2 border-white"
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0.5 mt-6 w-96 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    <div className="flex items-center gap-7 px-4 py-5 border-b">
                      <img
                        src={user.image || "/placeholder.svg"}
                        alt=""
                        className="w-14 h-14 rounded-full border-black"
                      />
                      <div>
                        <p className="font-semibold text-xl capitalize">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                    </div>
                    <Link
                      key="profile"
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center justify-between px-5 py-5 hover:bg-gray-200 transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <i className="bx bx-user text-2xl"></i> Edit Profile
                      </div>
                      <i className="bx bx-chevron-right text-2xl"></i>
                    </Link>
                    <Link
                      key="dashboard"
                      to={
                        user.role === "Admin" ? "/admindashboard" : "/dashboard"
                      }
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center justify-between px-5 py-5 hover:bg-gray-200 transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <i className="bx bxs-calendar-check text-2xl"></i>{" "}
                        Dashboard
                      </div>
                      <i className="bx bx-chevron-right text-2xl"></i>
                    </Link>
                    <Link
                      key="changepassword"
                      to="/changepassword"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center justify-between px-5 py-5 hover:bg-gray-200 transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <FaKey size={20} />
                        Change Password
                      </div>
                      <i className="bx bx-chevron-right text-2xl"></i>
                    </Link>
                    <button
                      key="logout"
                      onClick={handleLogoutClick}
                      className="flex items-center justify-between w-full text-left px-5 py-5 hover:bg-gray-200 transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <i className="bx bx-log-out text-2xl"></i> Logout
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex gap-2 items-center px-6 py-2 rounded-lg border hover:bg-white/10 transition-all duration-300 active:border-white"
          >
            <span className="font-montserrat text-[20px] font-medium">
              Login
            </span>
          </button>
        )}
      </div>

      {/* Mobile Auth Profile or Login */}
      <div className="lg:hidden flex items-center">
        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2"
              aria-label="Open profile menu"
            >
              <img
                src={user.image || "/placeholder.svg"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-4 w-80 bg-white text-black rounded-lg shadow-lg z-50"
                >
                  <div className="flex items-center gap-4 px-4 py-4 border-b">
                    <img
                      src={user.image || "/placeholder.svg"}
                      alt=""
                      className="w-12 h-12 rounded-full border-black"
                    />
                    <div>
                      <p className="font-semibold text-lg capitalize">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>
                  <Link
                    key="profile"
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-4 px-5 py-5 hover:bg-gray-200 transition-colors"
                  >
                    <i className="bx bx-user text-xl"></i> Edit Profile
                  </Link>
                  <Link
                    key="dashboard"
                    to={
                      user.role === "Admin" ? "/admindashboard" : "/dashboard"
                    }
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-4 px-5 py-5 hover:bg-gray-200 transition-colors"
                  >
                    <i className="bx bxs-calendar-check text-xl"></i> Dashboard
                  </Link>
                  <Link
                    key="changepassword"
                    to="/changepassword"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-4 px-5 py-5 hover:bg-gray-200 transition-colors"
                  >
                    <FaKey size={18} />
                    Change Password
                  </Link>
                  <button
                    key="logout"
                    onClick={handleLogoutClick}
                    className="flex items-center gap-4 w-full text-left px-5 py-5 hover:bg-gray-200 transition-colors"
                  >
                    <i className="bx bx-log-out text-xl"></i> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border"
            onClick={handleLinkClick}
          >
            <span className="font-medium">Login</span>
          </Link>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex mb-36 sm:mb-0 items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to log out of your account? You'll need to
                log back in to access your profile and bookings.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => setShowLogoutConfirmation(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium shadow-md"
              >
                Yes, Log Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
