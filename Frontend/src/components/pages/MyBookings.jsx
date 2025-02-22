import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCalendarPlus,
  faSearch,
  faHeadset,
  faDownload,
  faCalendar,
  faMapMarkerAlt,
  faClock,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

// Sample bookings data
const bookings = [
  {
    id: 1,
    turfName: "Green Valley Turf",
    date: "November 10, 2023",
    time: "10:00 AM - 12:00 PM",
    location: "123 Sports Lane, Bangalore",
    status: "Confirmed",
  },
  {
    id: 2,
    turfName: "Skyline Sports Arena",
    date: "October 25, 2023",
    time: "2:00 PM - 4:00 PM",
    location: "456 Stadium Road, Mumbai",
    status: "Completed",
  },
  {
    id: 3,
    turfName: "Golden Goal Turf",
    date: "December 5, 2023",
    time: "6:00 PM - 8:00 PM",
    location: "789 Football Street, Delhi",
    status: "Cancelled",
  },
];

// Sample FAQ data
const faqs = [
  {
    question: "How do I book a turf?",
    answer: "You can book a turf by selecting your preferred date, time, and location on our website. Follow the prompts to complete your booking.",
  },
  {
    question: "Can I modify my booking after it’s confirmed?",
    answer: "Yes, you can modify your booking (e.g., change the date or time) within 24 hours of the scheduled time, subject to availability.",
  },
  {
    question: "How do I view my booking details?",
    answer: 'You can view your booking details by navigating to the "My Bookings" page and clicking on the "View Details" button for the respective booking.',
  },
  {
    question: "Can I cancel my booking?",
    answer: "Yes, you can cancel your booking within 24 hours of the scheduled time. Cancellations made after this period may not be eligible for a refund.",
  },
  {
    question: "How do I cancel my booking?",
    answer: 'Go to the "My Bookings" page, find the booking you want to cancel, and click the "Cancel Booking" button.',
  },
  {
    question: "Can I reschedule my booking?",
    answer: "Yes, you can reschedule your booking within 24 hours of the scheduled time, subject to availability.",
  },
];

// Animation variants for Framer Motion
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState("Upcoming Bookings");
  const [searchQuery, setSearchQuery] = useState("");
  const [allBookings, setAllBookings] = useState(bookings);
  const [openIndex, setOpenIndex] = useState(null);

  // Filter bookings based on status and search query
  const filteredBookings = allBookings
    .filter((booking) => {
      if (activeTab === "Upcoming Bookings") return booking.status === "Confirmed";
      if (activeTab === "Previous Bookings") return booking.status === "Completed";
      if (activeTab === "Cancelled Bookings") return booking.status === "Cancelled";
      return true;
    })
    .filter((booking) => {
      return (
        booking.turfName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toString().includes(searchQuery)
      );
    });

  // Function to delete a booking
  const deleteBooking = (id) => {
    setAllBookings((prevBookings) =>
      prevBookings.filter((booking) => booking.id !== id)
    );
  };

  // Function to toggle FAQ
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-10">
      {/* Hero Section */}
      <div className="bg-cover bg-center h-64 flex items-center justify-center" style={{ backgroundImage: `url(/)` }}>
        <div className=" ">
          <h1 className="text-4xl font-bold text-black">Welcome to Your Bookings ,Sabina Shaikh</h1>
          <p className="text-black mt-2">Manage your reservations with ease.</p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-600 transition duration-300">
            Book a New Turf
          </button>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="max-w-4xl mx-auto mb-6">
        {/* Cancellation and Reschedule Policy (Light Red Div) */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mt-4">
          <p className="text-red-700">
            <strong>Cancellation Policy:</strong> You can cancel your booking within 24 hours of the scheduled time. 
            Cancellations made after this period may not be eligible for a refund.
          </p>
          <p className="text-red-700 mt-2">
            <strong>Reschedule Policy:</strong> You can reschedule your booking within 24 hours of the scheduled time, 
            subject to availability. Rescheduling is quick and easy—just click the "Reschedule" button on your booking.
          </p>
        </div>

        {/* Real-Time Updates and Easy Management (Light Green Div) */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
          <p className="text-green-700">
            <strong>Real-Time Updates:</strong> Get instant updates on your bookings, including confirmations, reminders, 
            and any changes to your reservation.
          </p>
          <p className="text-green-700 mt-2">
            <strong>Easy Management:</strong> Our user-friendly interface allows you to view, modify, or delete your bookings 
            with just a few clicks. Need help? Contact our support team anytime!
          </p>
        </div>
      </div>

      {/* Booking Overview Section */}
      <div className="max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {["Upcoming Bookings", "Previous Bookings", "Cancelled Bookings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by Turf Name or Booking ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Booking Cards */}
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-2">{booking.turfName}</h2>
              <div className="flex items-center text-gray-600 mb-2">
                <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                <span>{booking.date} | {booking.time}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                <span>{booking.location}</span>
              </div>
              <p className="mt-4">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    booking.status === "Confirmed"
                      ? "text-green-600"
                      : booking.status === "Completed"
                      ? "text-gray-600"
                      : "text-red-600"
                  }`}
                >
                  {booking.status}
                </span>
              </p>
              <div className="mt-4 space-x-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                  View Details
                </button>
                {booking.status === "Confirmed" && (
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
                    Cancel Booking
                  </button>
                )}
                {(booking.status === "Completed" || booking.status === "Cancelled") && (
                  <button
                    onClick={() => deleteBooking(booking.id)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
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
      <div className="bg-green-500 text-white p-6 rounded-lg mt-8 mx-auto w-[50vw] text-center flex flex-col items-center justify-center">
        {/* Offer Icon */}
        <div className="bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={faTag} className="text-white text-xl" />
        </div>

        {/* Heading */}
        <h3 className="text-2xl font-semibold mb-4">Special Offer!</h3>

        {/* Content */}
        <p className="mb-4">
          Get <strong>20% off</strong> on your next booking. Hurry, this exclusive offer ends soon! Don’t miss out on this amazing deal.
        </p>

        {/* Progress Bar */}
        <div className="w-[30vw] bg-gray-200 rounded-full h-1 mb-2 ">
          <div className="bg-yellow-400 h-1 rounded-full" style={{ width: "60%" }}></div>
        </div>

        {/* Progress Text */}
        <p className="text-sm">60% of the offer claimed</p>
      </div>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-black">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FontAwesomeIcon icon={faChevronDown} className="text-blue-500" />
                  </motion.div>
                </div>

                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-600 overflow-hidden mt-2"
                >
                  {faq.answer}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Buttons Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">What Would You Like to Do Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Book a New Turf */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 w-[20vw]">
              <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faCalendarPlus} className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book a New Turf</h3>
              <p className="text-gray-600 mb-4">
                Reserve your favorite turf for your next game. Quick and easy booking process!
              </p>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full">
                Book Now
              </button>
            </div>

            {/* Explore More Turfs */}
            <div className="bg-green-50 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 w-[20vw]">
              <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faSearch} className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Explore More Turfs</h3>
              <p className="text-gray-600 mb-4">
                Discover new turfs and venues near you. Find the perfect spot for your game!
              </p>
              <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300 w-full">
                Explore
              </button>
            </div>

            {/* Contact Support */}
            <div className="bg-purple-50 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 w-[20vw]">
              <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faHeadset} className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
              <p className="text-gray-600 mb-4">
                Need help? Our support team is available 24/7 to assist you with any queries.
              </p>
              <button className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition duration-300 w-full">
                Contact Us
              </button>
            </div>

            {/* Download Booking History */}
            <div className="bg-yellow-50 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 w-[20vw]">
              <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faDownload} className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Download History</h3>
              <p className="text-gray-600 mb-4">
                Download your booking history as a PDF or CSV file for your records.
              </p>
              <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition duration-300 w-full">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-8 max-w-4xl mx-auto">
        {/* Heading */}
        <h3 className="text-2xl font-semibold mb-4 text-center">We Value Your Feedback</h3>
        <p className="text-gray-600 text-center mb-6">
          Your feedback helps us improve and provide a better experience for you. Share your thoughts, suggestions, or any issues you faced. We’re here to listen!
        </p>

        {/* Textarea */}
        <textarea
          placeholder="Share your thoughts..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        ></textarea>

        {/* Submit Button */}
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-600 transition duration-300">
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default MyBookings;