import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DarkModeContext } from "../../context/DarkModeContext";
import whiteBg from "../../assets/Images/whiteBg.png";
import { UNSAFE_RouteContext, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import blackBg from "../../assets/Images/blackBg.png";
import {
  faCalendarAlt,
  faClock,
  faCloud,
  faExclamationCircle,
  faInfoCircle,
  faCloudRain,
  faSnowflake,
  faSun 
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";

const BookingPage = () => {
  const { turfId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useContext(DarkModeContext);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const { bookingIdRescheduled, turfLocation } = location.state || {};
  // const [locationTurf,setLocationTurf] = useState("");
  const [slots, setSlots] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const selectedTurfName =
    location.state?.turfName || location.state?.turf?.turfName;
  const token = useSelector((state) => state.auth.token);
  const [priceTurf, setPriceTurf] = useState(0);
  const user = useSelector((state) => state.auth.user);
  const [isRescheduled, setIsRescheduled] = useState(false);
  const loading = useSelector((state)=>state.auth.loading)
  const [weatherInfo, setWeatherInfo] = useState({
    temperature: null,
    condition: "Loading...",
    icon: faCloud,
  });
  const dispatch = useDispatch();
  const [loadingWeather, setLoadingWeather] = useState(true);
  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("rain")) {
      return faCloudRain;
    } else if (conditionLower.includes("sun") || conditionLower.includes("clear")) {
      return faSun;
    } else if (conditionLower.includes("snow")) {
      return faSnowflake;
    } else {
      return faCloud;
    }
  };

  const fetchTurfSlotsByDate = async (date) => {
    try {
      if (!date) {
        console.error("No date provided");
        setSlots([]);
        return;
      }
  
      const response = await axios.get(
        `http://localhost:4000/api/v1/turf/getTurfSlotByDate/${turfId}/${date}`
      );
      console.log(response.data.slots)
      if (!response.data || !Array.isArray(response.data?.slots)) {
        console.error("Invalid response format - slots array missing");
        setSlots([]);
        return;
      }
  
      setSlots(response.data.slots);
      setPriceTurf(response.data.turfDetails?.turfPricePerHour || 0);
      // setLocationTurf(response.data.turfDetails?.turfLocation)
  
    } catch (error) {
      console.error("Error in fetchTurfSlotsByDate:", error);
      toast.error(error.response?.data?.message || "Error fetching slots");
      setSlots([]);
    }
  };
  
  // Update the useEffect to watch selectedDate
  useEffect(() => {
    fetchTurfSlotsByDate(selectedDate);
  }, [selectedDate]);
   // Function to fetch coordinates from location name
   const fetchLocationCoordinates = async (location) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${location},IN&limit=1&appid=40e263f2c4b1c9ae342a0d3e68c80491`
      );

      if (!response.data || response.data.length === 0) {
        throw new Error('Location not found');
      }

      return response.data[0];
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw error;
    }
  };

  // Fetch weather data using coordinates
  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=40e263f2c4b1c9ae342a0d3e68c80491&units=metric`
      );

      if (response.data) {
        const weatherData = response.data;
        setWeatherInfo({
          temperature: Math.round(weatherData.main.temp),
          condition: weatherData.weather[0].main,
          icon: getWeatherIcon(weatherData.weather[0].main),
        });
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherInfo({
        temperature: null,
        condition: "Weather unavailable",
        icon: faCloud,
      });
    } finally {
      setLoadingWeather(false);
    }
  };
 
  useEffect(() => {
    const loadWeatherData = async () => {
      try {
       
        if (turfLocation ) {
          const locationData = await fetchLocationCoordinates(turfLocation);
          await fetchWeatherData(locationData.lat, locationData.lon);
        } else {
          throw new Error("Turf location not available");
        }
      } catch (error) {
        console.error("Failed to load weather data:", error);
        setWeatherInfo({
          temperature: null,
          condition: "Weather data unavailable",
          icon: faCloud,
        });
        setLoadingWeather(false);
      }
    };

    loadWeatherData();
  }, [turfLocation]);

 
  
  
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setSelectedDate(selectedDate);
    
    // Clear previous selections when date changes
    setSelectedSlots([]);
    setTotalPrice(0);
  
  };
 // Update the toggleSlot function to work with slot objects
const toggleSlot = (slot) => {
  if (slot.status === "booked") return;

  setSelectedSlots((prevSlots) => {
    // Use slot._id if available, otherwise fall back to slot.time
    const slotIdentifier = slot._id || slot.time;
    let newSlots;

    if (prevSlots.some(s => (s._id || s.time) === slotIdentifier)) {
      newSlots = prevSlots.filter((s) => (s._id || s.time) !== slotIdentifier);
    } else {
      newSlots = [...prevSlots, slot];
    }

    const newTotalPrice = newSlots.length * priceTurf;
    setTotalPrice(newTotalPrice);

    return newSlots;
  });
};

