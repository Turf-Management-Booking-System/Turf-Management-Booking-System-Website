
import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast"
import axios from "axios"
import { deleteAccountUser, setLoader, updateProfileImage } from "../../slices/authSlice"
import { deleteAccountNotification } from "../../slices/notificationSlice"
import { useNavigate } from "react-router-dom"
import { loadNotification, setNotification } from "../../slices/notificationSlice"
import { setUser } from "../../slices/authSlice"
import { DarkModeContext } from "../../context/DarkModeContext"
import whiteBg from "../../assets/Images/whiteBg.png"
import blackBg from "../../assets/Images/blackBg.png"
import greenBg from "../../assets/Images/greenBg.png"

const EditProfile = () => {
  const { darkMode } = useContext(DarkModeContext)
  const dispatch = useDispatch()
  const isForgetPassword = localStorage.getItem("isForgetPassword") || null
  const email = localStorage.getItem("email") || null
  const user = useSelector((state) => state.auth.user)
  const notifications = useSelector((state) => state.notification.notifications)
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)
  const [profileImage, setProfileImage] = useState(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  useEffect(() => {
    dispatch(loadNotification())
  }, [])

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    phone: "",
    dob: "",
    description: "",
    location: "",
    about: "",
  })

  const requestData = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    gender: profile.gender,
    phoneNumber: profile.phone,
    dateOfBirth: profile.dob,
    description: profile.description,
    location: profile.location,
    about: profile.about,
  }

  const handleChange = async (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0])
  }

  const updateProfileHandler = async (e) => {
    e.preventDefault()
    try {
      dispatch(setLoader(true))
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/updateProfile/${user?._id}`, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      })

      if (response.data.success) {
        toast.success("Profile Updated Successfully!")
        dispatch(setUser(response.data.user))
        localStorage.setItem("userData", JSON.stringify(response.data.user))
        setProfile({
          firstName: "",
          lastName: "",
          email: "",
          gender: "",
          phone: "",
          dob: "",
          description: "",
          location: "",
          about: "",
        })
        dispatch(loadNotification())
        try {
          const notificationResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/notify/getNotifications/${response.data.user._id}`,
            {
              headers: {
                "Content-Type": "application/json",
                withCredentials: true,
              },
            },
          )
          if (notificationResponse.data.success) {
            dispatch(setNotification(notificationResponse.data.currentMessage || []))
            localStorage.setItem("userNotification", JSON.stringify(notificationResponse.data.currentMessage || []))
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Something Went Wrong in fetching notifications in updating profile !")
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something Went Wrong while updating the data!")
    } finally {
      dispatch(setLoader(false))
    }
  }

  const dataToken = {
    email: user.email,
  }

  const deleteProfileHandler = async () => {
    try {
      dispatch(setLoader(true))
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/deleteProfile/${user?._id}`, {
        data: dataToken,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      })
      console.log("response Data", response.data)
      if (response.data.success) {
        dispatch(deleteAccountUser())
        dispatch(deleteAccountNotification())
        if (isForgetPassword && email) {
          localStorage.removeItem("isForgetPassword")
          localStorage.removeItem("email")
        }
        toast.success("Profile Deleted Successfully!")
        navigate("/")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something Went Wrong while deleting profile !")
      console.error("Error:", error.response?.data || error.message)
    } finally {
      dispatch(setLoader(false))
      setShowDeleteConfirmation(false)
    }
  }

  const handleImageChangeHandler = async (e) => {
    e.preventDefault()
    if (!profileImage) {
      toast.error("Please select an image!")
      return
    }
    const formData = new FormData()
    formData.append("imageUrl", profileImage)
    try {
      dispatch(setLoader(true))
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/upload-Profile-Image/${user?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            withCredentials: true,
          },
        },
      )

      if (response.data.success) {
        toast.success("Profile Image Updated Successfully!")
        dispatch(updateProfileImage(response.data.fileData.image))
        setProfile({ ...profile, image: response.data.fileData.image })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something Went Wrong in updating image !")
      console.error("Error:", error.response?.data || error.message)
    } finally {
      dispatch(setLoader(false))
    }
  }

  return (
    <div
      style={{
        backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
      }}
      className="min-h-screen py-20 px-4 bg-[#587990] sm:mt-16"
    >
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div
         style={{
          backgroundImage: `url(${darkMode ? blackBg : greenBg})`,
        }} className="p-6">
          <h2 className="text-3xl font-semibold text-green-800 dark:text-green-500 mb-2 font-orbitron">Edit Profile</h2>
          <p className="text-black dark:text-white">Update your personal information and profile settings</p>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center md:w-1/4 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <div className="relative group">
                <img
                  src={user.image || "/placeholder.svg"}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-green-200 dark:border-green-400 shadow-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <label className="cursor-pointer text-white text-sm font-medium">
                    Change Photo
                    <input type="file" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="mt-6 w-full">
                <label className="bg-green-400 bg-opacity-80 hover:bg-green-500 text-white px-4 py-3 rounded-lg cursor-pointer block text-center transition duration-300">
                  Choose File
                  <input type="file" onChange={handleImageChange} className="hidden" />
                </label>

                <button
                  onClick={handleImageChangeHandler}
                  className="mt-4 w-full px-4 py-3 bg-blue-400 bg-opacity-80 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
                >
                  Update Photo
                </button>
              </div>

              <div className="mt-6 text-center">
                <h3 className="font-semibold text-gray-800 capitalize dark:text-white text-lg">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{user.email}</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="md:w-3/4">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 dark:text-white mb-2 font-medium">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder={user.firstName || "Enter your first name"}
                    value={profile.firstName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-white mb-2 font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder={user.lastName || "Enter your last name"}
                    value={profile.lastName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 dark:text-white mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder={user.email || "Enter your email"}
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-white mb-2 font-medium">Gender</label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none focus:border-transparent dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-white mb-2 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder={user.phoneNumber || "Enter your phone number"}
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-white mb-2 font-medium">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={profile.dob}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-white mb-2 font-medium">Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder={user.location || "Enter your location"}
                    value={profile.location}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 dark:text-white mb-2 font-medium">Short Description</label>
                  <textarea
                    name="description"
                    placeholder={user.description || "Write a short description about yourself"}
                    value={profile.description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none focus:border-transparent dark:bg-gray-800 dark:text-white"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 dark:text-white mb-2 font-medium">About You</label>
                  <textarea
                    name="about"
                    placeholder={user.about || "Tell us more about yourself"}
                    value={profile.about}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none focus:border-transparent dark:bg-gray-800 dark:text-white"
                  ></textarea>
                </div>
              </form>

              {/* Save Button */}
              <div className="flex justify-end mt-10">
                <button
                  onClick={updateProfileHandler}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>

              <div className="mt-8 border-2 border-red-500 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Once you delete your account, there is no going back. Please be certain. All your data, bookings, and
                  personal information will be permanently removed.
                </p>
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Confirm Account Deletion</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be
              permanently lost.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={deleteProfileHandler}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditProfile

