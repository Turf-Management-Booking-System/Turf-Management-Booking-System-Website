import React from 'react'
import { loadNotification } from '../../slices/notificationSlice';
import { useSelector } from 'react-redux';
function Dashboard() {
  const notifications = useSelector((state)=>state.notification.notifications)
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
