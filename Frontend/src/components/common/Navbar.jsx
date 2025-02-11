import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/authSlice";



function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const handleLogoutClick = (event) => {
    event.preventDefault();
    dispatch(logout());
  };


  return (
    <nav className="p-3 flex bg-[#065F46] dark:bg-gray-900 text-white justify-between items-center fixed top-0 left-0 right-0 z-20 shadow-md">
      {/* Logo */}
      <Link to="/" className="flex gap-2 items-center flex-1 ml-3">
        <span className="text-xl font-orbitron font-bold">KickOnTurf</span>
      </Link>

      {/* Navbar Links (Desktop) */}
      <div id="nav-menu" className="hidden lg:flex gap-12">
        {["/", "/turf", "/about", "/contact"].map((path, index) => (
          <Link
            key={index}
            to={path}
            className={`text-[19px] font-medium font-montserrat pb-2 relative ${
              location.pathname === path ? "after:w-full" : "after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-white after:transition-all after:duration-300`}
          >
            {path === "/"
              ? "Home"
              : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
          </Link>
        ))}
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-end gap-4 mr-5">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="text-lg rounded-full py-2 px-3 hover:bg-green-900 dark:hover:bg-gray-700"
        >
          {darkMode ? (
            <i className="bx bx-moon text-2xl"></i>
          ) : (
            <i className="bx bx-sun text-2xl"></i>
          )}
        </button>

        {/*when Auth then  Notification */}
        {isAuthenticated ? (
          <div className="relative flex items-center gap-4">
            <button onClick={() => navigate("/notification")} className="relative p-2 hover:bg-green-900 dark:hover:bg-gray-700 rounded-full">
              <i className="bx bx-bell text-2xl"></i>
              {/*temporary dot hehehe*/}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown when authenticated */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2"
              >
                <i className="bx bxs-user-circle text-4xl"></i>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0.5 mt-6 w-96 bg-white text-black rounded-lg shadow-lg overflow-hidden transform transition-all duration-200 scale-95 origin-top-right">
                  <div className="flex items-center gap-7 px-4 py-5 border-b">
                    <img
                      src=""
                      alt=""
                      className="w-14 h-14 rounded-full border-black"
                    />
                    <div>
                      <p className="font-semibold text-xl">Nagma Shaikh</p>
                    </div>
                  </div>
                  <Link to="/profile" className="flex items-center justify-between px-5 py-5 hover:bg-gray-200 transition">
            <div className="flex items-center gap-5">
              <i className="bx bx-user text-2xl"></i> Edit Profile
            </div>
            <i className="bx bx-chevron-right text-2xl"></i>
          </Link>

          <Link to="/bookings" className="flex items-center justify-between px-5 py-5 hover:bg-gray-200 transition">
            <div className="flex items-center gap-5">
              <i className="bx bxs-calendar-check text-2xl"></i> My Bookings
            </div>
            <i className="bx bx-chevron-right text-2xl"></i>
          </Link>

          <Link to="/history" className="flex items-center justify-between px-5 py-5 hover:bg-gray-200 transition">
            <div className="flex items-center gap-5">
              <i className="bx bx-history text-2xl"></i>Booking History
            </div>
            <i className="bx bx-chevron-right text-2xl"></i>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            className="flex items-center justify-between w-full text-left px-5 py-5 hover:bg-gray-200 transition"
          >
            <div className="flex items-center gap-5">
              <i className="bx bx-log-out text-2xl"></i> Logout
            </div>
          </button>
        </div>
      )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex gap-2 items-center px-6 py-2 rounded-lg border transition-all duration-300 active:border-white"
          >
            <span className="font-montserrat text-[20px] font-medium">
              Login
            </span>
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button className="p-2 lg:hidden" onClick={handleMenu}>
        {menuOpen ? (
          <i className="bx bx-x text-3xl"></i>
        ) : (
          <i className="bx bx-menu text-3xl"></i>
        )}
      </button>
    </nav>
  );
}

export default Navbar;
