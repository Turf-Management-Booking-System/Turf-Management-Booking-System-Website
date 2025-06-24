import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/autoplay"
import { Autoplay } from "swiper/modules"
import axios from "axios"
import { AiFillStar } from "react-icons/ai"
import { FaMapMarkerAlt, FaRupeeSign, FaUser, FaClipboardList, FaCheckCircle, FaTrophy } from "react-icons/fa"
import { motion } from "framer-motion"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setLoader } from "../../slices/authSlice"
import { toast } from "react-hot-toast"
import { setComment } from "../../slices/commentSlice"
import { useNavigate } from "react-router-dom"
import { DarkModeContext } from "../../context/DarkModeContext"
import whiteBg from "../../assets/Images/whiteBg.png"

const TurfDetailsPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  console.log("token", token)
  const user = useSelector((state) => state.auth.user)
  const { id } = useParams()
  const { darkmode } = useState(DarkModeContext)
  const [turf, setTurf] = useState(null)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [userRating, setUserRating] = useState(0)
  const [averageRating, setAverageRating] = useState(0)
  const [commentWithRating, setCommentWithRating] = useState([])

  useEffect(() => {
    const fetchTurfDetails = async () => {
      try {
        dispatch(setLoader(true))
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/turf/getTurfById/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })

        if (response.data.success) {
          setTurf(response.data.fetchTurfById)
          console.log("turf", response.data.fetchTurfById)
          setAverageRating(response.data.averageRating)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong while fetching turf data!")
        console.error("Error:", error.response?.data?.message)
      } finally {
        dispatch(setLoader(false))
      }
    }

    if (id) {
      fetchTurfDetails()
    }
  }, [id, dispatch])

  const handleBooking = (turfId) => {
    navigate(`/booking/${turfId}/slots`, {
      state: { turfName: turf.turfName, turfLocation: turf.turfLocation },
    })
  }

  const handleReviewSubmit = async () => {
    try {
      dispatch(setLoader(true))
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/comment/createCommentWithRating/${user?._id}/${id}`,
        {
          commentText: review,
          ratingValue: userRating,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (response.data.success) {
        toast.success("Review submitted successfully!")
        fetchTurfRatingAndReview()
        setReview("")
        setRating(0)
        setUserRating(0)
        dispatch(setComment([...turf.comments, response.data.comment]))
        setTurf((prevTurf) => ({
          ...prevTurf,
          comments: [...prevTurf.comments, response.data.comment],
        }))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong while creating the comment!")
      console.error("Error:", error.response?.data || error.message)
    } finally {
      dispatch(setLoader(false))
    }
  }

  const handleStarClick = (star) => {
    setRating(star)
  }

  console.log("userRating", userRating)
  const fetchTurfRatingAndReview = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/comment/getCommentWithRating/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      if (response.data.success) {
        console.log("resposne", response.data.comment)
        setCommentWithRating(response.data.comments)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong while fetching the comment and Review!")
      console.log(error.response?.data?.message)
    }
  }

  useEffect(() => {
    fetchTurfRatingAndReview()
  }, [id])

  return (
    <div
      style={{
        backgroundImage: `url(${whiteBg})`,
      }}
      className="min-h-screen"
    >
      <div className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6 bg-white shadow-lg rounded-lg mt-20 sm:mt-20 md:mt-24 overflow-hidden">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Turf Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">{turf?.turfName}</h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">{turf?.turfTitle}</p>

            {/* Info Items */}
            <div className="space-y-3">
              <p className="flex items-center text-sm sm:text-base">
                <FaMapMarkerAlt className="text-red-500 mr-2 flex-shrink-0" />
                <span className="break-words">{turf?.turfLocation}</span>
              </p>
              <p className="flex items-center text-sm sm:text-base">
                <FaClipboardList className="text-blue-500 mr-2 flex-shrink-0" />
                <span className="break-words">{turf?.turfAddress}</span>
              </p>
              <p className="flex items-center text-sm sm:text-base">
                <FaRupeeSign className="text-green-500 mr-2 flex-shrink-0" />
                <span>₹{turf?.turfPricePerHour} per hour</span>
              </p>
              <p className="flex items-center text-sm sm:text-base">
                <FaUser className="text-gray-500 mr-2 flex-shrink-0" />
                <span className="break-words">
                  Owner: {turf?.turfOwner} ({turf?.turfOwnerPhoneNumber})
                </span>
              </p>
              <p className="text-sm sm:text-base">
                <span className="font-medium">Turf Size:</span> {turf?.turfSize}
              </p>
              <p className="text-sm sm:text-base">
                <span className="font-medium">Description:</span> {turf?.turfDescription}
              </p>
            </div>

            {/* Booking Status */}
            <div className="pt-4">
              <p
                className={`font-semibold text-sm sm:text-base ${
                  turf?.turfAvailability ? "text-green-600" : "text-red-600"
                }`}
              >
                {turf?.turfAvailability ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span>✅ Available for Booking</span>
                    <button
                      onClick={() => handleBooking(turf._id)}
                      className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 sm:py-3 sm:px-5 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                    >
                      Book Turf Now
                    </button>
                  </div>
                ) : (
                  "❌ Currently Unavailable"
                )}
              </p>
            </div>
          </motion.div>

          {/* Right Column - Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {/* Main Image Carousel */}
            <div className="w-full max-w-full overflow-hidden">
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 3000 }}
                loop
                className="w-full rounded-lg overflow-hidden"
                style={{ width: "100%", height: "auto" }}
              >
                {turf?.turfImages?.map((img, index) => (
                  <SwiperSlide key={index} className="w-full">
                    <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-lg">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Turf image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Thumbnail Images */}
            <div className="w-full mt-3 overflow-hidden">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {turf?.turfImages?.map((img, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 cursor-pointer rounded-md overflow-hidden hover:opacity-75 transition-opacity"
                    onClick={() => {
                      const activeSlide = document.querySelector(".swiper-slide-active img")
                      if (activeSlide) activeSlide.src = img
                    }}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sports Types Section */}
        <div className="mt-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Sports Types</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {turf?.sports[0]?.sports.map((sport, index) => (
              <div key={index} className="flex items-center text-sm sm:text-base">
                <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>{sport}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rules and Amenities Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Turf Rules */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">📜 Turf Rules</h3>
            <ul className="space-y-2">
              {turf?.turfRules.map((rule, index) => (
                <li key={index} className="flex items-start text-sm sm:text-base">
                  <FaCheckCircle className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
              <FaTrophy className="mr-2" />
              Amenities
            </h3>
            <ul className="space-y-2">
              {turf?.turfAmentities.map((amenity, index) => (
                <li key={index} className="flex items-start text-sm sm:text-base">
                  <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Rating and Review Section */}
        <div className="mt-10">
          <h3 className="font-semibold text-lg sm:text-xl mb-4">📝 Rate and Reviews</h3>

          {/* Rating Stars */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className="text-sm sm:text-base">Your Rating:</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  className={`text-xl sm:text-2xl ${
                    star <= userRating ? "text-yellow-500" : "text-gray-400"
                  } hover:text-yellow-500 transition-colors`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Review Textarea */}
          <div className="mt-4">
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review here..."
              className="w-full max-w-2xl border border-gray-300 p-3 rounded-lg resize-vertical min-h-[100px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleReviewSubmit}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            Submit Review
          </button>
        </div>

        {/* Existing Reviews Section */}
        <div className="mt-8">
          <h3 className="font-semibold text-lg sm:text-xl mb-4">💬 Comments</h3>
          {commentWithRating.length > 0 ? (
            <div className="space-y-6">
              {commentWithRating.map((comment) => (
                <div key={comment._id} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={comment?.userId?.image || "/placeholder.svg"}
                    alt="User Avatar"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <p className="font-semibold text-sm sm:text-base">
                        {comment?.userId?.firstName} {comment?.userId?.lastName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="mt-2 text-sm sm:text-base break-words">{comment.commentText}</p>
                    <div className="flex text-yellow-500 mt-2">
                      {[...Array(comment.rating?.rating || 0)].map((_, i) => (
                        <AiFillStar key={i} className="text-sm sm:text-base" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm sm:text-base">No comments yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TurfDetailsPage
