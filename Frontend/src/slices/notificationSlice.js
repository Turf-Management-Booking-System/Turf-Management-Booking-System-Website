import { createSlice } from '@reduxjs/toolkit';
const storedNotifications = localStorage.getItem("userNotification");
const initialState={
    notifications: storedNotifications && storedNotifications !== "undefined" ? JSON.parse(storedNotifications):[],
}
const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
      setNotification:(state,action)=>{
           state.notifications=action.payload;
           localStorage.setItem("userNotification",JSON.stringify(state.notifications))
      },
      markAsRead:(state,action)=>{
           const index = state.notifications.findIndex((notif)=>
            notif._id === action.payload
           );
           if(index !== -1){
              state.notifications[index].isRead = true;
              localStorage.setItem("userNotification",JSON.stringify(state.notifications));

           }

      },
      deleteNotification:(state,action)=>{
           state.notifications = state.notifications.filter((notify)=>
           notify._id !== action.payload);
           localStorage.setItem("userNotification",JSON.stringify(state.notifications));
          
      },
      loadNotification: (state) => {
        const storedNotifications = localStorage.getItem("userNotification");
        state.notifications = storedNotifications && storedNotifications !== "undefined"
            ? JSON.parse(storedNotifications)
            : [];
    },
    },
  });
  
  // Export actions
  export const { setNotification,markAsRead,deleteNotification ,loadNotification} = notificationSlice.actions;
  
  export default notificationSlice.reducer;
  