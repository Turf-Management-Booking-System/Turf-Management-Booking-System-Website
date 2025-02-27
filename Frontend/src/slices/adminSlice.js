import { createSlice } from '@reduxjs/toolkit';
const user = localStorage.getItem("allUsers");
const allUser = user && user !== "undefined" ? JSON.parse(user) : []
const initialState={
    allUsers:allUser
}


const adminSlice= createSlice({
    name:"admin",
    initialState,
    reducers:{
       setAllUsers :(state,action)=>{
        state.allUsers = action.payload;
        localStorage.setItem("allUsers",JSON.stringify(state.allUsers));
       }
    }
});
export const {setAllUsers} = adminSlice.actions;
export default adminSlice.reducer;
