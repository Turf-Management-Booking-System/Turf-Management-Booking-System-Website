import { createSlice } from "@reduxjs/toolkit";

const initialState={
    locations:[],
    isVisited:localStorage.getItem("visited")|| false,
    selectedLocations:localStorage.getItem("selectedTurf")||null,
}

const turfSlice = createSlice({
    name:"turf",
    initialState:initialState,
    reducers:{
        setLocation:(state,action)=>{
           state.locations = action.payload
        },
        setSelectedTurfLocation:(state,action)=>{
           state.selectedLocations = action.payload
           localStorage.setItem("selectedTurf",JSON.stringify(action.payload));
        },
        setVisited:(state,action)=>{
            state.isVisited = action.payload
            localStorage.setItem("visited",JSON.stringify(action.payload));
        },
    }
})

export const { setLocation,setSelectedTurfLocation,setVisited } = turfSlice.actions;
export default turfSlice.reducer;

