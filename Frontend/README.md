/ import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const BookingPage = () => {
//   const [slots, setSlots] = useState([]);
//   const { turfId } = useParams();

//   const fetchTurfBySlots = async () => {
//     try {
//       const response = await axios.get(`http://localhost:4000/api/v1/turf/${turfId}/slots`, {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true,
//       });

//       console.log("Response from turf slots:", response.data);

//       if (response.data.success) {
//         setSlots(response.data.slots);
//       }
//     } catch (error) {
//       console.error(error.response?.data?.message || "Failed to fetch slots");
//     }
//   };

//   useEffect(() => {
//     fetchTurfBySlots();
//   }, []);

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
//       <h2 className="text-2xl font-bold mb-6">Select a Time Slot</h2>
//       <div className="grid grid-cols-3 gap-4">
//         {slots.map((slot) => (
//           <button
//             key={slot._id}
//             className={`p-3 w-32 rounded-lg text-center font-semibold transition ${
//               slot.status === "booked"
//                 ? "bg-red-500 text-white cursor-not-allowed"
//                 : "bg-green-500 text-white hover:bg-green-600"
//             }`}
//             disabled={slot.status === "booked"}
//           >
//             {slot.time} {slot.status === "booked" && "(Booked)"}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BookingPage;
