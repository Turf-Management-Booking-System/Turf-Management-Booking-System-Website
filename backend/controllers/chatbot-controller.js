const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const API_KEY = process.env.GEMINI_API_KEY;
const axios = require('axios');

exports.chatBot = async(req,res)=>{
   try {
        const { message } = req.body;

        //For About
        if (message.includes("about your website")) {
          return res.json({
            reply: `KickOnTurf is an advanced Turf Booking Management System where users can book turfs,check booking history, check availability,real-time weather and manage their reservations easily. We offer various turfs with top-quality facilities.`
          });
        } 
    
        if (message.includes("about")) {
          return res.json({
            reply: `Our About page explains our mission and vision. At KickOnTurf, we aim to provide a seamless booking experience for sports lovers. Our goal is to make turf bookings effortless and efficient.`
          });
        } 

        if (message.includes("contact page")) {
          return res.json({
            reply: `You can reach us through our Contact Page:\n📞 Phone: +91 9137441613\n📧 Email: support@kickonturf.com\n📍 Address:400070 Pipe Road, Kurla West, Mumbai.`
          });
        }

        // Default AI Response for other queries
    const systemInstruction = `
    You are a chatbot for 'KickOnTurf'. You provide information about the website, booking details, pricing, and availability.
    If the user asks something unrelated, guide them back to turf-related queries.
  `;


        const response = await axios.post(
          `${GEMINI_API_URL}?key=${API_KEY}`,
          {
            contents: [{ parts: [{ text: systemInstruction + "\nUser: " + message }] }]
          },
          { headers: { "Content-Type": "application/json" } }
        );
    
        const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
    
        res.json({ reply });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}