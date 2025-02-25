import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoader } from "../../slices/authSlice";
import { setCurrentBookings, setPreviousBookings } from "../../slices/bookingSlice";
import { useCallback } from "react";

const useCurrentAndPreviousBooking = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const token = useSelector((state) => state.auth?.token);

  const fetchCurrentAndPreviousBookings = useCallback(async () => {
    if (!user?._id) return;

    try {
      dispatch(setLoader(true));

      const response = await axios.get(
        `http://localhost:4000/api/v1/booking/getUserBookingDetails/${user._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Response from backend recentBookings:", response.data.recentBookings);
      dispatch(setCurrentBookings(response.data.recentBookings));
      dispatch(setPreviousBookings(response.data.previousBookings));
      console.log("previous bookings",response.data.previousBookings);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Unable to fetch bookings");
    } finally {
      dispatch(setLoader(false));
    }
  }, [dispatch, user?._id, token]);

  return fetchCurrentAndPreviousBookings;
};

export default useCurrentAndPreviousBooking;
