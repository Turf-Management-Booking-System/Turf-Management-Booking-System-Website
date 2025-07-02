import React, { useState,useContext } from "react";
import axios from "axios";
import { FaArrowUp, FaRobot } from "react-icons/fa";
import ChatBg from "../../assets/Images/ChatBg.png";
import ChatBgDark from "../../assets/Images/ChatBgDark.png";
import { DarkModeContext } from "../../context/DarkModeContext";

const Chatbot = ({ onClose }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/ai/chatBot`, { message: input });
      setMessages([...newMessages, { role: "assistant", content: res.data.reply }]);
    } catch (error) {
      console.error("Error while chatbot:", error);
    }
  };

  return (
    <div style={{
      backgroundImage: `url(${darkMode ? ChatBgDark : ChatBg})`,
    }}  className="fixed top-20 right-5 h-[39rem] w-[32rem] outline-none shadow-xl rounded-lg border-2 border-white dark:border-black flex flex-col z-50">
      {/* ✅ Header with Close Button */}
      <div className="p-3 bg-[#5886a7] dark:bg-black text-white font-bold flex gap-4 rounded-lg">
        <span className="font-montserrat text-lg">Chat with AI</span>
        <span className="text-2xl"><FaRobot/></span>
        
        <button onClick={onClose} className="text-white ml-72 text-xl">✖</button>
      </div>

      {/* ✅ Chat Messages */}
      <div style={{
              backgroundImage: `url(${darkMode ?"" : ChatBg})`,
            }} className="bg-cover bg-center bg-opacity-85 h-[34rem] overflow-y-auto p-3 space-y-2 ">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] p-2 rounded-lg text-sm ${
              msg.role === "user"
                ? "bg-[#5886a7] bg-opacity-80 dark:bg-black dark:border border-white text-white ml-auto"
                : "bg-gray-100 dark:bg-white text-black mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* ✅ Input Box */}
      <div className="flex bg-[#5886a7] dark:bg-black  rounded-md outline-none items-center p-3 border-t dark:border-none">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow text-black dark:bg-gray-200 font-poppins p-2 border rounded-lg focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-white dark:bg-black dark:shadow-lg text-black dark:text-white rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
        >
          <FaArrowUp size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
