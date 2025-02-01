import React, { useId, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../slices/authSlice';
import { setLoader } from '../../slices/authSlice';
const Otp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const registeredUser = useSelector((state) => state.auth.registeredUser);
  const dispatch = useDispatch();
  if (!registeredUser?.email) {
    toast.error("Email not found. Please ensure you are logged in.");
    return;
  }
  const navigate= useNavigate();
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
   const newOtp=`${otp.join("")}`
   const requestData = {
    otp:newOtp,
    email:registeredUser.email
   }
  console.log(requestData)
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(setLoader(true));
      const response = await axios.post("http://localhost:4000/api/v1/auth/verifyOtp", requestData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
  
      if (response.data.success) {
        toast.success("OTP verified successfully!");
  
        // Call Signup API with correct structure
        const signupResponse = await axios.post(
          "http://localhost:4000/api/v1/auth/signup",
          { ...registeredUser }, // Ensure correct payload
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        console.log("signup response ",signupResponse);
        if (signupResponse.data?.success) {
          console.log("Signup Response Data:", signupResponse.data); // Debugging log
          dispatch(registerUser(signupResponse.data.user));
          setTimeout(()=>{
            toast.success("User created successfully!")
          },2000)
          navigate("/login")
        } 
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error sending data to backend");
    }finally{
      dispatch(setLoader(false));
    }
  };
  
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
          Didn't receive the OTP? <button className="text-green-600 underline">Resend OTP</button>
        </p>
      </div>
    </div>
  );
};

export default Otp;
