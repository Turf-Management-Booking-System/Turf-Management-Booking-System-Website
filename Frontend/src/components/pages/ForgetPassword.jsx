import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoader } from "../../slices/authSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import FloatingButton from "./FloatingButton";

const ForgetPassword = () => {
  const [email, setEmail] = useState(""); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const requestData={
    email:email
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoader(true));
      const response = await axios.post(
        `${VITE_API_BASE_URL}/api/v1/auth/forgetPassword`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Response from backend forgetPassword:", response.data);

      if (response.data.success) {
        localStorage.setItem("email", email);
        localStorage.setItem("isForgetPassword",true);
        toast.success("Sent OTP Successfully!");
        navigate("/otp");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error sending data to backend");
    } finally {
      dispatch(setLoader(false));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#8dabc1] to-[#1a527a] dark:from-gray-500 dark:to-gray-900">
      <FloatingButton/>
      <div className="bg-white dark:bg-black border border-black dark:border-white shadow-2xl rounded-xl w-full max-w-md p-8 mx-4">
        <h2 className="text-2xl font-bold text-[#1a527a] dark:text-white text-center mb-4">
          Forgot Password?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          Enter your registered email to receive a password reset link.
        </p>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg p-3 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-gray-200"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#3e81b0] dark:bg-gray-500 text-white py-3 rounded-lg hover:bg-[#71a4c8] dark:hover:bg-gray-400 transition duration-200"
          >
            Reset Password
          </button>
        </form>
        <p className="text-sm text-gray-500 dark:text-gray-300 text-center mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-green-600 underline">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
