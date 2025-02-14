import axios from "axios";
import { setLoader } from "../../slices/authSlice";
import { setLocation } from "../../slices/turfSlice";
import toast from "react-hot-toast";
export const fetchTurfLocations = () => async (dispatch) => {
  try {
    dispatch(setLoader(true));
    const response = await axios.get("http://localhost:4000/api/v1/turf/getAllTurfLocations", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    console.log("Response from backend location", response.data.turf);
    dispatch(setLocation(response.data.turf));
  } catch (error) {
    console.log("Error", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Unable to send data to backend");
  } finally {
    dispatch(setLoader(false));
  }
};

export default fetchTurfLocations;
