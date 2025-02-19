import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice"
import turfReducer from "../slices/turfSlice"
import notificationReducer from "../slices/notificationSlice"
import commentReducer from "../slices/commentSlice"
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
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
})
export default rootReducer