import React from 'react'
import { loadNotification } from '../../slices/notificationSlice';
import { useSelector,useDispatch } from 'react-redux';
function Dashboard() {
  const dispatch = useDispatch();
  const notifications = useSelector((state)=>state.notification.notifications);
  console.log("notifications in dasboard",notifications)
  useEffect( ()=>{
         dispatch(loadNotification());
       },[dispatch])
  return (
    <div>
      Welcome to dashboard
    </div>
  )
}

export default Dashboard
