
import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaMoneyBillWave, FaCreditCard, FaMoneyBill } from "react-icons/fa";
import { DarkModeContext } from "../../context/DarkModeContext";
import whiteBg from "../../assets/Images/whiteBg.png";
import blackBg from "../../assets/Images/blackBg.png";
import { addBooking, setRescheduledBookings } from "../../slices/bookingSlice";
import { setLoader } from "../../slices/authSlice";
import { setNotification } from "../../slices/notificationSlice";

const BookedConfirmPage = () => {
  const { darkMode } = useContext(DarkModeContext);
  const { userId, turfId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const { 
    selectedTurfName, 
    selectedDate, 
    selectedSlots, 
    totalPrice, 
    bookingIdRescheduled, 
    isRescheduled 
  } = location.state || {};

  const [paymentMode, setPaymentMode] = useState("");

  const handlePaymentModeChange = (e) => {
    const capitalize = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase();
    setPaymentMode(capitalize);
  };

  // Updated time formatting function to match backend exactly
  const formatTimeSlot = (timeInput) => {
    // If already in correct format (e.g., "7:00 AM"), return as-is
    if (typeof timeInput === 'string' && /^\d{1,2}:\d{2} [AP]M$/i.test(timeInput)) {
      // Normalize to exact backend format: "H:MM AM/PM" with space and uppercase
      const normalized = timeInput.replace(/(\d{1,2}):(\d{2})\s*([AP]M)/i, (match, h, m, ap) => {
        return `${h}:${m.padStart(2, '0')} ${ap.toUpperCase()}`;
      });
      return normalized;
    }

    // Handle Date objects or other formats
    try {
      const time = new Date(timeInput);
      if (isNaN(time.getTime())) {
        console.error("Invalid time value:", timeInput);
        return "Invalid Time";
      }
      
      let hours = time.getHours();
      const minutes = time.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      // Format exactly as backend expects: "H:MM AM/PM" with space and uppercase
      return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm.toUpperCase()}`;
    } catch (error) {
      console.error("Time formatting error:", error);
      return "Invalid Time";
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/notify/getNotifications/${userId}`,
        {
          headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
          },
        }
      );
      
      if (response.data.success) {
        const notifications = response.data.currentMessage || [];
        dispatch(setNotification(notifications));
        localStorage.setItem("userNotification", JSON.stringify(notifications));
      }
    } catch (error) {
      console.error("Notification error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch notifications");
    }
  };

  const handleConfirmBooking = async () => {
    if (!paymentMode) {
      toast.error("Please select a payment mode.");
      return;
    }
    if (paymentMode === "Online") {
      toast.error("Online Mode is not available right now!");
      return;
    }

    // Format time slots to exactly match backend format
    const formattedSlots = selectedSlots.map(slot => formatTimeSlot(slot)).filter(time => time !== "Invalid Time");
    if (formattedSlots.length === 0) {
      toast.error("No valid time slots selected");
      return;
    }

    // Debug log to verify the exact format being sent
    console.log("Sending time slots to backend:", formattedSlots);

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(selectedDate)) {
      toast.error("Invalid date format");
      return;
    }

    dispatch(setLoader(true));
    const data = {
            newTimeSlot: formattedSlots,
            bookingId: bookingIdRescheduled
          }
      console.log("data sending to backedn",data)
    try {
      if (isRescheduled && bookingIdRescheduled) {
        const rescheduleResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/booking/rescheduleBooking`,
         data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (!rescheduleResponse.data.success) {
          throw new Error(rescheduleResponse.data.message || "Failed to reschedule booking");
        }

        const updatedBooking = rescheduleResponse.data.booking;
        if (!updatedBooking?._id) {
          throw new Error("Reschedule successful but invalid booking data returned");
        }

        dispatch(setRescheduledBookings(updatedBooking));
        await fetchNotifications();
        
        navigate(`/booking-confirmation/${updatedBooking._id}`, {
          state: {
            bookingId: updatedBooking._id,
            selectedTurfName,
            selectedDate,
            selectedSlots: formattedSlots,
            totalPrice,
            paymentMode,
            isRescheduled: true,
          },
        });
        
        toast.success("Booking rescheduled successfully!");
        return;
      }

      // Handle new booking
      const bookingResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/booking/bookingTurf/${turfId}/${userId}`,
        {
          date: selectedDate,
          timeSlot: formattedSlots,
          price: totalPrice,
          paymentMode: paymentMode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!bookingResponse.data.success) {
        throw new Error(bookingResponse.data.message || "Failed to create booking");
      }

      const newBooking = bookingResponse.data.booking;
      if (!newBooking?._id) {
        throw new Error("Booking successful but invalid booking data returned");
      }

      dispatch(addBooking(newBooking));
      await fetchNotifications();
      
      navigate(`/booking-confirmation/${newBooking._id}`, {
        state: {
          bookingId: newBooking._id,
          selectedTurfName,
          selectedDate,
          selectedSlots: formattedSlots,
          totalPrice,
          paymentMode,
          isRescheduled: false,
        },
      });
      
      toast.success("Booking confirmed successfully!");

    } catch (error) {
      console.error("Booking error:", error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = error.response?.data?.message || 
                       error.message || 
                       (isRescheduled ? "Failed to reschedule booking" : "Failed to create booking");
      
      // Enhanced error message for slot availability
      if (errorMessage.includes('not available')) {
        errorMessage = `Slot not available. Please note: Time slots must be in exact format (e.g., "7:00 AM").`;
      }
      
      toast.error(errorMessage);
    } finally {
      dispatch(setLoader(false));
    }
  };

  const displayTimeSlots = () => {
    if (!selectedSlots || selectedSlots.length === 0) return "No slots selected";
    
    return selectedSlots.map(slot => {
      const formatted = formatTimeSlot(slot);
      return formatted === "Invalid Time" ? slot : formatted;
    }).join(", ");
  };

  // Debug initial slots
  useEffect(() => {
    if (selectedSlots) {
      console.log("Initial selected slots:", selectedSlots);
      console.log("Formatted slots:", selectedSlots.map(slot => formatTimeSlot(slot)));
    }
  }, [selectedSlots]);

  return (
    <div 
      style={{
        backgroundImage: `url(${darkMode ? blackBg : whiteBg})`
      }} 
      className="min-h-screen mt-16 pt-28 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="md:flex relative z-20">
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold font-serif text-gray-900 dark:text-white mb-6">Confirm Your Booking</h1>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-montserrat font-semibold text-gray-800 dark:text-gray-200 mb-4">Booking Summary</h2>
                <div className="space-y-3">
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaCalendarAlt className="mr-2 text-green-500" />
                    <span className="font-semibold mr-2">Turf:</span> {selectedTurfName || "N/A"}
                  </p>
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaCalendarAlt className="mr-2 text-blue-500" />
                    <span className="font-semibold mr-2">Date:</span> {selectedDate || "N/A"}
                  </p>
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaClock className="mr-2 text-yellow-500" />
                    <span className="font-semibold mr-2">Time Slots:</span>
                    {displayTimeSlots()}
                  </p>
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaMoneyBillWave className="mr-2 text-red-500" />
                    <span className="font-semibold mr-2">Total Price:</span> ₹{totalPrice || "0"}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-montserrat font-semibold text-gray-800 dark:text-gray-200 mb-4">Select Payment Mode</h2>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="Online"
                      checked={paymentMode === "Online"}
                      onChange={handlePaymentModeChange}
                      className="form-radio h-5 w-5 text-green-500"
                    />
                    <FaCreditCard className="text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-200">Online Payment</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="Cash"
                      checked={paymentMode === "Cash"}
                      onChange={handlePaymentModeChange}
                      className="form-radio h-5 w-5 text-green-500"
                    />
                    <FaMoneyBill className="text-green-500" />
                    <span className="text-gray-700 dark:text-gray-200">Cash on Arrival</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 bg-green-500 p-8 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-orbitron font-bold text-white mb-4">Ready to Play?</h2>
              <p className="text-white font-montserrat text-lg mb-6">Confirm your booking and get ready for an amazing time!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirmBooking}
                className="bg-white text-green-500 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-gray-100 transition duration-300"
              >
                {isRescheduled ? "Reschedule Booking" : "Confirm Booking"}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookedConfirmPage;