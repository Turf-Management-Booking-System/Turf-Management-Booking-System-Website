import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeContext } from "../../context/DarkModeContext";
import whiteBg from "../../assets/Images/whiteBg.png";
import blackBg from "../../assets/Images/blackBg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import {
  faCalendar,
  faMapMarkerAlt,
  faClock,
  faStar,
  faFilter,
  faSearch,
  faChevronDown,
  faDownload,
  faPrint,
  faChartBar,
  faHeart,
  faExclamationTriangle,
  faFutbol,
} from "@fortawesome/free-solid-svg-icons";

const BookingHistory = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const allBookings = useSelector((state) => state.booking.allBookings);
  const cancelBooked = useSelector((state) => state.booking.cancelBooked);
  const rescheduledBookings = useSelector((state) => state.booking.rescheduledBookings);
  const previousBookings = useSelector((state) => state.booking.previousBookings);

  // Filtering logic
  const filteredBookings = allBookings
    .filter((booking) => {
      const matchesTurfName = booking.turf?.turfName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesSport = booking.turf?.sports?.some((sport) =>
        sport.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesStatus = filterStatus === "All" || booking.status === filterStatus;

      return (matchesTurfName || matchesSport) && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "price") return b.price - a.price;
      return 0;
    });

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i < rating; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 mr-1" />);
    }
    return stars;
  };
  return (
    <div
      style={{
        backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
      }}
      className=" min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-5">
          <h1 className="text-4xl font-orbitron font-bold text-gray-800 dark:text-white mb-3 mt-5 lg:mt-0">
            Booking History
          </h1>
          <p className="text-gray-600 font-serif text-xl dark:text-gray-400">View your past turf bookings</p>
        </header>

        {/* Search and Filter Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search by turf name or sport"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <button
              onClick={toggleFilter}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center text-sm font-medium"
            >
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              Filter & Sort
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`ml-2 transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Filter by Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="All">All</option>
                      <option value="Confirmed">Confirmed</option>
                      {/* Removed "Cancelled" option */}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sort by
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="date">Date</option>
                      <option value="price">Price</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Booking History List */}
        <section className="space-y-6">
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-start">
                  <div className="w-full sm:w-2/3">
                    <h2 className="text-2xl font-serif font-semibold mb-2 text-gray-800 dark:text-white">
                      {booking.turf?.turfName}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-600 font-montserrat dark:text-gray-300">
                        <FontAwesomeIcon icon={faCalendar} className="mr-2 text-blue-500" />
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-gray-600  dark:text-gray-300">
                        <FontAwesomeIcon icon={faClock} className="mr-2 font-sans text-green-500" />
                        {new Date(booking.date).toLocaleDateString()} | {booking.timeSlot.join(", ")}
                      </p>
                      <p className="text-gray-600 font-montserrat dark:text-gray-300">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-500" />
                        {booking.turf?.turfLocation}
                      </p>
                      <p className="text-gray-600 font-montserrat dark:text-gray-300">
                        <FontAwesomeIcon icon={faFutbol} className="mr-2 text-purple-500" />
                        {booking.turf?.sports?.[0]?.sports ? booking.turf?.sports?.[0]?.sports.join(", ") : null}                    

                      </p>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3 mt-4 sm:mt-0 text-right">
                    <p
                      className={`inline-block font-sans px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {booking.status}
                    </p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      ₹{booking.turf?.turfPricePerHour}
                    </p>
                    {
  booking.turf?.comments?.[0]?.rating && (
    <div className="flex items-center justify-end mt-2">
      <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
      {renderStars(booking.turf.comments[0].rating.rating)}
      <span className="text-gray-600 dark:text-gray-300">
        {booking.turf.comments[0].rating.rating}
      </span>
    </div>
  )
}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Export Options */}
        <section className="mt-8 flex justify-end space-x-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center text-sm font-medium">
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Export as CSV
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center text-sm font-medium">
            <FontAwesomeIcon icon={faPrint} className="mr-2" />
            Print History
          </button>
        </section>

        {/* Booking Statistics */}
        <section className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-serif font-bold mb-6 text-gray-800 dark:text-white flex items-center">
            <FontAwesomeIcon icon={faChartBar} className="mr-3 text-blue-500" />
            Your Booking Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="text-lg font-sans font-semibold mb-2 text-blue-800 dark:text-blue-200">Total Bookings</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{allBookings.length}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <h3 className="text-lg font-sans font-semibold mb-2 text-green-800 dark:text-green-200">Completed Bookings</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">
                {previousBookings.length}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
              <h3 className="text-lg font-sans font-semibold mb-2 text-red-800 dark:text-red-200">Cancelled Bookings</h3>
              <p className="text-3xl font-bold text-red-600 dark:text-red-300">
                {cancelBooked.length}
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
              <h3 className="text-lg font-sans font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Rescheduled</h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">
                {rescheduledBookings.length}
              </p>
            </div>
          </div>
        </section>

        {/* Favorite Turfs */}
        <section className="mt-12">
          <h2 className="text-2xl font-serif font-bold mb-6 text-gray-800 dark:text-white flex items-center">
            <FontAwesomeIcon icon={faHeart} className="mr-3 text-red-500" />
            Your fav Turfs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...new Set(allBookings.map((b) => b.turf?.turfName))].slice(0, 3).map((turfName, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold font-montserrat mb-2 text-gray-800 dark:text-white">{turfName}</h3>
                <p className="text-gray-600 dark:text-gray-300 font-montserrat">
                  Booked {allBookings.filter((b) => b.turf?.turfName === turfName).length} times
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Booking Tips */}
        <section className="mt-12 bg-indigo-50 dark:bg-indigo-900 rounded-xl  shadow-lg p-6">
          <h2 className="text-2xl font-serif font-bold mb-4 text-indigo-800 dark:text-indigo-200 flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3 text-indigo-500" />
            Booking Tips
          </h2>
          <ul className="list-disc font-montserrat list-inside text-indigo-700 dark:text-indigo-300 space-y-2">
            <li>Book in advance for popular time slots to ensure availability.</li>
            <li>Check the weather forecast before booking outdoor turfs.</li>
            <li>Rescheduling can be done only under 24 hours</li>
            <li>Always review the cancellation policy before confirming your booking.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default BookingHistory;