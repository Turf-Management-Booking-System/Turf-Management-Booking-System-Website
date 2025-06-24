import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setLoader } from '../../slices/authSlice';
import FloatingButton from './FloatingButton';

const Otp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.auth.user);
  const isForgetPassword = localStorage.getItem("isForgetPassword") === "true";
  const storedEmail = localStorage.getItem("email");
  
  // Get email from either Redux or localStorage
  const email = reduxUser?.email || storedEmail;

  // Redirect if no email is found
  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please try again.");
      navigate(isForgetPassword ? "/forget-password" : "/login");
    }
  }, [email, navigate, isForgetPassword]);

  // Handle input change
  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input box
      if (element.nextSibling) {
        element.nextSibling.focus();
      }
    }
  };

  // Handle backspace
  const handleBackspace = (event, index) => {
    if (event.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      // Move focus to the previous input box
      if (event.target.previousSibling) {
        event.target.previousSibling.focus();
      }
    }
  };

  // Handle OTP submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newOtp = otp.join("");
    
    if (newOtp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    try {
      dispatch(setLoader(true));
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/verifyOtp`,
        { otp: newOtp, email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("OTP verified successfully!");
        if (isForgetPassword) {
          navigate("/updatePassword");
        } else {
          await signupVerification();
        }
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error verifying OTP");
    } finally {
      dispatch(setLoader(false));
    }
  };

  const signupVerification = async () => {
    try {
      dispatch(setLoader(true));
      const signupResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/signup`,
        { ...reduxUser },
        { 
          headers: { "Content-Type": "application/json" }, 
          withCredentials: true 
        }
      );

      if (signupResponse.data?.success) {
        dispatch(setUser(signupResponse.data.user));
        toast.success("User created successfully!");
        navigate("/login");
      } else {
        toast.error(signupResponse.data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoader(false));
    }
  };

  const resendOtp = async () => {
    try {
      dispatch(setLoader(true));
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/sendOtp`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      if (response.data.success) {
        toast.success("New OTP sent successfully!");
      } else {
        toast.error(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error resending OTP");
    } finally {
      dispatch(setLoader(false));
    }
  };

  if (!email) {
    return null; // Already handled by useEffect redirect
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#8dabc1] to-[#1a527a] dark:from-gray-500 dark:to-gray-900 px-4">
      <FloatingButton />
      <div className="bg-white dark:bg-black shadow-lg rounded-xl w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-[#1a527a] dark:text-white text-center mb-4">
          Enter OTP
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          Please enter the 6-digit OTP sent to {email}
        </p>

        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 sm:gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="w-10 h-10 sm:w-12 sm:h-12 border border-gray-300 dark:border-gray-700 dark:bg-gray-100 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            ))}
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition duration-200 w-full sm:w-auto"
          >
            Verify OTP
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-300 text-center mt-4">
          Didn't receive the OTP?{" "}
          <button 
            className="text-green-600 underline focus:outline-none" 
            onClick={resendOtp}
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
};

export default Otp;