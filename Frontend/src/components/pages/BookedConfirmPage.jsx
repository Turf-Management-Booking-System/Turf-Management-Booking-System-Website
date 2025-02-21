import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

const BookedConfirmPage = () => {
const {userId} = useParams();
const {turfId} = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const { selectedTurfName, selectedDate, selectedSlots, totalPrice } = location.state;

  const [paymentMode, setPaymentMode] = useState("");

  const handlePaymentModeChange = (e) => {
    const capitalize = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase();
    setPaymentMode(capitalize);
  };
  console.log("payemnt mode",paymentMode);
  // Handle confirm booking
  const handleConfirmBooking = async () => {
    if (!paymentMode) {
      toast.error("Please select a payment mode.");
      return;
    }
    if(paymentMode === "Online"){
        toast.error("Online Mode is not available right now!");
        return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/booking/bookingTurf/${turfId}/${userId}`,
        {
           "date":selectedDate,
          "timeSlot":selectedSlots,
            "price":totalPrice,
          "paymentMode":paymentMode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Booking confirmed successfully!");
        navigate(`/booking-confirmation/${response.data.newBooking._id}`, {
          state: {
            bookingId: response.data.newBooking._id,
            selectedTurfName,
            selectedDate,
            selectedSlots,
            totalPrice,
            paymentMode,
          },
        });
      } else {
        toast.error(response.data.message || "Failed to confirm booking.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong during booking."
      );
      console.error("Booking error:", error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Confirm Your Booking
        </h1>

        {/* Booking Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Booking Summary
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Turf:</span> {selectedTurfName}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {selectedDate}
            </p>
            <p>
              <span className="font-semibold">Time Slots:</span>{" "}
              {selectedSlots.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Total Price:</span> ₹{totalPrice}
            </p>
          </div>
        </div>

        {/* Payment Mode Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Select Payment Mode
          </h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMode"
                value="Online"
                checked={paymentMode === "Online"}
                onChange={handlePaymentModeChange}
                className="form-radio h-4 w-4 text-green-500"
              />
              <span>Online Payment</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMode"
                value="Cash"
                checked={paymentMode === "Cash"}
                onChange={handlePaymentModeChange}
                className="form-radio h-4 w-4 text-green-500"
              />
              <span>Cash on Arrival</span>
            </label>
          </div>
        </div>

        {/* Confirm Booking Button */}
        <button
          onClick={handleConfirmBooking}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookedConfirmPage;