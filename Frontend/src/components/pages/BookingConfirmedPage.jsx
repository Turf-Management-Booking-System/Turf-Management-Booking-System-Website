import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const BookingConfirmedPage = () => {
  const {bookingId} = useParams();
  const navigate = useNavigate();
  const token = useSelector((state)=>state.auth.token)
  const location = useLocation();
  const {
    selectedTurfName,
    selectedDate,
    selectedSlots,
    totalPrice,
    paymentMode,
  } = location.state;
 const handleCancelBooking = async(e)=>{
      e.preventDefault();
    try {
        const response = await axios.delete(
          `http://localhost:4000/api/v1/booking/cancelBooking/${bookingId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.data.success) {
          toast.success("Booking cancel successfully!");
        } else {
          toast.error(response.data.message || "Failed to cancel booking.");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Something went wrong during booking."
        );
        console.error("Booking error:", error);
      }
 }
 const handleRescheduleBooking = async(e)=>{
 
 }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="space-y-4">
          <p>
            <span className="font-semibold">Booking ID:</span> {bookingId}
          </p>
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
          <p>
            <span className="font-semibold">Payment Mode:</span> {paymentMode}
          </p>
        </div>
        <button
          onClick={handleCancelBooking}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          Cancel Booking
        </button>

        {/* Reschedule Booking Button */}
        <button
          onClick={handleRescheduleBooking}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
        >
          Reschedule Booking
        </button>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmedPage;