import { useState } from "react";
import "boxicons/css/boxicons.min.css";

const TurfPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [priceRange, setPriceRange] = useState(2000);
  const [sortOrder, setSortOrder] = useState("none");
  const [selectedSport, setSelectedSport] = useState("All");
  const [showFavorites, setShowFavorites] = useState(false);
  const [likedTurfs, setLikedTurfs] = useState([]);

  const turfs = [
    { id: 1, name: "Green Turf Arena", location: "Kurla", price: 1200, sport: "Football", image: "https://source.unsplash.com/400x300/?football,turf" },
    { id: 2, name: "Champion Sports Ground", location: "Andheri", price: 1500, sport: "Cricket", image: "https://source.unsplash.com/400x300/?sports,field" },
    { id: 3, name: "Urban Playzone", location: "Bandra", price: 1000, sport: "Football", image: "https://source.unsplash.com/400x300/?stadium,football" },
    { id: 4, name: "Elite Football Hub", location: "Dadar", price: 1400, sport: "Cricket", image: "https://source.unsplash.com/400x300/?football,grass" }
  ];

  const toggleLike = (id) => {
    setLikedTurfs((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  let filteredTurfs = turfs.filter((turf) =>
    turf.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedLocation === "All" || turf.location.includes(selectedLocation)) &&
    (selectedSport === "All" || turf.sport === selectedSport) &&
    turf.price <= priceRange &&
    (!showFavorites || likedTurfs.includes(turf.id))
  );

  if (sortOrder === "low-to-high") {
    filteredTurfs.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high-to-low") {
    filteredTurfs.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen flex bg-gray-100 pt-[80px]">
      <div className="w-1/4 bg-white p-4 shadow-lg h-screen sticky top-0">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <select className="w-full px-4 py-2 border rounded-lg mb-4" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
          <option value="All">All Locations</option>
          <option value="Kurla">Kurla</option>
          <option value="Andheri">Andheri</option>
          <option value="Bandra">Bandra</option>
          <option value="Dadar">Dadar</option>
        </select>
        <select className="w-full px-4 py-2 border rounded-lg mb-4" value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
          <option value="All">All Sports</option>
          <option value="Football">Football</option>
          <option value="Cricket">Cricket</option>
        </select>
        <input type="range" min="500" max="2000" step="100" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="cursor-pointer w-full" />
        <span className="block text-center font-medium">₹{priceRange}</span>
        <select className="w-full px-4 py-2 border rounded-lg mt-4" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="none">Sort By</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
        <label className="flex items-center gap-2 cursor-pointer mt-4">
          <input type="checkbox" checked={showFavorites} onChange={() => setShowFavorites(!showFavorites)} />
          Show Favorites
        </label>
      </div>

  
      <div className="w-3/4 flex flex-col h-screen ">
        <div className="bg-white shadow-md p-4 mb-4">
          <input type="text" placeholder="Search for a turf..." className="w-full px-4 py-2 border rounded-lg border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 overflow-y-auto flex-grow">
          {filteredTurfs.map((turf) => (
            <div key={turf.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 hover:shadow-xl transition-all relative h-[25vw]">
              <img src={turf.image} alt="" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{turf.name}</h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <i className="bx bx-map text-red-500"></i> {turf.location}
                </p>
                <p className="text-green-600 font-bold mt-2">₹{turf.price}/hr</p>
                <div className="flex justify-between items-center mt-4">
                  <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all">View Details</button>
                  <button onClick={() => toggleLike(turf.id)}>
                    {likedTurfs.includes(turf.id) ? (
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
