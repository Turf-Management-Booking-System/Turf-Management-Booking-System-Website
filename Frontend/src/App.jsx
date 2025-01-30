import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Home from "./components/pages/Home";
import Footer from "./components/common/Footer";
import Login from "./components/pages/Login";
import Contact from "./components/pages/Contact";
import About from "./components/pages/About";
import Otp from "./components/pages/Otp";
import ForgetPassword from "./components/pages/ForgetPassword";
import UpdatePassword from "./components/pages/UpdatePassword";
import ChangePassword from "./components/pages/ChangePassword";

// Preloader Component
const Preloader = () => (
  <div className="flex justify-center items-center h-screen bg-black">
    <h1 className="text-7xl font-bold text-white animate-writing">Loading Turf Management...</h1>
  </div>
);

const App = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Check if current page is authentication-related
  const isAuthPage = ["/login", "/otp", "/forgetpassword", "/updatepassword", "/changepassword"].includes(location.pathname);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />; // Show preloader only initially

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/updatepassword" element={<UpdatePassword />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  );
};

export default App;
