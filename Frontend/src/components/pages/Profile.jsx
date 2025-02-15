import React, { useEffect, useState  } from "react";
import {useDispatch, useSelector} from "react-redux";
import toast from "react-hot-toast";
import axios from "axios"
import { deleteAccountUser, setLoader, updateProfileImage } from "../../slices/authSlice";
import { deleteAccountTurf } from "../../slices/turfSlice";
import { deleteAccountNotification } from "../../slices/notificationSlice";
import {useNavigate} from "react-router-dom";
import { loadNotification,setNotification } from "../../slices/notificationSlice";
const EditProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.auth.user);
  const notifications = useSelector((state)=>state.notification.notifications);
  const navigate = useNavigate();
  console.log("user",user)
  const token = useSelector((state)=>state.auth.token)
  console.log("token for handler",token)
  const [profileImage, setProfileImage] = useState(null);
   useEffect(()=>{
    dispatch(loadNotification())
   },[])
  const [profile, setProfile] = useState({
    firstName:  "",
    lastName: "",
    email:"",
    gender:"",
    phone: "",
    dob:"", // Date of Birth field
    description: "",
    location: "",
    about: "" // About field
  });

   const requestData ={
    firstName:profile.firstName,
    lastName:profile.lastName,
    email:profile.email,
    gender:profile.gender,
    phoneNumber:profile.phone,
    dateOfBirth:profile.dob,
    description:profile.description,
    location:profile.location,
    about:profile.about,
    token:token
   }
  const handleChange =async (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };


   const updateProfileHandler =async (e)=>{
    e.preventDefault();
    try{
        dispatch(setLoader(true));
        const response = await axios.post(`http://localhost:4000/api/v1/auth/updateProfile/${user?._id}`,
          requestData
        ,{
          headers:{
            "Content-Type":"application/json",
            withCredentials:true
          }
        });
        console.log("response Data",response.data);
        if(response.data.success){
            toast.success("Profile Updated Successfullly!");
            dispatch(loadNotification());
      try {
        const notificationResponse = await axios.get(
          `http://localhost:4000/api/v1/notify/getNotifications/${response.data.user._id}`,
          {
            headers: { "Content-Type": "application/json", withCredentials: true },
          }
        );
        if (notificationResponse.data.success) {
          console.log("fetch notification",notificationResponse.data.currentMessage);
          dispatch(setNotification(notificationResponse.data.currentMessage || []));
          localStorage.setItem(
            "userNotification",
            JSON.stringify(notificationResponse.data.currentMessage || [])
          );
          console.log("notifications state",notifications);
      
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something Went Wrong in fetching notifications!");
        console.log(error.response?.data?.message)
      }
        }
      }catch(error){
        toast.error(error.response?.data?.message || "Something Went Wrong!");
  
      }finally{
        dispatch(setLoader(false))
  
      }
   }
   const dataToken = {
    token:token,
    email:user.email,
   }
   const deleteProfileHandler=async(e)=>{
    e.preventDefault();
    try{
        dispatch(setLoader(true));
        const response = await axios.delete(`http://localhost:4000/api/v1/auth/deleteProfile/${user?._id}`,
        {  
          data:dataToken,
          headers:{
            "Content-Type":"application/json",
            withCredentials:true
          }
        });
        console.log("response Data",response.data);
        if(response.data.success){
            dispatch(deleteAccountUser());
            dispatch(deleteAccountTurf());
            dispatch(deleteAccountNotification())
            toast.success("Profile Deleted Successfullly!");
            navigate("/")
          
        }
      }catch(error){
        toast.error(error.response?.data?.message || "Something Went Wrong!");
        console.error("Error:", error.response?.data || error.message);

  
      }finally{
        dispatch(setLoader(false))
  
      }
   }
   
   const handleImageChangeHandler=async (e)=>{
    e.preventDefault();
    if (!profileImage) {
        toast.error("Please select an image!");
        return;
      }
      const formData = new FormData();
        formData.append("imageUrl", profileImage);
    try{
        dispatch(setLoader(true));
        const response = await axios.post(`http://localhost:4000/api/v1/auth/upload-Profile-Image/${user?._id}`,
            formData,
        {
          headers:{
            "Content-Type":"multipart/form-data",
            withCredentials:true
          }
        });
        console.log("response Data for upload image",response.data.fileData);
        if(response.data.success){
            toast.success("Profile Image Updated Successfully!!");
            dispatch(updateProfileImage(response.data.fileData.image))
        
            setProfile({ ...profile, image: response.data.fileData.image });
        }
      }catch(error){
        toast.error(error.response?.data?.message || "Something Went Wrong!");
        console.error("Error:", error.response?.data || error.message);

  
      }finally{
        dispatch(setLoader(false))
  
      }
   } 
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#587990] mt-16">
      <div className="w-full max-w-7xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-10 flex flex-col">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8 font-orbitron">Edit Profile</h2>
        <div className="flex gap-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center w-1/4">
            <img
              src={user.image}
              className="w-36 h-36 rounded-full border-4 border-gray-300 dark:border-gray-700"
            />
           <label className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer inline-block">
  Choose File
  <input
    type="file"
    onChange={handleImageChange}
    className="hidden"
  />
</label>


            <button onClick={handleImageChangeHandler} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Change</button>
          </div>
          
          {/* Form Section */}
          <div className="w-3/4 grid grid-cols-2 gap-8">
          <div>
              <label className="block text-gray-700 dark:text-white mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName }
                onChange={handleChange}
                className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-white mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 dark:text-white mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-white mb-1">Gender</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-white mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-white mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={profile.dob}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-white mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 dark:text-white mb-1">Short Description</label>
              <textarea
                name="description"
                value={profile.description}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 dark:text-white mb-1">About You</label>
              <textarea
                name="about"
                value={profile.about}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>
          </div>
        </div>
        {/* Buttons Section */}
        <div className="flex ml-80 justify-between mt-10">
          <button onClick={updateProfileHandler} className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Save Changes</button>
          <button onClick={deleteProfileHandler} className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;