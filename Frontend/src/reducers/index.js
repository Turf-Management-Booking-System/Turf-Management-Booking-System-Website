import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice"
import turfReducer from "../slices/turfSlice"
const rootReducer = combineReducers({
    auth:authReducer,
    turf:turfReducer,
})
export default rootReducer