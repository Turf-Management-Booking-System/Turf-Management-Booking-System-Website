import { createSlice } from '@reduxjs/toolkit';
const bookings = localStorage.getItem("Bookings");
const allBooked = bookings && bookings !== "undefined" ? JSON.parse(bookings) : [];

const initialState={
    allBookings: allBooked,
}

const bookingSlice= createSlice({
    name:"booking",
    initialState,
    reducers:{
        setAllBookings:(state,action)=>{
            state.allBookings = action.payload;
            localStorage.setItem("Bookings",JSON.stringify(action.payload))
        }
    }
});
export const {setAllBookings} = bookingSlice.actions;
export default bookingSlice.reducer;
