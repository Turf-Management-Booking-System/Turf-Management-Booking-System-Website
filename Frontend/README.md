import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../slices/authSlice";
import { toast } from "react-hot-toast";
import { deleteComment, setComment,updateComment } from "../../slices/commentSlice";
import { useNavigate } from "react-router-dom";

const TurfDetailsPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state)=>state.auth.user)
  const { id } = useParams();
  const [turf, setTurf] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [rating, setRating] = useState(0);
  const [review,setReview]= useState("");
  // api call to fetch data of a particular turf
  useEffect(() => {
    const fetchTurfDetails = async () => {
      try {
        dispatch(setLoader(true));
        const response = await axios.get(
          `http://localhost:4000/api/v1/turf/getTurfById/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setTurf(response.data.fetchTurfById);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Something went wrong while fetching turf data!"
        );
        console.error("Error:", error.response?.data?.message);
      } finally {
        dispatch(setLoader(false));
      }
    };

    if (id) {
      fetchTurfDetails();
    }
  }, [id, dispatch, token]);

  // Function to handle next and previous images
  const nextImage = () => {
    if (turf.turfImages && turf.turfImages.length > 0) {
      setCurrentImage((prev) => (prev + 1) % turf.turfImages.length);
    }
  };

  const prevImage = () => {
    if (turf.turfImages && turf.turfImages.length > 0) {
      setCurrentImage((prev) => (prev - 1 + turf.turfImages.length) % turf.turfImages.length);
    }
  };

  const handleBooking = (turfId) => {
    navigate(`/booking/${turfId}/slots`)
  };
  // handler for cretaing a comment
  const handleReviewSubmit = async () => {
    try {
      dispatch(setLoader(true))
      const response =
       await axios.post(
        `http://localhost:4000/api/v1/comment/createComment/${id}/${user?._id}`,
        {
          commentText:review
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Review submitted successfully!");
        setReview("");
        setRating(0);
        dispatch(setComment([...turf.comments,response.data.populatedComment]));
        console.log("value of rating",rating);
        setTurf((prevTurf) => ({
          ...prevTurf,
          comments: [...prevTurf.comments, response.data.populatedComment],
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong while creating the comment !");
      console.log(error.response?.data?.message);
    }finally{
      dispatch(setLoader(false))
    }
  };

  // Star selection function
  const handleStarClick = (star) => {
    setRating(star);
  };

  // handler for updating the commnet
   const handleUpdateComment =async (commentIds)=>{
    try {
      dispatch(setLoader(true))
      const response =await axios.post(
        `http://localhost:4000/api/v1/comment/updateComment/${id}/${user?._id}`,
        { 
          commentId:commentIds,
          commentText:review
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Review Updated successfully!");
        dispatch(updateComment({ commentId: commentIds, updatedComment: response.data.updatedComment }))
        console.log("value of rating",rating);
        setTurf((prevTurf) => ({
          ...prevTurf,
          comments: prevTurf.comments.map((comment) =>
            comment._id === commentIds
              ? { ...comment, commentText:response.data.updatedComment.commentText }
              : comment
          ),
        }));
        setReview("");
        setRating(0);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong while updating the comment !");
      console.log(error.response?.data?.message);
    }finally{
      dispatch(setLoader(false))
    }
   }
  //  handler for deleting the comment
   const handleDeleteComment =async(commentId)=>{
    try {
      dispatch(setLoader(true))
      const response =await axios.delete(
        `http://localhost:4000/api/v1/comment/deleteComment/${id}/${user?._id}/${commentId}`,
      
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Review Deleted successfully!");
        dispatch(deleteComment({commentId}))
        console.log("value of rating",rating);
        setTurf((prevTurf) => ({
          ...prevTurf,
          comments: prevTurf.comments.filter(comment => comment._id !== commentId),
        
        }));
        setReview("");
        setRating(0);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong while deleting the comment !");
      console.log(error.response?.data?.message);
    }finally{
      dispatch(setLoader(false))
    }
   }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-gray-800">{turf?.turfName}</h1>
      <p className="text-lg text-gray-600">{turf?.turfTitle}</p>

      {turf?.turfImages && turf.turfImages.length > 0 && (
        <div className="relative mt-4">
          <img
            src={turf.turfImages[currentImage]}
            alt="Turf"
            className="w-full h-60 object-cover rounded-lg"
          />
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          >
            ❮
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          >
            ❯
          </button>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <p><span className="font-semibold">📍 Location:</span> {turf?.turfLocation}</p>
        <p><span className="font-semibold">📌 Address:</span> {turf?.turfAddress}</p>
        <p><span className="font-semibold">💰 Price Per Hour:</span> ₹{turf?.turfPricePerHour}</p>
        <p><span className="font-semibold">👤 Owner:</span> {turf?.turfOwner} ({turf?.turfOwnerPhoneNumber})</p>
        <p><span className="font-semibold">📖 Description:</span> {turf?.turfDescription}</p>

        <p className={`font-semibold ${turf?.turfAvailability ? "text-green-600" : "text-red-600"}`}>
          {turf?.turfAvailability ? (
            <>
              ✅ Available for Booking
              <button
                onClick={()=>handleBooking(turf._id)}
                className="ml-4 bg-blue-500 text-white py-2 px-4 rounded"
              >
                Book Turf Now
              </button>
            </>
          ) : (
            "❌ Currently Unavailable"
          )}
        </p>
      </div>

      {/* Rating and Review Section */}
      <div className="mt-8">
        <h3 className="font-semibold text-lg">📝 Rate and Review</h3>
        <div className="flex items-center space-x-2 mt-4">
          <span>Rating:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className={`text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
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
            className="w-full border p-2 rounded"
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
  <h3 className="font-semibold text-lg">⭐ Comments</h3>
  {turf?.comments?.length > 0 ? (
    turf.comments.map((comment) => (
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
          <div className="mt-2 flex space-x-4 text-blue-500">
            <button
              onClick={() => handleUpdateComment(comment._id)} 
              className="text-sm"
            >
              Update
            </button>
            <button
              onClick={() => handleDeleteComment(comment._id)}
              className="text-sm text-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-600">No comments yet. Be the first to review!</p>
  )}
</div>
  </div>
  );
};

export default TurfDetailsPage;