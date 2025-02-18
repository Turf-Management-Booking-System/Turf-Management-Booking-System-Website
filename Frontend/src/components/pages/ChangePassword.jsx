import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../slices/authSlice";
import toast from "react-hot-toast";
import axios from "axios";
import lockBg from "../../assets/Images/lockBg.jpg"
import FloatingButton from "./FloatingButton";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const token = localStorage.getItem("token");
  const user = useSelector((state)=>state.auth.user)
  console.log("token",token);
  const dispatch = useDispatch();
  // Handle password visibility toggle for each input
  const togglePasswordVisibility = (field) => {
    if (field === "current") {
      setCurrentPasswordVisible(!currentPasswordVisible);
    } else if (field === "new") {
      setNewPasswordVisible(!newPasswordVisible);
    } else if (field === "confirm") {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };
   const requestData={
    oldPassword:currentPassword,
    newPassword:newPassword,
    confirmNewPassword:confirmPassword,
    token:token,
    email:user.email
   }
  const handleSubmit =async (e) => {
    e.preventDefault();
    try{
      dispatch(setLoader(true));
      const response = await axios.post("http://localhost:4000/api/v1/auth/changePassword",
        requestData
      ,{
        headers:{
         "Content-Type":"application/json",withCredentials:true,
        }
      });
      console.log("response from change password",response.data);
      if(response.data.success){
        dispatch(setLoader(false));
        toast.success("Password Updated Successfully!")
      }
    }catch(error){
      toast.error(error.response?.data?.message || "Something Went Wrong!");
      console.error("Error:", error.response?.data || error.message);

    }finally{
      dispatch(setLoader(false))
    }
    setConfirmPassword("");
    setCurrentPassword("");
    setNewPassword("")
  };

  return (
    <div style={{
              backgroundImage: `url(${lockBg})`}} className="flex justify-center items-center min-h-screen cc">
              <div className="absolute inset-0 dark:bg-black bg-green-100 dark:opacity-65 opacity-85"></div> 
      <div className="bg-[#3cb48a] dark:bg-gray-600 dark:border-white border-black border-2 shadow-lg rounded-xl w-full sm:w-[76%] md:w-[56%] lg:w-[37%] p-8 mx-4 relative z-10">
        <FloatingButton/>
        <h2 className="text-3xl font-bold text-white text-center mb-4 font-orbitron">
          Change Password
        </h2>
        <p className="text-white text-center mb-6 font-poppins">
          Enter your current password and a new password to change it.
        </p>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          {/* Current Password Input */}
          <div className="relative">
            <label
              htmlFor="currentPassword"
              className="text-sm font-medium text-white font-poppins"
            >
              Current Password
            </label>
            <input
              type={currentPasswordVisible ? "text" : "password"}
              id="currentPassword"
              placeholder="Enter your current password"
              className="w-full border border-gray-300 rounded-lg p-3 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-14 transform -translate-y-1/2 text-black text-2xl"
            >
              <i
                className={`bx ${currentPasswordVisible ? "bxs-hide" : "bxs-show"}`}
              ></i>
            </button>
          </div>

          {/* New Password Input */}
          <div className="relative">
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-white font-poppins"
            >
              New Password
            </label>
            <input
              type={newPasswordVisible ? "text" : "password"}
              id="newPassword"
              placeholder="Enter your new password"
              className="w-full border border-gray-300 rounded-lg p-3 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-14 transform -translate-y-1/2 text-black text-2xl"
            >
              <i
                className={`bx ${newPasswordVisible ? "bxs-hide" : "bxs-show"}`}
              ></i>
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-white font-poppins"
            >
              Confirm New Password
            </label>
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm your new password"
              className="w-full border border-gray-300 rounded-lg p-3 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-14 transform -translate-y-1/2 text-black text-2xl"
            >
              <i
                className={`bx ${confirmPasswordVisible ? "bxs-hide" : "bxs-show"}`}
              ></i>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-white  text-black py-3 rounded-lg hover:bg-green-300  dark:hover:bg-gray-400 text-lg transition duration-200"
          >
            Change Password
          </button>
        </form>
        <p className="text-l text-white text-center mt-6 font-poppins">
          Remembered your password?{" "}
          <a href="/login" className="text-green-950 dark:text-black underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default ChangePassword;
