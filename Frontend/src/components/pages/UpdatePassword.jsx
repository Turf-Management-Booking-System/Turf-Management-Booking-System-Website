import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoader } from "../../slices/authSlice";
import axios from "axios";
import {toast} from "react-hot-toast"
import { useNavigate } from "react-router-dom";
import lockBg from "../../assets/Images/lockBg.jpg"
import FloatingButton from "./FloatingButton";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  let requestData;
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setSuccessMessage("Passwords do not match!");
  
      setTimeout(() => {
        setSuccessMessage("");
        setNewPassword("");
        setConfirmPassword("");
      }, 2000);
  
      return;
    }
    requestData ={
      newPassword:newPassword,
      confirmPassword:confirmPassword,
      email:email,
    }
    await resetPasswordUpdate();
    setSuccessMessage("Password updated successfully!");
  
    // Clear input fields after success
    setTimeout(() => {
      setSuccessMessage("");
      setNewPassword("");
      setConfirmPassword("");
    }, 2000);
  };
  const resetPasswordUpdate =async ()=>{
    try{
      dispatch(setLoader(true));
      const response = await axios.post( `${VITE_API_BASE_URL}/api/v1/auth/resetPassword`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("response updated passowrd",response.data);
      if(response.data?.success){
        dispatch(setLoader(false));
        localStorage.removeItem("isForgetPassword");
        localStorage.removeItem("email");
        navigate("/login")
      }else{
        toast.error("Can't Updated the password!")
      }
    }catch(error){
       console.log("Error",error.response?.data || error.message);
       toast.error(error.response?.data?.message||"Error sending Data to backend")
    }finally{
      dispatch(setLoader(false));
    }
  }

  return (
    <div  style={{ backgroundImage: `url(${lockBg})`}} className="flex justify-center items-center min-h-screen bg-cover bg-center">
       <div className="absolute inset-0 dark:bg-black bg-green-100 dark:opacity-65 opacity-85"></div> 
      <div className="bg-white dark:bg-black rounded-xl w-full max-w-md p-8 mx-4 relative z-10 shadow-2xl">
        <FloatingButton/>
        <h2 className="text-2xl font-bold text-green-600 text-center mb-4">
          Update Password
        </h2>
        <p className="text-gray-600 dark:text-white text-center mb-6">
          Enter your new password below.
        </p>

        {successMessage && (
          <p className={`text-center font-semibold p-2 rounded-md mb-4 ${
            successMessage.includes("successfully") ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
          }`}>
            {successMessage}
          </p>
        )}

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          {/* New Password Input */}
          <div>
            <label htmlFor="new-password" className="text-sm font-medium dark:text-white text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full border border-gray-400 rounded-lg p-3 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 dark:text-white">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full border border-gray-400 rounded-lg p-3 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="bg-green-500 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200">
            Update Password
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-300 text-center mt-6">
          Go back to{" "}
          <Link to="/login" className="text-green-600 underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default UpdatePassword;
