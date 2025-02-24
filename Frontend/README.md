<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBookings.map((booking) => (
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
              <button
                onClick={() => openModal(booking)} 
                className="w-full bg-green-400 dark:bg-green-600 dark:hover:bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
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
        {selectedBooking && (
        <BookingDetailsModal booking={selectedBooking} onClose={closeModal} />
      )}
      </div>

=======
  {activeTab === "Cancelled Bookings"
    ? filteredCanceledBookings.map((booking) => (
        <motion.div
          key={booking._id}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-shadow duration-300 hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-2 dark:text-white">{booking.turf.turfName}</h2>
          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
            <FontAwesomeIcon icon={faCalendar} className="mr-2" />
            <span>
              {new Date(booking.date).toLocaleDateString()} | {booking.timeSlot.join(", ")}
            </span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            <span>{booking.turf.turfLocation}</span>
          </div>
          <p className="mt-4 dark:text-white">
            Status:{" "}
            <span className="font-semibold text-red-600 dark:text-red-400">
              Cancelled
            </span>
          </p>
          <div className="mt-4 space-y-2">
            <button className="w-full bg-green-400 dark:bg-green-600 dark:hover:bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
              View Details
            </button>
            <button
              onClick={() => deleteBooking(booking._id)}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Delete
            </button>
          </div>
        </motion.div>
      ))
    : filteredBookings.map((booking) => (
        <motion.div
          key={booking._id}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-shadow duration-300 hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-2 dark:text-white">{booking.turf.turfName}</h2>
          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
            <FontAwesomeIcon icon={faCalendar} className="mr-2" />
            <span>
              {new Date(booking.date).toLocaleDateString()} | {booking.timeSlot.join(", ")}
            </span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            <span>{booking.turf.turfLocation}</span>
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
              <button
                onClick={(e) => handleCancelBooking(booking._id, e)}
                className="w-full bg-red-400 dark:bg-red-600 dark:hover:bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Cancel Booking
              </button>
            )}
            {(booking.status === "Completed" || booking.status === "Cancelled") && (
              <button
                onClick={() => deleteBooking(booking._id)}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Delete
              </button>
            )}
          </div>
        </motion.div>
      ))}
</div>