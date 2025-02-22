import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faTimes, faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useDispatch, useSelector } from "react-redux";
import { setTurfs } from "../../slices/turfSlice";
import { setLoader } from "../../slices/authSlice";
import toast from "react-hot-toast";
import axios from "axios";

const AdminPanel = () => {
  const { darkMode } = useContext(DarkModeContext);
  const dispatch = useDispatch();
  const turfs = useSelector((state) => state.turf.turfs);
  const token = useSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTurf, setCurrentTurf] = useState(null);
  const [formData, setFormData] = useState({
    turfName: "",
    turfDescription: "",
    turfTitle: "",
    turfOwner: "",
    turfPricePerHour: "",
    turfLocation: "",
    turfImages: [],
    turfAddress: "",
    turfAmentities: [],
    turfRules: [],
    turfSize: "",
    turfAvailability: true,
    turfOwnerPhoneNumber: "",
    sports: [],
  });

  const fetchTurfByLocationsOrAll = async () => {
    try {
      dispatch(setLoader(true));
      const url = "http://localhost:4000/api/v1/turf/getAllTurf";

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
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while fetching turf data!"
      );
      console.error(error);
    } finally {
      dispatch(setLoader(false));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTurfByLocationsOrAll();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayInputChange = (e, field) => {
    const { value } = e.target;
    setFormData({ ...formData, [field]: value.split(",") });
  };

  const addTurf = async (data) => {
    try {
      console.log("formData", data);
      dispatch(setLoader(true));
      const url = "http://localhost:4000/api/v1/turf/createTurf";

      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log("created turf", response.data);
      if (response.data.success) {
        toast.success("Turf Created Successfully!");
        await fetchTurfByLocationsOrAll();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while creating turf data!"
      );
      console.log(error.response?.data?.message);
    } finally {
      dispatch(setLoader(false));
      setIsLoading(false);
    }
  };

  const updateTurf = async (id, data) => {
    try {
      console.log("update data", data);
      dispatch(setLoader(true));
      const url = "http://localhost:4000/api/v1/turf/updateTurf";

      const response = await axios.put(
        url,{
           turfId:id,
           data,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("updated turf", response.data);
      if (response.data.success) {
        toast.success("Turf Updated Successfully!");
        await fetchTurfByLocationsOrAll();
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Error sending data to backend");
    } finally {
      dispatch(setLoader(false));
      setIsLoading(false);
    }
  };

  const getChangedFields = (formData, currentTurf) => {
    const changedFields = {};

    for (const key in formData) {
      if (key === "sports") {
        // Special handling for the sports field
        const formattedSports = formData[key].map((sport) =>
          typeof sport === "object" ? sport.sports : sport
        );
        const currentSports = currentTurf[key].map((sport) =>
          typeof sport === "object" ? sport.sports : sport
        );

        if (JSON.stringify(formattedSports) !== JSON.stringify(currentSports)) {
          changedFields[key] = formData[key];
        }
      } else if (Array.isArray(formData[key])) {
        // Handle other arrays (e.g., turfImages, turfAmentities, etc.)
        if (JSON.stringify(formData[key]) !== JSON.stringify(currentTurf[key])) {
          changedFields[key] = formData[key];
        }
      } else if (formData[key] !== currentTurf[key]) {
        // Handle non-array fields
        changedFields[key] = formData[key];
      }
    }

    return changedFields;
  };

  const handleEdit = (turf) => {
    setCurrentTurf(turf);
    const formattedSports = turf.sports.map((sport) =>
      typeof sport === "object" ? sport.sports : sport
    );

    setFormData({
      ...turf,
      sports: formattedSports,
    });

    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedFormData = {
      ...formData,
      turfImages: cleanArray(formData.turfImages),
      turfAmentities: cleanArray(formData.turfAmentities),
      turfRules: cleanArray(formData.turfRules),
      sports: cleanArray(formData.sports),
      turfPricePerHour: Number(formData.turfPricePerHour),
      turfSize: Number(formData.turfSize),
    };

    if (currentTurf) {
      const changedFields = getChangedFields(cleanedFormData, currentTurf);
      if (Object.keys(changedFields).length === 0) {
        toast.error("No changes were made!");
        return;
      }

      await updateTurf(currentTurf._id, changedFields);
    } else {

      await addTurf(cleanedFormData);
    }

    handleCloseModal();
  };

  const cleanArray = (arr) => {
    if (!Array.isArray(arr)) {
      return []; 
    }
    return arr.map((item) => {
      if (typeof item === "string") {
        return item.replace(/"/g, ""); 
      } else if (item && typeof item === "object" && item.sports) {
        return item.sports.replace(/"/g, ""); 
      }
      return item;
    });
  };

  const handleDelete = async (id) => {
    try {
      dispatch(setLoader(true));
      const url = "http://localhost:4000/api/v1/turf/deleteTurf";

      const response = await axios.delete(url, {
        data: { turfId: id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log("deleted turf", response.data);
      if (response.data.success) {
        toast.success("Deleted The Turf Successfully!!");
        dispatch(setTurfs(turfs.filter((turf) => turf._id !== id)));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while deleting turf data!"
      );
      console.log(error.response?.data?.message);
    } finally {
      dispatch(setLoader(false));
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTurf(null);
    setFormData({
      turfName: "",
      turfDescription: "",
      turfTitle: "",
      turfOwner: "",
      turfPricePerHour: "",
      turfLocation: "",
      turfImages: [],
      turfAddress: "",
      turfAmentities: [],
      turfRules: [],
      turfSize: "",
      turfAvailability: true,
      turfOwnerPhoneNumber: "",
      sports: [],
    });
  };

  return (
    <div className="min-h-screen p-8 mt-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Turf Management</h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center "
          onClick={() => setIsModalOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add New Turf
        </motion.button>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-green-500 dark:text-green-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {turfs.map((turf) => (
              <motion.div
                key={turf._id} // Use turf._id as the key
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <img src={turf.turfImages[0] || ""} alt={turf.turfName} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{turf.turfName}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">Location: {turf.turfLocation}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">Price: ₹{turf.turfPricePerHour}/hr</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Sports: {turf.sports[0]?.sports?.join(", ")}

</p>

                      
                  <div className="flex justify-end space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                      onClick={() => handleEdit(turf)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                      onClick={() => handleDelete(turf._id)} // Use turf._id for deletion
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal for adding/editing turf */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-8 w-[50vw] max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex-shrink-0">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                    {currentTurf ? "Edit Turf" : "Add New Turf"}
                  </h2>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="overflow-y-auto flex-grow ">
                  <form onSubmit={handleSubmit}>
                    {/* Turf Name */}
                    <div className="mb-4">
                      <label htmlFor="turfName" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Turf Name
                      </label>
                      <input
                        type="text"
                        id="turfName"
                        name="turfName"
                        value={formData.turfName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    {/* Turf Description */}
                    <div className="mb-4">
                      <label htmlFor="turfDescription" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Turf Description
                      </label>
                      <textarea
                        id="turfDescription"
                        name="turfDescription"
                        value={formData.turfDescription}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    {/* Turf Title */}
                    <div className="mb-4">
                      <label htmlFor="turfTitle" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Turf Title
                      </label>
                      <input
                        type="text"
                        id="turfTitle"
                        name="turfTitle"
                        value={formData.turfTitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    {/* Turf Owner */}
                    <div className="mb-4">
                      <label htmlFor="turfOwner" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Turf Owner
                      </label>
                      <input
                        type="text"
                        id="turfOwner"
                        name="turfOwner"
                        value={formData.turfOwner}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    {/* Turf Price Per Hour */}
                    <div className="mb-4">
                      <label htmlFor="turfPricePerHour" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Turf Price Per Hour (₹)
                      </label>
                      <input
                        type="number"
                        id="turfPricePerHour"
                        name="turfPricePerHour"
                        value={formData.turfPricePerHour}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        min="200"
                        max="1000"
                        required
                      />
                    </div>

                    {/* Turf Location */}
                    <div className="mb-4">
                      <label htmlFor="turfLocation" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Turf Location
                      </label>
                      <input
                        type="text"
                        id="turfLocation"
                        name="turfLocation"
                        value={formData.turfLocation}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    {/* Turf Images (Comma-separated URLs) */}
                    <div className="mb-4">
                      <label htmlFor="turfImages" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Turf Images (Comma-separated URLs)
                      </label>
                      <input
                        type="text"
                        id="turfImages"
                        name="turfImages"
                        value={formData.turfImages.join(",")}
                        onChange={(e) => handleArrayInputChange(e, "turfImages")}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    {/* Turf Address */}
                    <div className="mb-4">
                      <label htmlFor="turfAddress" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Turf Address
                      </label>
                      <textarea
                        id="turfAddress"
                        name="turfAddress"
                        value={formData.turfAddress}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    {/* Turf Amenities (Comma-separated) */}
                    <div className="mb-4">
                      <label htmlFor="turfAmentities" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Turf Amenities (Comma-separated)
                      </label>
                      <input
                        type="text"
                        id="turfAmentities"
                        name="turfAmentities"
                        value={formData.turfAmentities.join(",")}
                        onChange={(e) => handleArrayInputChange(e, "turfAmentities")}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    {/* Turf Rules (Comma-separated) */}
                    <div className="mb-4">
                      <label htmlFor="turfRules" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Turf Rules (Comma-separated)
                      </label>
                      <input
                        type="text"
                        id="turfRules"
                        name="turfRules"
                        value={formData.turfRules.join(",")}
                        onChange={(e) => handleArrayInputChange(e, "turfRules")}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    {/* Turf Size */}
                    <div className="mb-4">
                      <label htmlFor="turfSize" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Turf Size (in sq. meters)
                      </label>
                      <input
                        type="number"
                        id="turfSize"
                        name="turfSize"
                        value={formData.turfSize}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    {/* Turf Availability */}
                    <div className="mb-4">
                      <label htmlFor="turfAvailability" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Turf Availability
                      </label>
                      <select
                        id="turfAvailability"
                        name="turfAvailability"
                        value={formData.turfAvailability}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value={true}>Available</option>
                        <option value={false}>Not Available</option>
                      </select>
                    </div>

                    {/* Turf Owner Phone Number */}
                    <div className="mb-4">
                      <label htmlFor="turfOwnerPhoneNumber" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Turf Owner Phone Number
                      </label>
                      <input
                        type="tel"
                        id="turfOwnerPhoneNumber"
                        name="turfOwnerPhoneNumber"
                        value={formData.turfOwnerPhoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        pattern="[0-9]{10}"
                        required
                      />
                    </div>

                    {/* Sports */}
                    <div className="mb-6">
                      <label htmlFor="sports" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Sports
                      </label>
                      <input
                        type="text"
                        id="sports"
                        name="sports"
                        value={formData.sports.join(",")}
                        onChange={(e) => handleArrayInputChange(e, "sports")}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </form>
                </div>

                {/* Modal Footer */}
                <div className="flex-shrink-0 pt-4">
                  <div className="flex justify-end space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                      onClick={handleSubmit}
                    >
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      {currentTurf ? "Update" : "Add"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPanel;