import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTurfLocation, setVisited } from "../../slices/turfSlice";

const LocationPopup = () => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const turfs = useSelector((state) => state.turf.locations);
  const isVisited = useSelector((state) => state.turf.isVisited);

  useEffect(() => {
    if ( !isVisited) {
      setIsVisible(true);
    }
  }, [ isVisited]);

  const handleSelectLocation = (location) => {
    dispatch(setSelectedTurfLocation(location));
    dispatch(setVisited(true));
    setIsVisible(false);
  };

  const handleDeny = () => {
    dispatch(setVisited(true));
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 flex items-start justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mx-auto mt-4 transform transition-all duration-300 scale-95">
        <h2 className="text-2xl font-bold mb-4 text-center">Select Turf Location</h2>
        <div className="flex flex-wrap justify-center space-x-4">
          {turfs.map((turf) => (
            <button
              key={turf._id}
              className="cursor-pointer p-2 bg-gray-100 hover:bg-gray-200 rounded-md m-1"
              onClick={() => handleSelectLocation(turf.turfLocation)}
            >
              {turf.turfLocation}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
            onClick={handleDeny}
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPopup;
