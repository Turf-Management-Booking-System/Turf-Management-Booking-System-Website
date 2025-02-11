import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoader } from "../../slices/authSlice";
import axios from "axios";
import {toast} from "react-hot-toast"
import { useNavigate } from "react-router-dom";
const UpdatePassword = () => {
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  let requestData;
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload
    
    if (newPassword !== confirmPassword) {
      setSuccessMessage("Passwords do not match!");
  
      // Clear input fields after showing the error
      setTimeout(() => {
        setSuccessMessage("");
        setNewPassword("");
        setConfirmPassword("");
      }, 2000);
  
      return; // Stop further execution
    }
    requestData ={
      newPassword:newPassword,
      confirmPassword:confirmPassword,
      email:email,
    }
    await resetPasswordUpdate();
    setSuccessMessage("Password updated successfully!"); // Show success message
  
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
      const response = await axios.post("http://localhost:4000/api/v1/auth/resetPassword",
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
    <div className="flex justify-center items-center min-h-screen bg-deepForestGreen">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8 mx-4">
        <h2 className="text-2xl font-bold text-green-600 text-center mb-4">
          Update Password
        </h2>
        <p className="text-gray-600 text-center mb-6">
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
            <label htmlFor="new-password" className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full border border-gray-300 rounded-lg p-3 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full border border-gray-300 rounded-lg p-3 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-200">
            Update Password
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Go back to{" "}
          <Link to="/login" className="text-green-600 underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default UpdatePassword;
