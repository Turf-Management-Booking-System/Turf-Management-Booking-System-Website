import { createSlice } from "@reduxjs/toolkit";
const turfs = localStorage.getItem("turfs");
const turf = turfs && turfs !== "undefined" ? JSON.parse(turfs) : []
const initialState={
    turfs:turf,
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
            state.turfs = action.payload;
            localStorage.setItem("turfs",JSON.stringify(state.turfs));
        }
    }
})

export const { setLocation,setSelectedTurfLocation,setVisited,setTurfs } = turfSlice.actions;
export default turfSlice.reducer;

