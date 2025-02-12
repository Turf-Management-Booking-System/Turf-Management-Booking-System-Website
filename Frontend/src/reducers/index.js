import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice"
import turfReducer from "../slices/turfSlice"
import notificationReducer from "../slices/notificationSlice"
const rootReducer = combineReducers({
    auth:authReducer,
    turf:turfReducer,
    notification:notificationReducer
})
export default rootReducer