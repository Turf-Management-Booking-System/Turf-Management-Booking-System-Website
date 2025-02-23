import { createSlice } from '@reduxjs/toolkit';
const bookings = localStorage.getItem("Bookings");
const allBooked = bookings && bookings !== "undefined" ? JSON.parse(bookings) : [];
const cancel = localStorage.getItem("cancelBookings");
const cancelBookings = cancel && cancel !== "undefined" ? JSON.parse(cancel):[]

const initialState={
    allBookings: allBooked,
    cancelBooked: cancelBookings
}

const bookingSlice= createSlice({
    name:"booking",
    initialState,
    reducers:{
        setAllBookings:(state,action)=>{
            state.allBookings = action.payload;
            localStorage.setItem("Bookings",JSON.stringify(action.allBookings))
        },
        addBooking:(state,action)=>{
            state.allBookings.push(action.payload);
            localStorage.setItem("Bookings",JSON.stringify(state.allBookings))

        },
        cancelBooking: (state, action) => {
            const bookingId = action.payload;
            const canceledBooking = state.allBookings.find(booking => booking._id === bookingId);
            
            if (canceledBooking) {
                state.allBookings = state.allBookings.filter(booking => booking._id !== bookingId);
                localStorage.setItem("Bookings", JSON.stringify(state.allBookings));
                state.cancelBooked.push(canceledBooking);
                localStorage.setItem("cancelBookings", JSON.stringify(state.cancelBooked));
            }
        }
        
    }
});
export const {setAllBookings,addBooking,cancelBooking} = bookingSlice.actions;
export default bookingSlice.reducer;
