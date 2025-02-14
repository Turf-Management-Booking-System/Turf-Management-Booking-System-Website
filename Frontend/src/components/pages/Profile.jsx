import React, { useState } from "react";

const EditProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    gender: "",
    phone: "",
    dob: "", // Date of Birth field
    description: "",
    location: "",
    about: "" // About field
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#587990] mt-16">
      <div className="w-full max-w-7xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-10 flex flex-col">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8 font-orbitron">Edit Profile</h2>
        <div className="flex gap-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center w-1/4">
            <img
              src=""
              className="w-36 h-36 rounded-full border-4 border-gray-300 dark:border-gray-700"
            />
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Change</button>
          </div>
          
          {/* Form Section */}
          <div className="w-3/4 grid grid-cols-2 gap-8">
            <div className="col-span-2">
              <label className="block text-gray-700 dark:text-white mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
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
          <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Save Changes</button>
          <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
