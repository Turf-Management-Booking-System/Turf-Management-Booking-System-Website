import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoader } from "../../slices/authSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { DarkModeContext } from "../../context/DarkModeContext";
import { FaHeart } from "react-icons/fa";
import { BiPhoneCall } from "react-icons/bi";
import whiteBg from "../../assets/Images/whiteBg.png";
import blackBg from "../../assets/Images/blackBg.png";

const ContactForm = () => {
  const {darkMode} = useContext(DarkModeContext);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const requestData = { fullName, email, message };

  const contactHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoader(true));
      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/contactMe",
        requestData,
        {
          headers: { "Content-Type": "application/json", withCredentials: true },
        }
      );
      if (response.data.success) {
        toast.success("Thanks For Contacting Us!");
        setFullName("");
        setEmail("");
        setMessage("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something Went Wrong!");
    } finally {
      dispatch(setLoader(false));
    }
  };

  return (
    <div style={{
                  backgroundImage: `url(${darkMode ? blackBg : whiteBg})`
                }} className="min-h-screen flex flex-col items-center justify-center  bg-cover bg-center text-white py-12 mt-12">
      <div className="text-center mb-12 relative z-10">
        <h1 className="sm:text-4xl text-3xl font-orbitron font-bold text-green-800 dark:text-green-600 underline flex items-center gap-2">
          <span className="pb-5 md:pb-4 sm:pb-0 ml-5 sm:ml-0"><BiPhoneCall/></span> Let's Connect & Kick Off!
        </h1>
        <p className=" font-poppins text-black dark:text-white mt-2 max-w-2xl mx-auto">
          Got questions about bookings, availability, or special events? We’re here to help! 
          Fill out the form below, and our team will get back to you as soon as possible.
        </p>
      </div>


      <div className=" relative z-10 flex flex-col md:flex-row gap-16 p-8 w-full max-w-7xl">
      <div className="absolute inset-0  dark:bg-black bg-white dark:bg-opacity-80 opacity-30"></div>
        {/* Left Section - Contact Information */}
        <motion.div
          initial={{ x: "-100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="space-y-12 w-full md:w-1/2 relative z-10"
        >
        
          <h1 className=" text-green-800 dark:text-green-600 font-orbitron text-3xl font-bold underline">Contact Information</h1>
          
          {/* Address */}
          <div className="flex items-start gap-4">
            <i className="bx bxs-map text-4xl text-black dark:text-white"></i>
            <div>
              <h3 className="text-lg font-montserrat text-black dark:text-white font-semibold">Address</h3>
              <p className="text-black dark:text-white font-poppins">400070 Pipe Road, Kurla West, Mumbai.</p>
            </div>
          </div>
          
          {/* Phone */}
          <div className="flex items-start gap-4">
            <i className="bx bxs-phone text-4xl text-black dark:text-white"></i>
            <div>
              <h3 className="text-lg font-montserrat text-black dark:text-white font-semibold">Phone</h3>
              <p className="dark:text-white text-black font-poppins">000-000-0000</p>
            </div>
          </div>
          
          {/* Email */}
          <div className="flex items-start gap-4">
            <i className="bx bxs-envelope text-4xl text-black dark:text-white"></i>
            <div>
              <h3 className="text-lg font-montserrat  text-black dark:text-white font-semibold">Email</h3>
              <p className="text-black dark:text-white font-poppins">sknagma5233@gmail.com</p>
            </div>
          </div>
          
          {/* Business Hours */}
          <div className="flex items-start gap-4">
            <i className="bx bxs-time-five text-4xl text-black dark:text-white"></i>
            <div>
              <h3 className="text-lg font-montserrat text-black dark:text-white font-semibold">Business Hours</h3>
              
              <p className="text-black dark:text-white font-poppins">Monday to Friday: 9 AM - 6 PM</p>
              <p className="text-black dark:text-white font-poppins">Saturday: 10 AM - 4 PM</p>
            </div>
          </div>
          <div className="space-y-1"><h1 className="text-3xl text-black dark:text-white font-bold font-orbitron flex items-center gap-2"><FaHeart className="text-black dark:text-white"/> Play, Relax, Repeat!</h1>
  <p className="text-lg text-black dark:text-white font-poppins">
    Your game matters to us! We ensure well-maintained turfs, seamless booking, and friendly customer support to make your experience smooth and enjoyable.
  </p></div>
          
        </motion.div>

        {/* Right Section - Contact Form */}
        <motion.div
          initial={{ x: "100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="bg-white relative z-10 rounded-tl-[4vw] rounded-br-[4vw] p-8 w-full md:w-1/2 shadow-lg border-2 border-black dark:border-gray-500"
        >
          <h2 className="text-3xl font-bold mb-6 font-orbitron text-center text-green-900">
            Send Message
          </h2>
          <form className="space-y-8" onSubmit={contactHandler}>
            {/* Full Name Input */}
            <div className="relative">
              <input
                type="text"
                className="peer w-full pt-6 pb-1 bg-transparent border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-green-400"
                placeholder=" "
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                name="fullName"
              />
              <label className="absolute left-0 top-1 text-gray-400 text-sm transition-all peer-placeholder-shown:top-7 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-green-400">
                Full Name
              </label>
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                className="peer w-full pt-6 pb-1 bg-transparent border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-green-400"
                placeholder=" "
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
              />
              <label className="absolute left-0 top-1 text-gray-400 text-sm transition-all peer-placeholder-shown:top-7 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-green-400">
                Email
              </label>
            </div>

            {/* Message Textarea */}
            <div className="relative">
              <textarea
                rows="10"
                className="peer w-full pt-6 pb-1 bg-transparent border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-green-400"
                placeholder=" "
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                name="message"
              ></textarea>
              <label className="absolute left-0 top-1 text-gray-400 text-sm transition-all peer-placeholder-shown:top-7 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-green-400">
                Type your message...
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-900 hover:bg-green-700 text-white font-bold py-3 rounded"
            >
              Send
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactForm;
