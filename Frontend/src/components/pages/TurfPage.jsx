import { useState, useEffect, useContext } from "react"
import "boxicons/css/boxicons.min.css"
import { DarkModeContext } from "../../context/DarkModeContext";

const TurfPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [priceRange, setPriceRange] = useState(2000)
  const [sortOrder, setSortOrder] = useState("none")
  const [selectedSport, setSelectedSport] = useState("All")
  const [showFavorites, setShowFavorites] = useState(false)
  const [likedTurfs, setLikedTurfs] = useState([])
  const [selectedRating, setSelectedRating] = useState("")
  const {darkmode} = useContext(DarkModeContext);
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const turfs = [
    {
      id: 1,
      name: "Green Turf Arena",
      location: "Kurla",
      price: 1200,
      sport: "Football",
      image: "https://source.unsplash.com/400x300/?football,turf",
    },
    {
      id: 2,
      name: "Champion Sports Ground",
      location: "Andheri",
      price: 1500,
      sport: "Cricket",
      image: "https://source.unsplash.com/400x300/?sports,field",
    },
    {
      id: 3,
      name: "Urban Playzone",
      location: "Bandra",
      price: 1000,
      sport: "Football",
      image: "https://source.unsplash.com/400x300/?stadium,football",
    },
    {
      id: 4,
      name: "Elite Football Hub",
      location: "Dadar",
      price: 1400,
      sport: "Cricket",
      image: "https://source.unsplash.com/400x300/?football,grass",
    },
  ]

  const toggleLike = (id) => {
    setLikedTurfs((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  const filteredTurfs = turfs.filter(
    (turf) =>
      turf.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedLocation === "All" || selectedLocation === turf.location) &&
      (selectedSport === "All" || selectedSport === turf.sport) &&
      turf.price <= priceRange &&
      (!showFavorites || likedTurfs.includes(turf.id)),
  )

  if (sortOrder === "low-to-high") {
    filteredTurfs.sort((a, b) => a.price - b.price)
  } else if (sortOrder === "high-to-low") {
    filteredTurfs.sort((a, b) => b.price - a.price)
  }

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 pt-[80px] transition-colors duration-300`}
    >
      <button
        className="md:hidden fixed top-4 right-14 z-50 bg-white text-black py-2 px-3 rounded-full shadow-lg"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <i className="bx bx-filter-alt"></i>
      </button>

      <div
        className={`w-full md:w-1/4 bg-white dark:bg-gray-800 p-4 shadow-lg md:h-screen md:sticky top-0 flex flex-col transition-all duration-300 ${isFilterOpen ? "fixed inset-0 z-40" : "hidden md:flex"}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">Filters</h2>
        </div>

        <label className="flex items-center gap-2 cursor-pointer mb-4 font-bold dark:text-white">
          <input type="checkbox" checked={showFavorites} onChange={() => setShowFavorites(!showFavorites)} />
          Show Favorites
        </label>

        <label className="font-bold dark:text-white">Select Location</label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {["All", "Kurla", "Andheri", "Bandra", "Dadar", "Ghatkopar", "Thane", "Vashi", "Borivali"].map((location) => (
            <label key={location} className="flex items-center gap-2 cursor-pointer dark:text-gray-300">
              <input
                type="radio"
                name="location"
                value={location}
                checked={selectedLocation === location}
                onChange={(e) => setSelectedLocation(e.target.value)}
              />
              {location}
            </label>
          ))}
        </div>

        <label className="font-bold dark:text-white">Select Sport</label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {["All", "Football", "Cricket", "Basketball", "Badminton"].map((sport) => (
            <label key={sport} className="flex items-center gap-2 cursor-pointer dark:text-gray-300">
              <input
                type="radio"
                name="sport"
                value={sport}
                checked={selectedSport === sport}
                onChange={(e) => setSelectedSport(e.target.value)}
              />
              {sport}
            </label>
          ))}
        </div>

        <label className="font-bold dark:text-white">Select Rating</label>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="flex items-center gap-2 cursor-pointer dark:text-gray-300">
              <input
                type="radio"
                name="rating"
                value={star}
                checked={selectedRating == star}
                onChange={(e) => setSelectedRating(e.target.value)}
              />
              {star} ⭐
            </label>
          ))}
        </div>

        <label className="font-bold dark:text-white">Price Range</label>
        <input
          type="range"
          min="500"
          max="2000"
          step="100"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="cursor-pointer w-full"
        />
        <span className="block text-center font-medium dark:text-white">₹{priceRange}</span>

        <label className="font-bold dark:text-white">Sorting</label>
        <select
          className="w-full px-4 py-2 border rounded-lg mt-2 dark:bg-gray-700 dark:text-white"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="none">Sort By</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>

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
              key={turf.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:scale-105 hover:shadow-xl transition-all relative flex flex-col h-[370px]"
            >
              <img src={turf.image || "/placeholder.svg"} alt="" className="w-full h-[220px] object-cover" />
              <div className="p-4 flex-grow">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{turf.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <i className="bx bx-map text-red-500"></i> {turf.location}
                </p>
                <p className="text-green-600 dark:text-green-400 font-bold mt-2">₹{turf.price}/hr</p>
              </div>
              <div className="p-4 flex items-center justify-between">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  View Details
                </button>
                <i
                  className={`bx ${likedTurfs.includes(turf.id) ? "bxs-heart text-red-500" : "bx-heart text-gray-500 dark:text-gray-400"} text-2xl cursor-pointer`}
                  onClick={() => toggleLike(turf.id)}
                ></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TurfPage

