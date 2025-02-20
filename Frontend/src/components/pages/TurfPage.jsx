import { useEffect, useState } from "react";
import "boxicons/css/boxicons.min.css";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../slices/authSlice";
import { setTurfs } from "../../slices/turfSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import whiteBg from "../../assets/Images/whiteBg.png";

const TurfPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [priceRange, setPriceRange] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [selectedSport, setSelectedSport] = useState("All");
  const [showFavorites, setShowFavorites] = useState(false);
  const [likedTurfs, setLikedTurfs] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();
  const locations = useSelector((state) => state.turf.locations);
  const token = useSelector((state) => state.auth.token);
  const turfs = useSelector((state) => state.turf.turfs);
  const dispatch = useDispatch();
  const selectedlocations =
    JSON.parse(localStorage.getItem("selectedTurf")) || null;
  const [sports, setSports] = useState([]);
  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(2000);

  const fetchSports = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/turf/getAllSports",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setSports(["All", ...response.data.sports]);
        console.log("Response of sports:", response.data.sports);
      }
    } catch (error) {
      console.error("Error fetching sports:", error);
    }
  };

  useEffect(() => {
    fetchSports();
  }, [token]);

  // Fetch turf data based on user-selected location or all turfs
  const fetchTurfByLocationsOrAll = async () => {
    try {
      dispatch(setLoader(true));
      const url = selectedlocations
        ? `http://localhost:4000/api/v1/turf/getAllTurfLocations/${selectedlocations}`
        : "http://localhost:4000/api/v1/turf/getAllTurf";

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        const fetchedTurfs = response.data.fetchAllTurf;
        dispatch(setTurfs(fetchedTurfs));

        if (fetchedTurfs.length > 0) {
          const prices = fetchedTurfs.map((turf) => turf.turfPricePerHour);
          setMinPrice(Math.min(...prices));
          setMaxPrice(Math.max(...prices));
          setPriceRange(Math.max(...prices));
        } else {
          setMinPrice(200);
          setMaxPrice(2000);
          setPriceRange(200);
        }

        console.log(fetchedTurfs);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while fetching turf data!"
      );
      console.error(error);
    } finally {
      dispatch(setLoader(false));
    }
  };

  useEffect(() => {
    fetchTurfByLocationsOrAll();
  }, [token]);

  const toggleLike = (id) => {
    setLikedTurfs((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (maxPrice) {
      setPriceRange(maxPrice);
    }
  }, [maxPrice]);

  let filteredTurfs = turfs.filter(
    (turf) =>
      turf.turfName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedLocation === "All" || turf.turfLocation === selectedLocation) &&
      (selectedSport === "All" || turf.sports[0].sports.includes(selectedSport)) &&
      turf.turfPricePerHour >= minPrice &&
      turf.turfPricePerHour <= priceRange &&
      (!showFavorites || likedTurfs.includes(turf._id))
  );

  if (sortOrder === "low-to-high") {
    filteredTurfs.sort((a, b) => a.turfPricePerHour - b.turfPricePerHour);
  } else if (sortOrder === "high-to-low") {
    filteredTurfs.sort((a, b) => b.turfPricePerHour - a.turfPricePerHour);
  }

  const navigateToTurfPage = (turfId) => {
    navigate(`turfDetails/${turfId}`);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${whiteBg})`,
      }}
      className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 pt-[80px] transition-colors duration-300"
    >
      {/* Mobile Filter Button */}
      <button
        className="md:hidden fixed top-4 right-14 z-50 bg-white text-black py-2 px-3 rounded-full shadow-lg"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <i className="bx bx-filter-alt"></i>
      </button>

      {/* Filters Section */}
      <div
        className={`w-full md:w-1/4 bg-white dark:bg-gray-800 p-4 shadow-lg md:h-screen md:sticky top-0 flex flex-col transition-all duration-300 ${
          isFilterOpen ? "fixed inset-0 z-40" : "hidden md:flex"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold dark:text-white">Filters</h2>
          <button className="md:hidden" onClick={() => setIsFilterOpen(false)}>
            <i className="bx bx-x text-2xl"></i>
          </button>
        </div>

        <label className="flex items-center gap-2 cursor-pointer mb-2 font-bold dark:text-white">
          <input
            type="checkbox"
            checked={showFavorites}
            onChange={() => setShowFavorites(!showFavorites)}
          />
          Show Favorites
        </label>

        <label className="font-bold dark:text-white">Select Location</label>
        <div className="grid grid-cols-2 gap-1 mb-2">
          {["All", ...locations.map((location) => location._id)].map(
            (location) => (
              <label
                key={location}
                className="flex items-center gap-2 cursor-pointer dark:text-gray-300"
              >
                <input
                  type="radio"
                  name="location"
                  value={location}
                  checked={selectedLocation === location}
                  onChange={() => setSelectedLocation(location)}
                  className="hidden peer"
                />
                <span
                  className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                    selectedLocation === location
                      ? "bg-green-500 border-green-600"
                      : "border-gray-400 bg-white"
                  }`}
                ></span>
                {location}
              </label>
            )
          )}
        </div>

        <label className="font-bold dark:text-white">Select Sport</label>
        <div className="grid grid-cols-2 gap-1 mb-2">
          {sports.map((sport) => (
            <label
              key={sport}
              className="flex items-center gap-2 cursor-pointer dark:text-gray-300"
            >
              <input
                type="radio"
                name="sport"
                value={sport}
                checked={selectedSport === sport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="hidden peer"
              />
              <span
                className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                  selectedSport === sport
                    ? "bg-green-500 border-green-600"
                    : "border-gray-400 bg-white"
                }`}
              ></span>
              {sport}
            </label>
          ))}
        </div>

        <label className="font-bold dark:text-white">Price Range</label>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step="20"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="cursor-pointer w-full"
        />
        <span className="block text-center font-medium dark:text-white">
          ₹{priceRange}
        </span>

        <label className="font-bold dark:text-white">Sorting</label>
        <select
          className="w-full px-4 py-2 border rounded-lg mt-1 dark:bg-gray-700 dark:text-white"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="none">Sort By</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>

      {/* Turf Listing Section */}
      <div className="w-full md:w-3/4 flex flex-col h-screen">
        <div className="bg-white dark:bg-gray-800 shadow-md p-4">
          <input
            type="text"
            placeholder="Search for a turf..."
            className="w-full px-4 py-2 border rounded-lg border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 overflow-y-auto flex-grow">
          {filteredTurfs.map((turf) => (
            <div
              key={turf._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:scale-105 hover:shadow-xl transition-all relative h-[370px]"
            >
              <img
                src={turf.turfImages[0]} // Use the first image from the array
                alt={turf.turfName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {turf.turfName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <i className="bx bx-map text-red-500"></i> {turf.turfLocation}
                </p>
                <p className="text-green-600 dark:text-green-400 font-bold mt-1">
                  ₹{turf.turfPricePerHour}/hr
                </p>
                {/* Display Sports */}
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {turf.sports && turf.sports.length > 0 ? (
                      turf.sports[0].sports.map((sport, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full"
                        >
                          {sport}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No sports available</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all"
                    onClick={() => navigateToTurfPage(turf._id)}
                  >
                    View Details
                  </button>
                  <button onClick={() => toggleLike(turf._id)}>
                    {likedTurfs.includes(turf._id) ? (
                      <i className="bx bxs-heart text-red-500 text-xl"></i>
                    ) : (
                      <i className="bx bx-heart text-gray-500 text-xl hover:text-red-500 transition"></i>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TurfPage;