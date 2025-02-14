import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post("http://localhost:4000/api/v1/ai/chatBot", { message: input });
      
      // Add AI response to chat
      setMessages([...newMessages, { role: "assistant", content: res.data.reply }]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-200 rounded-lg w-96 mx-auto mt-20">
      <h2 className="text-xl font-bold text-center">Chat with AI</h2>
      <div className="h-60 overflow-y-auto border p-2 bg-white mt-2 rounded">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 my-1 rounded ${msg.role === "user" ? "bg-blue-200 text-right" : "bg-gray-300 text-left"}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="mt-3 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
