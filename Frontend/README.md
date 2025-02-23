import React, { useState } from "react";
import "boxicons/css/boxicons.min.css";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { markAsRead as markAsReadAction } from "../../slices/notificationSlice"; 
import { deleteNotification as deleteNotificationAction } from "../../slices/notificationSlice"; 
import toast from "react-hot-toast";
import axios from "axios";

const Notification = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const notifications = useSelector((state) => state.notification.notifications);

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/v1/notify/markAsRead/${notificationId}`,
        {
          headers: { "Content-Type": "application/json", withCredentials: true },
        }
      );
      if (response.data.success) {
        console.log("Done Mark as Read", response.data);
        dispatch(markAsReadAction(notificationId)); // Use renamed action
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something Went Wrong!");
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/notify/deleteNotification/${notificationId}`,
        {
          headers: { "Content-Type": "application/json", withCredentials: true },
        }
      );
      if (response.data.success) {
        console.log("Delete the notification", response.data);
        dispatch(deleteNotificationAction(notificationId)); // Use renamed action
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something Went Wrong!");
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "read" && !notif.isRead) return false;
    if (filter === "unread" && notif.isRead) return false;
    if (typeFilter !== "all" && notif.messageType.toLowerCase() !== typeFilter.toLowerCase()) return false;
    return true;
  });

  console.log("All Notifications:", notifications);



  return (
    <div className="min-h-screen w-full bg-green-100 dark:bg-black flex justify-center pt-16 mt-10">
      <motion.div
        initial={{ y: 500, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full max-w-4xl"
      >
        <div className="w-full max-w-4xl bg-gray-200 p-6 rounded-lg shadow-xl">
          {/* Header Section */}
          <div className="flex items-center space-x-3">
            <i className="bx bx-bell text-green-900 text-4xl"></i>
            <h2 className="text-4xl font-bold text-green-800 font-orbitron underline underline-offset-8 mb-2">Notifications</h2>
          </div>
          <div className="p-3 mt-3 rounded-lg text-gray-700 font-serif text-lg">
            🟢 Stay updated with important alerts, warnings, and information.
          </div>

          {/* Filters Section */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 p-4 bg-green-100 rounded-lg shadow">
            {/* Read Filter */}
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-gray-700">Show:</span>
              {["all", "read", "unread"].map((f) => (
                <label key={f} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="filter"
                    checked={filter === f}
                    onChange={() => setFilter(f)}
                    className="hidden"
                  />
                  <div className={`px-4 py-2 rounded-lg text-sm font-semibold border ${filter === f ? "bg-green-800 text-white" : "bg-gray-200"}`}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </div>
                </label>
              ))}
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-gray-700">Type:</span>
              <select
                className="px-4 py-2 border rounded-lg text-gray-700 font-semibold"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="alert">Alert</option>
                <option value="warn">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>
          </div>

          {/* Notifications List */}
          <div className="mt-6 space-y-4">
            {filteredNotifications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No notifications found.</p>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`p-4 border-l-4 rounded-lg flex justify-between items-center overflow-hidden shadow
                    ${notif.IsRead ? "bg-green-100" : "bg-gray-50"}
                    ${notif.messageType === "warn" ? "border-red-300" :
                    notif.messageType === "alert" ? "border-yellow-200" :
                    "border-blue-300"
                    
                  }`}
                >
                  {/* Left Section - Logo & Message */}
                  <div>
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 bg-green-800 text-white flex items-center justify-center rounded-full text-lg font-bold">
                        KT
                      </div>
                      <span className="font-semibold font-orbitron text-lg">{notif.website}</span>
                    </div>
                    <p className="mt-2 text-gray-700">{notif.message}</p>
                    <p className="mt-1 text-gray-500 text-sm">{new Date(notif.createdAt).toLocaleString()}</p>
                  </div>

                  {/* Right Section - Buttons */}
                  <div className="space-x-3">
                    {!notif.isRead ?(
                      <button
                        onClick={() => markAsRead(notif._id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold shadow-md"
                      >
                        Read
                      </button>
                    ):(
                      <button
                        disabled
                        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold shadow-md"
                      >
                        Readed
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold shadow-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Notification;
