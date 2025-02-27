import { useContext, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { FaCalendarAlt, FaClock, FaMoneyBillWave, FaCreditCard, FaMoneyBill } from "react-icons/fa";
import { DarkModeContext } from "../../context/DarkModeContext"
import whiteBg from "../../assets/Images/whiteBg.png";
import blackBg from "../../assets/Images/blackBg.png";
import { addBooking, setRescheduledBookings } from "../../slices/bookingSlice";
import { setLoader } from "../../slices/authSlice"
import { loadNotification } from "../../slices/notificationSlice"
import { setNotification } from "../../slices/notificationSlice"
const BookedConfirmPage = () => {
  const {darkMode} = useContext(DarkModeContext);
  const { userId, turfId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const { selectedTurfName, selectedDate, selectedSlots, totalPrice ,bookingIdRescheduled,isRescheduled} = location.state

  const [paymentMode, setPaymentMode] = useState("")

  const handlePaymentModeChange = (e) => {
    const capitalize = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase()
    setPaymentMode(capitalize)
  }

  const handleConfirmBooking = async () => {
    if (!paymentMode) {
      toast.error("Please select a payment mode.")
      return
    }
    if (paymentMode === "Online") {
      toast.error("Online Mode is not available right now!")
      return
    }
     const data ={
          "newTimeSlot":selectedSlots,
          "bookingId":bookingIdRescheduled
        }
        console.log("data",data)
        if(isRescheduled){
          dispatch(setLoader(true))
          try {
            const response = await axios.post(
              `http://localhost:4000/api/v1/booking/rescheduleBooking`,data,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            
            if (response.data.success) {
              toast.success("Booking rescheduled successfully!");
              console.log("response",response.data.booking)
              dispatch(setRescheduledBookings(response.data.booking))
              navigate(`/booking-confirmation/${response.data.booking._id}`, {
                state: {
                  bookingId: response.data.booking._id,
                  selectedTurfName,
                  selectedDate,
                  selectedSlots,
                  totalPrice,
                  paymentMode,
                },
              })
              dispatch(loadNotification());
              try {
                const notificationResponse = await axios.get(
                  `http://localhost:4000/api/v1/notify/getNotifications/${response.data.booking.user._id}`,
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
              return;
            } else {
              toast.error(response.data.message || "Failed to rescheduled booking.");
            }
          } catch (error) {
            toast.error(
              error.response?.data?.message ||
                "Something went wrong during rescheduled."
            );
            console.error("Rescheduled error:", error);
          }finally{
            dispatch(setLoader(false))
          }
        }
       try {
        dispatch(setLoader(true))
      const response = await axios.post(
        `http://localhost:4000/api/v1/booking/bookingTurf/${turfId}/${userId}`,
        {
          date: selectedDate,
          timeSlot: selectedSlots,
          price: totalPrice,
          paymentMode: paymentMode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.data.success) {
        toast.success("Booking confirmed successfully!")
        dispatch(addBooking(response?.data?.newBookings))
        navigate(`/booking-confirmation/${response.data.newBookings._id}`, {
          state: {
            bookingId: response.data.newBookings._id,
            selectedTurfName,
            selectedDate,
            selectedSlots,
            totalPrice,
            paymentMode,
          },
        })
        dispatch(loadNotification());
        try {
          const notificationResponse = await axios.get(
            `http://localhost:4000/api/v1/notify/getNotifications/${response.data.newBookings.user._id}`,
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
      } else {
        toast.error(response.data.message || "Failed to confirm booking.")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong during booking.")
      console.error("Booking error:", error)
    }finally{
      dispatch(setLoader(false))
    }
  }

  return (
    <div 
    style={{
              backgroundImage: `url(${darkMode ? blackBg : whiteBg})`
            }} className="min-h-screen mt-16 pt-28 py-12 px-4 sm:px-6 lg:px-8  transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="md:flex relative z-20">
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Confirm Your Booking</h1>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Booking Summary</h2>
                <div className="space-y-3">
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaCalendarAlt className="mr-2 text-green-500" />
                    <span className="font-semibold mr-2">Turf:</span> {selectedTurfName}
                  </p>
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaCalendarAlt className="mr-2 text-blue-500" />
                    <span className="font-semibold mr-2">Date:</span> {selectedDate}
                  </p>
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaClock className="mr-2 text-yellow-500" />
                    <span className="font-semibold mr-2">Time Slots:</span> {selectedSlots.join(", ")}
                  </p>
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaMoneyBillWave className="mr-2 text-red-500" />
                    <span className="font-semibold mr-2">Total Price:</span> ₹{totalPrice}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Select Payment Mode</h2>
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
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Play?</h2>
              <p className="text-white text-lg mb-6">Confirm your booking and get ready for an amazing time!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirmBooking}
                className="bg-white text-green-500 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-gray-100 transition duration-300"
              >
                  {bookingIdRescheduled ? "Reschedule Booking" : "Confirm Booking"}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default BookedConfirmPage

