"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/autoplay"
import { Autoplay } from "swiper/modules"
import axios from "axios"
import { AiFillStar } from "react-icons/ai"
import { FaMapMarkerAlt, FaRupeeSign, FaUser, FaStar, FaClipboardList, FaCheckCircle, FaTrophy } from "react-icons/fa"
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
  const user = useSelector((state) => state.auth.user)
  const { id } = useParams()
  const { darkMode } = React.useContext(DarkModeContext)
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
        const response = await axios.get(`http://localhost:4000/api/v1/turf/getTurfById/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: ` Bearer ${token}`,
          },
          withCredentials: true,
        })

        if (response.data.success) {
          setTurf(response.data.fetchTurfById)
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
  }, [id, dispatch, token])

  const handleBooking = (turfId) => {
    navigate(`/booking/${turfId}/slots`, { state: { turfName: turf.turfName } })
  }

  const handleReviewSubmit = async () => {
    try {
      dispatch(setLoader(true))
      const response = await axios.post(
        `http://localhost:4000/api/v1/comment/createCommentWithRating/${user?._id}/${id}`,
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
      console.log(error.response?.data?.message)
    } finally {
      dispatch(setLoader(false))
    }
  }

  const fetchTurfRatingAndReview = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/comment/getCommentWithRating/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: ` Bearer ${token}`,
        },
      })
      if (response.data.success) {
        setCommentWithRating(response.data.comments)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong while fetching the comment and Review!")
      console.log(error.response?.data?.message)
    }
  }, [id, token])

  useEffect(() => {
    fetchTurfRatingAndReview()
  }, [fetchTurfRatingAndReview])

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : whiteBg}`}>
      <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <div className="max-w-6xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6 p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">{turf?.turfName}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">{turf?.turfTitle}</p>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaMapMarkerAlt className="text-red-500 mr-2" /> {turf?.turfLocation}
                  </p>
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaClipboardList className="text-blue-500 mr-2" /> {turf?.turfAddress}
                  </p>
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaRupeeSign className="text-green-500 mr-2" /> {turf?.turfPricePerHour} per hour
                  </p>
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaUser className="text-gray-500 mr-2" /> Owner: {turf?.turfOwner} ({turf?.turfOwnerPhoneNumber})
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">Turf Size: {turf?.turfSize}</p>
                  <p className="text-gray-600 dark:text-gray-300">Description: {turf?.turfDescription}</p>
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaStar className="text-yellow-400 mr-2" /> Average Rating: {averageRating}
                  </p>
                </div>
                <div
                  className={`font-semibold ${turf?.turfAvailability ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {turf?.turfAvailability ? (
                    <>
                      ✅ Available for Booking
                      <button
                        onClick={() => handleBooking(turf._id)}
                        className="ml-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300"
                      >
                        Book Turf Now
                      </button>
                    </>
                  ) : (
                    "❌ Currently Unavailable"
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Swiper modules={[Autoplay]} autoplay={{ delay: 3000 }} loop className="rounded-lg overflow-hidden">
                  {turf?.turfImages?.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Turf ${index + 1}`}
                        className="w-full h-64 sm:h-80 object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                  {turf?.turfImages?.map((img, index) => (
                    <img
                      key={index}
                      src={img || "/placeholder.svg"}
                      alt={`Thumb ${index + 1}`}
                      className="w-16 h-16 object-cover cursor-pointer rounded-md flex-shrink-0"
                      onClick={() => (document.querySelector(".swiper-slide-active img").src = img)}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Sports Types</h3>
                <ul className="grid grid-cols-2 mr-52">
                  {turf?.sports[0]?.sports.map((sport, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                      <FaCheckCircle className="text-green-500 mr-2" /> {sport}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  <FaTrophy className="inline-block mr-2 text-yellow-400" /> Amenities
                </h3>
                <ul className="space-y-2">
                  {turf?.turfAmentities.map((amenity, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                      <FaCheckCircle className="text-green-500 mr-2" /> {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">📜 Turf Rules</h3>
              <ul className="space-y-2">
                {turf?.turfRules.map((rule, index) => (
                  <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaCheckCircle className="text-red-500 mr-2" /> {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">📝 Rate and Review</h3>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-gray-600 dark:text-gray-300">Your Rating:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      className={`text-2xl ${star <= userRating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review here..."
                className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                rows="4"
              />
              <button
                onClick={handleReviewSubmit}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-300"
              >
                Submit Review
              </button>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white">Comments</h3>
              <p className="mb-4">See What users says about this turf...</p>
              {commentWithRating.length > 0 ? (
                <div className="space-y-6">
                  {commentWithRating.map((comment) => (
                    <motion.div
                      key={comment._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-start space-x-4 bg-green-50 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <img
                        src={comment?.userId?.image || "/placeholder.svg"}
                        alt={`${comment?.userId?.firstName} ${comment?.userId?.lastName}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-semibold text-gray-800 dark:text-white">
                          {comment?.userId?.firstName?.charAt(0).toUpperCase() + comment?.userId?.firstName?.slice(1)} 
                          {comment?.userId?.lastName ? " " + comment?.userId?.lastName?.charAt(0).toUpperCase() + comment?.userId?.lastName?.slice(1) : ""}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">{comment.commentText}</p>
                        <div className="flex text-yellow-400">
                          {[...Array(comment.rating?.rating || 0)].map((_, i) => (
                            <AiFillStar key={i} />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No comments yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TurfDetailsPage

