import { createSlice } from "@reduxjs/toolkit";

const initialState={
    turfs:[],
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
        setTurfs:(state,action)=>{
            state.turfs = action.payload
        }
    }
})

export const { setLocation,setSelectedTurfLocation,setVisited,setTurfs } = turfSlice.actions;
export default turfSlice.reducer;

