import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../slices/authSlice";
import { setLoading } from "../../slices/authSlice";
const Login = () => {
  const [isActive, setIsActive] = useState(false);
  const loading = useSelector(state=>state.auth.loading);
  console.log("loading value ",loading)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData,setFormData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    role:"Player"
  });
  const formHandler =(event)=>{
      setFormData(prev=>{
        return{
          ...prev,
          [event.target.name]:event.target.value
        }
      })
  }
  const SignupHandler = async (event) => {
    event.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      return toast.error("Please enter the required fields!");
    }
    const requestData = {
      email: formData.email, 
    };
  
    try {
      dispatch(setLoading(true));
      console.log("loading state",loading);
      const response = await axios.post("http://localhost:4000/api/v1/auth/sendOtp", requestData, {
        headers: {
          "Content-Type": "application/json", 
        },
        withCredentials: true 

      });
  
      console.log("Response from backend:", response.data);
  
      if (response.data.success) {
        toast.success("OTP sent successfully!");
        dispatch(registerUser(formData));
        console.log("registerDtaa",formData);
        navigate("/otp");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error sending data to backend");
    }
    finally {
      dispatch(setLoading(false));
    }
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    });
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-deepForestGreen mt-10">
        <div
          className={`relative ${
            isActive ? "active" : ""
          } container w-[850px] h-[550px] max650:h-[calc(100vh-40px)] bg-[#fff] rounded-2xl m-[20px] overflow-hidden`}
          style={{ boxShadow: "0 0 30px rgba(0,0,0,0.2)" }}
        >
          <div className={`${isActive? "right-[50%] delay-[1200ms] max650:right-0 max650:bottom-[30%]" : "right-0 delay-[1000ms]"} login  max650:w-[100%] max650:h-[70%] max650:bottom-0 absolute w-[50%] h-[100%] bg-[#fff] flex items-center text-gray-700 text-center p-[40px] z-[1] transition-all ease-in-out duration-[600ms], visibility`}>
            <form className=" w-[100%]" action="">
              <h1 className="text-4xl -mt-[10px] -mb-[10px]">
                <b>Login</b>
              </h1>
              <div className="relative mt-[30px] mb-[30px]">
                <input
                  className="w-[100%] pl-[20px] pr-[50px] pt-[13px] pb-[13px] bg-[#eee] rounded-xl border-none outline-none text-[16px] text-[#333] font-medium"
                  type="text"
                  placeholder="Username"
                  required
                />
                <i className="bx bxs-user absolute right-5 top-[50%] transform -translate-y-[50%] text-xl text-[#888]"></i>
              </div>
              <div className="relative mt-[30px] mb-[30px]">
                <input
                  className="w-[100%] pl-[20px]  pr-[50px] pt-[13px] pb-[13px] bg-[#eee] rounded-xl border-none outline-none text-[16px] text-[#333] font-medium"
                  type="password"
                  placeholder="Password"
                  required
                />
                <i className="bx bxs-lock-alt absolute right-5 top-[50%] transform -translate-y-[50%] text-xl text-[#888]"></i>
              </div>
              <div className="-mt-[15px] mb-[15px]">
                <a href="/forgetpassword" className="text-[14.5px] text-green-700  no-underline" >
                  Forgot password ?
                </a>
              </div>
              <button
                type="submit"
                className="w-[100%] h-[48px] bg-gradient-to-r from-green-300 via-lime-400 to-green-500 rounded-lg border-none cursor-pointer text-[16px] text-[#fff] font-semibold"
                style={{ boxShadow: "0 0 10px rgba(0,0.0,.2)" }}
              >
                Login
              </button>
              <p className="text-[14.5px] mt-[15px] mb-[15px]">
                or login with social platforms
              </p>
              <div className="flex justify-center">
                <a href="#">
                  <i className="bx bxl-google inline-flex p-[10px] border-2 border-gray-300 rounded-lg text-[24px] text-[#333] no-underline ml-[8px] mr-[8px]"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-facebook inline-flex p-[10px] border-2 border-gray-300 rounded-lg text-[24px] text-[#333] no-underline ml-[8px] mr-[8px]"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-github inline-flex p-[10px] border-2 border-gray-300 rounded-lg text-[24px] text-[#333] no-underline ml-[8px] mr-[8px]"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-linkedin inline-flex p-[10px] border-2 border-gray-300 rounded-lg text-[24px] text-[#333] no-underline ml-[8px] mr-[8px]"></i>
                </a>
              </div>
            </form>
          </div>

          <div
            className={`register ${isActive ? "right-[50%] visible delay-[1200ms] max650:right-0 max650:bottom-[30%]" : "right-0 invisible delay-[1000ms]"}  max650:w-[100%] max650:h-[70%] max650:bottom-0 absolute w-[50%] h-[100%] bg-[#fff] flex items-center text-gray-700 text-center p-[40px] z-[1] transition-all ease-in-out duration-[600ms], visibility`}
          >
            <form className=" w-[100%]" onSubmit={SignupHandler}>
              <h1 className="text-4xl max650:m-6 -mt-[10px] -mb-[10px]">
                <b>Registration</b>
              </h1>
              <div className="relative mt-[30px] mb-[20px]">
                <input
                  className="w-[100%] pl-[20px] pr-[50px] pt-[13px] pb-[13px] bg-[#eee] rounded-xl border-none outline-none text-[16px] text-[#333] font-medium"
                  type="text"
                  placeholder="First Name"
                  onChange={formHandler}
                  value={formData.firstName}
                  name="firstName"
                  required
                />
                <i className="bx bxs-user absolute right-5 top-[50%] transform -translate-y-[50%] text-xl text-[#888]"></i>
              </div>
              <div className="relative mt-[20px] mb-[20px]">
                <input
                  className="w-[100%] pl-[20px] pr-[50px] pt-[13px] pb-[13px] bg-[#eee] rounded-xl border-none outline-none text-[16px] text-[#333] font-medium"
                  type="text"
                  placeholder="Last Name"
                  onChange={formHandler}
                  value={formData.lastName}
                  name="lastName"
                  required
                />
                <i className="bx bxs-user absolute right-5 top-[50%] transform -translate-y-[50%] text-xl text-[#888]"></i>
              </div>
              <div className="relative mt-[20px] mb-[20px]">
                <input
                  className="w-[100%] pl-[20px] pr-[50px] pt-[13px] pb-[13px] bg-[#eee] rounded-xl border-none outline-none text-[16px] text-[#333] font-medium"
                  type="email"
                  placeholder="Email"
                  required
                  onChange={formHandler}
                  value={formData.email}
                  name="email"
                />
                <i className="bx bxs-envelope absolute right-5 top-[50%] transform -translate-y-[50%] text-xl text-[#888]"></i>
              </div>
              <div className="relative mt-[20px] mb-[20px]">
                <input
                  className="w-[100%] pl-[20px]  pr-[50px] pt-[13px] pb-[13px] bg-[#eee] rounded-xl border-none outline-none text-[16px] text-[#333] font-medium"
                  type="password"
                  placeholder="Password"
                  onChange={formHandler}
                  value={formData.password}
                  name="password"
                  required
                />
                <i className="bx bxs-lock-alt absolute right-5 top-[50%] transform -translate-y-[50%] text-xl text-[#888]"></i>
              </div>
              
              <button
                type="submit"
                className="w-[100%] h-[48px] bg-deepForestGreen rounded-lg border-none cursor-pointer text-[16px] text-[#fff] font-semibold"
                style={{ boxShadow: "0 0 30px rgba(0,0.0,.2" }}
              >
                Register
              </button>
              <p className="text-[14.5px] mt-[15px] mb-[15px]">
                or register with social platforms
              </p>
              <div className="flex justify-center">
                <a href="#">
                  <i className="bx bxl-google inline-flex p-[10px] border-2 border-gray-300 rounded-lg text-[24px] text-[#333] no-underline ml-[8px] mr-[8px]"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-facebook inline-flex p-[10px] border-2 border-gray-300 rounded-lg text-[24px] text-[#333] no-underline ml-[8px] mr-[8px]"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-github inline-flex p-[10px] border-2 border-gray-300 rounded-lg text-[24px] text-[#333] no-underline ml-[8px] mr-[8px]"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-linkedin inline-flex p-[10px] border-2 border-gray-300 rounded-lg text-[24px] text-[#333] no-underline ml-[8px] mr-[8px]"></i>
                </a>
              </div>
            </form>
          </div>

          <div
            className={`toggle-box  absolute w-[100%] h-[100%] before:max650:rounded-[20vw] before:content-[''] before:absolute before:w-[300%] before:h-full before:bg-gradient-to-r from-green-600 via-lime-500 to-green-700 before:rounded-[150px] 
        before:z-[2] before:transition-all before:duration-[1800ms] before:ease-in-out 
        max650:before:w-[100%] max650:before:h-[300%] max650:before:left-0 max650:before:top-[-270%]
          ${isActive ? "before:left-[50%] before:max650:top-[70%] before:max650:left-0" : "before:left-[-250%]"}`}
          >
            <div
              className={`toggle-panel max650:w-[100%] max650:h-[30%] max650:top-0  absolute w-[50%] h-[100%]  text-[#fff] flex flex-col justify-center transition-all duration-[600ms] ease-in-out
           items-center z-[2] ${isActive ? "left-[-50%] delay-[600ms] max650:left-0 max650:top-[-30%]" : " left-0 delay-[1200ms]"}`}
            >
              <h1 className="text-4xl -mt-[10px] -mb-[5px]">
                <b>Hello, Welcome!</b>
              </h1>
              <p className="text-[14.5px] mt-[15px] mb-[20px] ">
                Don't have an account ?
              </p>
              <button
                onClick={() => setIsActive(true)}
                className=" register-btn w-[160px] h-[46px] bg-transparent rounded-lg border-2 border-[#fff] shadow-none cursor-pointer text-[16px] text-[#fff] font-semibold"
              >
                Register
              </button>
            </div>
            <div className={`toggle-panel max650:right-0 max650:bottom-[-30%] max650:w-[100%] max650:h-[30%] absolute w-[50%] h-[100%]  text-[#fff] flex flex-col justify-center items-center
             z-[2] transition-all duration-[600ms] ease-in-out  ${isActive ? "right-[0] delay-[1200ms] max650:bottom-[0]" : "right-[-50%] delay-[600ms]"}`}>
              <h1 className="text-4xl -mt-[10px] -mb-[5px]">
                <b>Welcome Back</b>
              </h1>
              <p className="text-[14.5px] mt-[15px] mb-[20px] ">
                Already have an account ?
              </p>
              <button
                onClick={() => setIsActive(false)}
                className=" login-btn w-[160px] h-[46px] bg-transparent rounded-lg border-2 border-[#fff] shadow-none cursor-pointer text-[16px] text-[#fff] font-semibold"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
