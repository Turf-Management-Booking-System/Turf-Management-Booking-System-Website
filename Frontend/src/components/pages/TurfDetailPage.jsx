import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import axios from "axios";
import { AiFillStar, AiOutlineConsoleSql } from "react-icons/ai";
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaUser,
  FaStar,
  FaClipboardList,
  FaCheckCircle,
  FaTrophy,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../slices/authSlice";
import { toast } from "react-hot-toast";
import { setComment } from "../../slices/commentSlice";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/DarkModeContext";
import whiteBg from "../../assets/Images/whiteBg.png";

const TurfDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  console.log("token",token)
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const { darkmode } = useState(DarkModeContext);
  const [turf, setTurf] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [commentWithRating, setCommentWithRating] = useState([]);
  useEffect(() => {
    const fetchTurfDetails = async () => {
      try {
        dispatch(setLoader(true));
        const response = await axios.get(
          `http://localhost:4000/api/v1/turf/getTurfById/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setTurf(response.data.fetchTurfById);
          console.log("turf", response.data.fetchTurfById);
          setAverageRating(response.data.averageRating);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong while fetching turf data!"
        );
        console.error("Error:", error.response?.data?.message);
      } finally {
        dispatch(setLoader(false));
      }
    };

    if (id) {
      fetchTurfDetails();
    }
  }, [id, dispatch]);

  const handleBooking = (turfId) => {
    navigate(`/booking/${turfId}/slots`, { state: { turfName: turf.turfName } });
  };

  const handleReviewSubmit = async () => {
    try {
      dispatch(setLoader(true));
      const response = await axios.post(
        `http://localhost:4000/api/v1/comment/createCommentWithRating/${user?._id}/${id}`,
        {
          commentText: review,
          ratingValue: userRating,
        },
        {
          headers: {
            "Content-Type": "application/json",
              Authorization:`Bearer ${token}`
          },
        }
      );
      if (response.data.success) {
        toast.success("Review submitted successfully!");
        fetchTurfRatingAndReview();
        setReview("");
        setRating(0);
        setUserRating(0);
        dispatch(setComment([...turf.comments, response.data.comment]));
        setTurf((prevTurf) => ({
          ...prevTurf,
          comments: [...prevTurf.comments, response.data.comment],
        }));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while creating the comment!"
      );
      console.error("Error:", error.response?.data || error.message);

    } finally {
      dispatch(setLoader(false));
    }
  };

  const handleStarClick = (star) => {
    setRating(star);
  };

  console.log("userRating", userRating);
  const fetchTurfRatingAndReview = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/comment/getCommentWithRating/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        console.log("resposne", response.data.comment);
        setCommentWithRating(response.data.comments);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while fetching the comment and Review!"
      );
      console.log(error.response?.data?.message);

    }
  };
  useEffect(() => {
    fetchTurfRatingAndReview();
  }, [id]);

  return (
    <div style={{
            backgroundImage: `url(${whiteBg}`,
          }} className="miin-h-screen">
    <div
      className={`max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-24`}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-800">{turf?.turfName}</h1>
          <p className="text-lg mt-3 text-gray-600 dark:text-gray-300">
            {turf?.turfTitle}
          </p>
          <p className="mt-2 flex items-center">
            <FaMapMarkerAlt className="text-red-500 mr-2" />{" "}
            {turf?.turfLocation}
          </p>
          <p className="mt-2 flex items-center">
            <FaClipboardList className="text-blue-500 mr-2" />{" "}
            {turf?.turfAddress}
          </p>
          <p className="mt-2 flex items-center">
            <FaRupeeSign className="text-green-500 mr-2" />{" "}
            {turf?.turfPricePerHour} per hour
          </p>
          <p className="mt-2 flex items-center">
            <FaUser className="text-gray-500 mr-2" /> Owner: {turf?.turfOwner} (
            {turf?.turfOwnerPhoneNumber})
          </p>
          <p className="mt-2 flex items-center">Turf Size: {turf?.turfSize}</p>
          <p className="mt-2">Description: {turf?.turfDescription}</p>
          
          <p
            className={`font-semibold ${
              turf?.turfAvailability ? "text-green-600" : "text-red-600"
            }`}
          >
            {turf?.turfAvailability ? (
              <>
                ✅ Available for Booking
                <button
                  onClick={() => handleBooking(turf._id)}
                  className="ml-4 bg-green-500 hover:bg-green-700 text-white py-3 px-5 rounded-lg"
                >
                  Book Turf Now
                </button>
              </>
            ) : (
              "❌ Currently Unavailable"
            )}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000 }}
            loop
            className="rounded-lg overflow-hidden"
          >
            {turf?.turfImages?.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt="Turf"
                  className="w-full h-80 object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex gap-2 mt-2">
            {turf?.turfImages?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Thumb"
                className="w-16 h-16 object-cover cursor-pointer rounded-md"
                onClick={() =>
                  (document.querySelector(".swiper-slide-active img").src = img)
                }
              />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="">
  <h3 className="text-xl font-semibold mb-2">Sports Types</h3>
  <div className="mb-8">
    <ul className="grid grid-cols-2 mr-[50rem]">
      {turf?.sports[0]?.sports.map((sport, index) => (
        <li key={index} className="flex items-center">
          <FaCheckCircle className="text-green-500 mr-2" /> {sport}
        </li>
      ))}
    </ul>
  </div>
</div>
      <div className="mt-2 flex justify-between">
      <div>
  <h3 className="text-xl font-semibold">📜 Turf Rules</h3>
  <ul className="mt-2 space-y-2">
    {turf?.turfRules.map((rule, index) => (
      <li key={index} className="flex items-center">
        <FaCheckCircle className="text-red-500 mr-2" /> {rule}
      </li>
    ))}
  </ul>
</div>
<div className="mt-7 mr-[21rem]">
  <h3 className="text-xl font-semibold flex items-center">
    <span className="mr-2">
      <FaTrophy />
    </span>{" "}
    Amenities
  </h3>
  <ul className="mt-2 space-y-2">
    {turf?.turfAmentities.map((amenity, index) => (
      <li key={index} className="flex items-center">
        <FaCheckCircle className="text-green-500 mr-2" /> {amenity}
      </li>
    ))}
  </ul>
</div>
      </div>

      {/* Rating and Review Section */}
      <div className="mt-10">
        <h3 className="font-semibold text-xl">📝 Rate and Reviews</h3>
        <div className="flex items-center space-x-2 mt-2">
          <span>Your Rating:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setUserRating(star)}
                className={`text-2xl ${
                  star <= userRating ? "text-yellow-500" : "text-gray-400"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review here..."
            className="w-[40rem] border p-2 rounded"
          />
        </div>
        <button
          onClick={handleReviewSubmit}
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
        >
          Submit Review
        </button>
      </div>

      {/* Existing Reviews Section */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg"> Comments</h3>
        {commentWithRating.length > 0 ? (
          commentWithRating.map((comment) => (
            <div key={comment._id} className="mt-4 flex items-start space-x-4">
              <img
                src={comment?.userId?.image}
                alt="User Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">
                    {comment?.userId?.firstName} {comment?.userId?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="mt-2">{comment.commentText}</p>
                <p className="flex text-yellow-500">
                  {[...Array(comment.rating?.rating || 0)].map((_, i) => (
                    <AiFillStar key={i} />
                  ))}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">
            No comments yet. Be the first to review!
          </p>
        )}
      </div>
    </div>
  </div>
  );
};

export default TurfDetailsPage;