// Update the handleProceedToPayment to use slot objects correctly
const handleProceedToPayment = async () => {
  if (!selectedDate || selectedSlots.length === 0) {
    toast.error("Please select a date and at least one slot.");
    return;
  }
  
  navigate(`/confirmBooking/${turfId}/${user._id}`, {
    state: {
      bookingIdRescheduled,
      selectedTurfName,
      selectedDate,
      selectedSlots: selectedSlots.map(slot => slot.time), // Send just the time strings
      totalPrice,
      isRescheduled: !!bookingIdRescheduled,
    },
  });
};

  return (
    <div
      style={{
        backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
      }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white  dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-7xl mx-auto"
      >
        <h1 className="font-orbitron text-3xl font-bold text-green-500 dark:text-green-500 text-center mb-2">
          Book Your Turf Slot
        </h1>
        <p className=" font-serif text-xl text-gray-600 dark:text-gray-400 text-center mb-6">
          Reserve your perfect playing time and enjoy a game with friends and
          family.
        </p>

        {/* Instructions */}
        <div className="mb-6 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h2 className="font-serif text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
            How to Book
          </h2>
          <ol className="font-montserrat list-decimal list-inside text-blue-700 dark:text-blue-300">
            <li>Select your preferred date</li>
            <li>Choose available time slots</li>
            <li>Review your selection and total price</li>
            <li>Click "Proceed to Payment" to complete your booking</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Date Selection */}
            <div className="mb-6">
              <label className="font-serif  block text-gray-700 dark:text-gray-300 mb-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Select Date:
              </label>
              <input
  type="date"
  value={selectedDate}
  onChange={handleDateChange}
  min={new Date().toISOString().split("T")[0]}
  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
/>
            </div>

            {/* Slot Selection */}
            {/* Slot Selection */}
<div className="mb-6">
  <label className="block text-gray-700 dark:text-gray-300 mb-2">
    <FontAwesomeIcon icon={faClock} className="mr-2" />
    Select Time Slot:
  </label>
  
  {!selectedDate ? (
    <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center">
      <FontAwesomeIcon icon={faInfoCircle} className="text-xl mb-2" />
      <p>Please select a date to view available slots</p>
    </div>
  ) : loading ? (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>
  ) : slots.length === 0 ? (
    <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg text-center">
      <FontAwesomeIcon icon={faExclamationCircle} className="text-xl mb-2" />
      <p>No slots available for the selected date</p>
    </div>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {slots.map((slot, index) => (
  <motion.button
    key={slot._id || slot.time}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`p-3 rounded-lg transition-colors ${
      selectedSlots.some(s => (s._id || s.time) === (slot._id || slot.time))
        ? "bg-green-500 text-white"
        : slot.status === "available"
        ? "bg-green-100 dark:bg-green-800 text-gray-900 dark:text-white"
        : "bg-yellow-100 dark:bg-yellow-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
    }`}
    onClick={() => toggleSlot(slot)}
    disabled={slot.status === "booked"}
  >
    <div>
  {new Date(slot.time).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}
</div>

    <div className="text-sm">₹{priceTurf}</div>
  </motion.button>
))}

    </div>
  )}
</div>
            {/* Slot Availability*/}
            <div className="mb-6 flex justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 dark:bg-green-800 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Available
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-800 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Booked
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
              Note: You can book multiple slots for longer playtime.
            </p>
          </div>

          <div>
            {/* Weather*/}
            <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-serif text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Today's Weather
              </h3>
              {loadingWeather ? (
                <div className="flex items-center justify-center">
                  <div className="animate-pulse">Loading weather...</div>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={weatherInfo.icon}
                    className="text-4xl text-yellow-500 mr-3"
                  />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {weatherInfo.temperature !== null
                        ? `${weatherInfo.temperature}°C`
                        : "N/A"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {weatherInfo.condition}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Cancellation and Reschedule Info */}
            <div className="mb-6 bg-red-50 dark:bg-red-900 p-4 rounded-lg">
              <h3 className="text-lg font-serif font-semibold text-red-800 dark:text-red-200 mb-2">
                <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                Cancellation & Reschedule Policy
              </h3>
              <ul className="list-disc list-inside text-red-700 dark:text-red-300">
                <li>Free cancellation up to 24 hours before the booked slot</li>
                <li>Rescheduling is allowed once, subject to availability</li>
                <li>For any queries, please contact our support team</li>
              </ul>
            </div>

            {/* Total price*/}
            <div className="text-center bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <p className="font-serif text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Total Price:{" "}
                <span className="text-green-500 dark:text-green-400">
                  ₹{totalPrice}
                </span>
              </p>
              {/* Selected Date, Time Slot, and Turf Name */}
              <p className="text-lg font-poppins font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-serif font-semibold text-gray-900 dark:text-white">
                  Date:
                </span>{" "}
                {selectedDate || "Not selected"}
              </p>
              <p className="text-lg font-poppins font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-serif font-semibold text-gray-900 dark:text-white">
                  Slot:
                </span>{" "}
                {selectedSlots.length > 0
  ? selectedSlots
      .map(slot => {
        const time = new Date(slot.time); // Ensure the time is parsed as a Date object

        // Get the hours and minutes
        let hours = time.getHours();
        const minutes = time.getMinutes();

        // Determine AM/PM
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert 24-hour format to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // If hours is 0, set it to 12 for 12 AM

        // Format minutes to always show two digits
        const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        return formattedTime;
      })
      .join(", ")
  : "No slots selected"}

              </p>
              <p className="text-lg font-medium font-poppins text-gray-700 dark:text-gray-300 mb-4">
                <span className="font-serif font-semibold text-gray-900 dark:text-white">
                  Turf:
                </span>{" "}
                {selectedTurfName || "not selected"}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full font-montserrat p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                onClick={handleProceedToPayment}
                disabled={!selectedDate || selectedSlots.length === 0}
              >
                Proceed to Payment
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default BookingPage;
