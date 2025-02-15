import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setLoader } from '../../slices/authSlice';

const Otp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state)=>state.auth.user);
  console.log("user for otp",user)
  const isForgetPassword = localStorage.getItem("isForgetPassword") === "true";

  if (!user?.email) {
    toast.error("Email not found. Please ensure you are logged in.");
    return;
  }

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

      // Clear the current box
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
    const requestData = {
      otp: newOtp,
      email: user?.email,
    };

    try {
      dispatch(setLoader(true));
      const response = await axios.post("http://localhost:4000/api/v1/auth/verifyOtp", requestData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("OTP verified successfully!");
        if (isForgetPassword) {
          navigate("/updatePassword");
        } else {
          await signupVerification();
        }
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error sending data to backend");
    } finally {
      dispatch(setLoader(false));
    }
  };

  const signupVerification = async () => {
    try {
      dispatch(setLoader(true));
      const signupResponse = await axios.post(
        "http://localhost:4000/api/v1/auth/signup",
        { ...user }, // Ensure correct payload
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (signupResponse.data?.success) {
        dispatch(setUser(signupResponse.data.user));
        setTimeout(() => {
          toast.success("User created successfully!");
        }, 2000);
        navigate("/login");
      } else {
        toast.error(signupResponse.data.message);
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Signup failed");
    }finally{
      dispatch(setLoader(false));
    }
  };
   const resentOtp =async()=>{
    const requestData={
      email:user?.email
    }
    try {
      dispatch(setLoader(true));
      const response = await axios.post("http://localhost:4000/api/v1/auth/sendOtp", requestData, {
        headers: {
          "Content-Type": "application/json", 
        },
        withCredentials: true 

      });
  
      console.log("Response from backend:", response.data);
  
      if (response.data.success) {
        toast.success("OTP sent successfully!");
        
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error sending data to backend");
    }
    finally {
      dispatch(setLoader(false));
    }
   }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-100 via-lime-200 to-green-300">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8 mx-4">
        <h2 className="text-2xl font-bold text-green-600 text-center mb-4">Enter OTP</h2>
        <p className="text-gray-600 text-center mb-6">
          Please enter the 6-digit OTP sent to your registered mobile number.
        </p>
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="flex space-x-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="w-12 h-12 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Verify OTP
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Didn't receive the OTP? 
          <button className="text-green-600 underline" onClick={resentOtp}>Resend OTP</button>
          
        </p>
      </div>
    </div>
  );
};

export default Otp;
