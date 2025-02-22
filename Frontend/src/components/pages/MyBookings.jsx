import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { DarkModeContext } from "../../context/DarkModeContext"
import whiteBg from "../../assets/Images/whiteBg.png"
import blackBg from "../../assets/Images/blackBg.png"
import {
  faChevronDown,
  faCalendarPlus,
  faSearch,
  faHeadset,
  faDownload,
  faCalendar,
  faMapMarkerAlt,
  faTag,
} from "@fortawesome/free-solid-svg-icons"

const bookings = [
  {
    id: 1,
    turfName: "City Football Turf",
    date: "2024-07-15",
    time: "19:00",
    location: "Downtown Arena",
    status: "Confirmed",
  },
  {
    id: 2,
    turfName: "GreenField Arena",
    date: "2024-07-20",
    time: "16:00",
    location: "Uptown Park",
    status: "Completed",
  },
  {
    id: 3,
    turfName: "SportsCom Turf",
    date: "2024-07-25",
    time: "20:00",
    location: "Central Sports Complex",
    status: "Cancelled",
  },
  {
    id: 4,
    turfName: "AstroTurf Zone",
    date: "2024-08-01",
    time: "18:00",
    location: "Westside Grounds",
    status: "Confirmed",
  },
]

const faqs = [
  {
    question: "How do I book a turf?",
    answer:
      "You can book a turf by selecting an available time slot on our booking page and completing the payment process.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "You can cancel your booking up to 24 hours before the scheduled time for a full refund. Cancellations made within 24 hours are not eligible for a refund.",
  },
  {
    question: "Can I reschedule my booking?",
    answer: "Yes, you can reschedule your booking up to 48 hours before the scheduled time, subject to availability.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and PayPal.",
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const MyBookings = () => {
  const {darkMode} = useContext(DarkModeContext)
  const [activeTab, setActiveTab] = useState("Upcoming Bookings")
  const [searchQuery, setSearchQuery] = useState("")
  const [allBookings, setAllBookings] = useState(bookings)
  const [openIndex, setOpenIndex] = useState(null)

  const filteredBookings = allBookings.filter((booking) => {
    const searchTerm = searchQuery.toLowerCase()
    const turfName = booking.turfName.toLowerCase()
    const bookingId = String(booking.id)

    const matchesSearchQuery = turfName.includes(searchTerm) || bookingId.includes(searchTerm)

    if (activeTab === "Upcoming Bookings") {
      return matchesSearchQuery && booking.status === "Confirmed"
    } else if (activeTab === "Previous Bookings") {
      return matchesSearchQuery && booking.status === "Completed"
    } else if (activeTab === "Cancelled Bookings") {
      return matchesSearchQuery && booking.status === "Cancelled"
    }

    return matchesSearchQuery
  })

  const deleteBooking = (id) => {
    setAllBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id))
  }

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div style={{
              backgroundImage: `url(${darkMode ? blackBg : whiteBg})`
            }} className="mt-16 lg:mt-5 min-h-screen p-4 sm:p-6 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-cover bg-center h-64 flex items-center justify-center rounded-lg overflow-hidden mb-8">
        <div className="text-center p-6 bg-green-500  rounded-lg">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Welcome to Your Bookings, Sabina Shaikh</h1>
          <p className="text-white mb-4">Manage your reservations with ease.</p>
          <button className="bg-green-500 text-white border border-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300">
            Book a New Turf
          </button>
        </div>
      </div>

      {/* Policy Section */}
      <div className="max-w-6xl mx-auto mb-8 grid gap-4 sm:grid-cols-2">
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg border border-red-200 dark:border-red-500">
          <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">Cancellation & Reschedule Policy</h3>
          <p className="text-red-700 dark:text-red-300 text-sm">
            Cancel within 24 hours for a full refund. Reschedule subject to availability.
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg border border-green-200 dark:border-green-500">
          <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">Real-Time Updates & Easy Management</h3>
          <p className="text-green-700 dark:text-green-300 text-sm">
            Get instant booking updates and manage your reservations effortlessly.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-6">
          {["Upcoming Bookings","Cancelled Bookings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                activeTab === tab
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Turf Name or Booking ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* Booking Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-shadow duration-300 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-2 dark:text-white">{booking.turfName}</h2>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                <span>
                  {booking.date} | {booking.time}
                </span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                <span>{booking.location}</span>
              </div>
              <p className="mt-4 dark:text-white">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    booking.status === "Confirmed"
                      ? "text-green-600 dark:text-green-400"
                      : booking.status === "Completed"
                        ? "text-gray-600 dark:text-gray-400"
                        : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {booking.status}
                </span>
              </p>
              <div className="mt-4 space-y-2">
                <button className="w-full bg-green-400 dark:bg-green-600 dark:hover:bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
                  View Details
                </button>
                {booking.status === "Confirmed" && (
                  <button className="w-full bg-red-400 dark:bg-red-600 dark:hover:bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
                    Cancel Booking
                  </button>
                )}
                {(booking.status === "Completed" || booking.status === "Cancelled") && (
                  <button
                    onClick={() => deleteBooking(booking.id)}
                    className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                  >
                    Delete
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Special Offers Section */}
      <div className="bg-green-500 dark:bg-green-700 text-white p-6 rounded-lg my-8 mx-auto max-w-4xl text-center">
        <div className="bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={faTag} className="text-white text-xl" />
        </div>
        <h3 className="text-2xl font-semibold mb-4">Special Offer!</h3>
        <p className="mb-4">
          Get <strong>20% off</strong> on your next booking. Hurry, this exclusive offer ends soon!
        </p>
        <div className="w-full max-w-xs mx-auto bg-white bg-opacity-20 rounded-full h-2 mb-2">
          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "60%" }}></div>
        </div>
        <p className="text-sm">60% of the offer claimed</p>
      </div>

      {/* FAQ Section */}
      <section className="py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{faq.question}</h3>
                <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <FontAwesomeIcon icon={faChevronDown} className="text-green-500" />
                </motion.div>
              </div>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-600 dark:text-gray-300 mt-2 overflow-hidden"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Buttons Section */}
      <div className= "py-12 ">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-white">
            What Would You Like to Do Next?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: faCalendarPlus,
                title: "Book a New Turf",
                desc: "Reserve your favorite turf for your next game.",
                color: "blue",
                link:"/turf",
              },
              {
                icon: faSearch,
                title: "Explore More Turfs",
                desc: "Discover new turfs and venues near you.",
                color: "green",
                link:"/turf",
              },
              {
                icon: faHeadset,
                title: "Contact Support",
                desc: "Our support team is available 24/7 to assist you.",
                color: "purple",
                link:"/contact",
              },
              {
                icon: faDownload,
                title: "Download History",
                desc: "Download your booking history as a PDF or CSV file.",
                color: "yellow",
                link:"/bookinghistory"
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`bg-${item.color}-50 dark:bg-${item.color}-900 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300`}
              >
                <div
                  className={`bg-${item.color}-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <FontAwesomeIcon icon={item.icon} className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{item.desc}</p>
                <Link
            to={item.link}
            className={`bg-${item.color}-500 text-white px-6 py-2 rounded-lg hover:bg-${item.color}-600 transition duration-300 w-full block`}
          >
                  {item.title.split(" ")[0]}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md my-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
          We Value Your Feedback
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          Your feedback helps us improve. Share your thoughts, suggestions, or any issues you faced.
        </p>
        <textarea
          placeholder="Share your thoughts..."
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          rows="3"
        ></textarea>
        <button className="bg-green-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-green-600 transition duration-300 w-full sm:w-auto">
          Submit Feedback
        </button>
      </div>
    </div>
  )
}

export default MyBookings

