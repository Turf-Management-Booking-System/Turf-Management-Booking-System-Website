import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice"
import turfReducer from "../slices/turfSlice"
import notificationReducer from "../slices/notificationSlice"
import commentReducer from "../slices/commentSlice"
import bookingReducer from "../slices/bookingSlice"
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import adminReducer from "../slices/adminSlice"
const commentPersistConfig = {
    key: 'comments',
    storage,
  };
 const persistedCommentReducer = persistReducer(commentPersistConfig, commentReducer);

const rootReducer = combineReducers({
    auth:authReducer,
    turf:turfReducer,
    notification:notificationReducer,
    comment:persistedCommentReducer,
    booking:bookingReducer,
    admin:adminReducer
})
export default rootReducer