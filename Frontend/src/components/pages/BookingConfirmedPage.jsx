import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { cancelBooking } from "../../slices/bookingSlice";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DarkModeContext } from "../../context/DarkModeContext";
import whiteBg from "../../assets/Images/whiteBg.png";
import blackBg from "../../assets/Images/blackBg.png";
import { setNotification } from "../../slices/notificationSlice";
import {
  FaInfoCircle,
  FaClock,
  FaUtensils,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  faCheckCircle,
  faCalendar,
  faClock,
  faMapMarkerAlt,
  faMoneyBillWave,
  faCreditCard,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { loadNotification } from "../../slices/notificationSlice";

const BookingConfirmedPage = () => {
  const { darkMode } = useContext(DarkModeContext);
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    selectedTurfName,
    selectedDate,
    selectedSlots,
    totalPrice,
    paymentMode,
  } = location.state;

  const handleCancelBooking = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/booking/cancelBooking/${bookingId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Booking cancelled successfully!");
        dispatch(cancelBooking(bookingId));
        dispatch(loadNotification());
        try {
          const notificationResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/notify/getNotifications/${response.data.user._id}`,
            {
              headers: { "Content-Type": "application/json", withCredentials: true },
            }
          );
          if (notificationResponse.data.success) {
            console.log("fetch notification",notificationResponse.data.currentMessage);
            dispatch(setNotification(notificationResponse.data.currentMessage || []));
            localStorage.setItem(
              "userNotification",
              JSON.stringify(notificationResponse.data.currentMessage || [])
            );
        
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Something Went Wrong in fetching notifications!");
          console.log(error.response?.data?.message)
        }
        navigate("/myBookings");
      } else {
        toast.error(response.data.message || "Failed to cancel booking.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong during cancellation."
      );
      console.error("Cancellation error:", error);
    }
  };
  function convertTo24Hour(time12h) {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
  
    if (hours === "12") hours = "00";
    if (modifier.toLowerCase() === "PM") hours = parseInt(hours, 10) + 12;
  
    return `${hours.padStart(2, "0")}:${minutes}`;
  }
  
  return (
    <div
      style={{
        backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
      }}
      className="min-h-screen mt-16 py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="md:flex">
          <div className="md:w-1/2 p-8">
            <div className="text-center mb-8">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 text-6xl mb-4"
              />
              <h2 className="text-3xl font-bold font-orbitron text-gray-900 dark:text-white mb-2">
                Booking Confirmed!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-serif">
                Your turf is reserved and ready for action.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="mr-3 text-blue-500 text-xl"
                />
                <div>
                  <span className="font-semibold block">Turf</span>
                  <span className="text-lg">{selectedTurfName}</span>
                </div>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="mr-3 text-green-500 text-xl"
                />
                <div>
                  <span className="font-semibold block">Date</span>
                  <span className="text-lg">{selectedDate}</span>
                </div>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <FontAwesomeIcon
                  icon={faClock}
                  className="mr-3 text-yellow-500 text-xl"
                />
                <div>
                <span className="font-semibold block">Time Slots</span>
<span className="text-lg">
  {selectedSlots.map(time => {
    const date = new Date(`1970-01-01T${convertTo24Hour(time)}:00`);
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase().replace(" ", "");
  }).join(", ")}
</span>

                </div>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  className="mr-3 text-red-500 text-xl"
                />
                <div>
                  <span className="font-semibold block">Total Price</span>
                  <span className="text-lg">₹{totalPrice}</span>
                </div>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <FontAwesomeIcon
                  icon={faCreditCard}
                  className="mr-3 text-purple-500 text-xl"
                />
                <div>
                  <span className="font-semibold block">Payment Mode</span>
                  <span className="text-lg">{paymentMode}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 bg-gray-100 dark:bg-gray-700 p-8">
            <div className="bg-white dark:bg-gray-600 p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-orbitron font-semibold mb-4 text-gray-800 dark:text-white">
                Booking Details
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-semibold font-serif">Booking ID:</span> {bookingId}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold font-serif">Status:</span>{" "}
                <span className="text-green-500 font-semibold">Confirmed</span>
              </p>
            </div>

            {/* Important notes section*/}
            <div className="bg-gray-100 dark:bg-gray-800 mb-10 p-5 rounded-xl shadow-lg mt-4 border-l-4 border-green-500">
              <h3 className="text-xl font-orbitron font-bold mb-3 text-gray-800 dark:text-white flex items-center">
                <FaInfoCircle className="text-blue-500 mr-2" /> Important Notes
              </h3>
              <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-3">
                <li className="flex items-center">
                  <FaClock className="text-green-500 mr-2" />
                  <span>
                    <strong>Arrive 15 minutes early</strong> before your booking
                    time.
                  </span>
                </li>
                <li className="flex items-center">
                  <FaUtensils className="text-red-500 mr-2" />
                  <span>
                    <strong>No food or drinks</strong> allowed on the turf.
                  </span>
                </li>
                <li className="flex items-center">
                  <FaExclamationTriangle className="text-yellow-500 mr-2" />
                  <span>
                    <strong>Rescheduling</strong> is allowed{" "}
                    <strong>only 24 hours</strong> before the booking.
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 flex justify-center items-center flex-col">
              <button
                onClick={() => {
                  /* download ka logic */
                }}
                className="w-[20rem] bg-green-500 dark:bg-green-700 dark:hover:bg-green-600 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download Booking Receipt
              </button>
              <button
                onClick={handleCancelBooking}
                className="w-[20rem] bg-red-500 dark:bg-red-700 dark:hover:bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition duration-300"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingConfirmedPage;
