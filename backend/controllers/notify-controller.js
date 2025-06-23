const Notification = require("../models/notification")
const mongoose = require("mongoose")
const User = require("../models/user")
exports.createNotication =async (req,res)=>{
    try{
    const{userId,message}= req.body;
    if(!userId||!message){
        return res.status(401).json({
            success:false,
            message:"Insert The Data Properly!"
        })
    }
    const userIdConvert =new mongoose.Types.ObjectId(req.body.userId);
    const userExists = await User.findById(userIdConvert);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const newMessage = await Notification.create({
        user:userIdConvert,
        message
    });
    console.log("new message",newMessage);
    return res.status(200).json({
        success:true,
        message:"Notification Created Successfully!",
        notification:newMessage,
    })
    }catch(error){
         console.log("Error",error);
         return res.status(500).json({
            success:false,
            message:"Error While Creating The Notification! ",
            error:error.message
         })
    }
}
exports.getNotifications=async (req,res)=>{
    try{
     const{userId} = req.params;
     if(!userId){
        return res.status(401).json({
            success:false,
            message:"Please Enter The Data Properly"
        })
     }
     const messages = await Notification.find({
        user:userId
     }).sort({createdAt:-1});
    console.log("fetch messages",messages);
    return res.status(200).json({
        success:true,
        message:"Fetch The Current message!",
        currentMessage:messages,
    })
    }catch(error){
        console.log("Error",error);
         return res.status(500).json({
            success:false,
            message:"Error While Fetching The Notification! ",
            error:error.message
         })
    }
}

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params; // Extract the notificationId from URL params

    if (!notificationId) {
      return res.status(401).json({
        success: false,
        message: "Please Provide The Data",
      });
    }
    const notificationObjectId = new mongoose.Types.ObjectId(notificationId);

    const markAsReads = await Notification.findByIdAndUpdate(
      notificationObjectId, 
      { isRead: true },
      { new: true } 
    );

    if (!markAsReads) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    console.log("Read the message:", markAsReads);
    return res.status(200).json({
      success: true,
      message: "Notification marked as read!",
      messageRead: markAsReads,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      message: "Error while reading the notification!",
      error: error.message,
    });
  }
};

exports.deleteNotification=async(req,res)=>{
    try{
       const {notificationId} = req.params;
       if(!notificationId){
        return res.status(401).json({
            success:false,
            message:"Please Provide The Data!",
        })
       }
       convertTheId = new mongoose.Types.ObjectId(notificationId)
       const deleteNotify = await Notification.findByIdAndDelete(
        convertTheId
        ,{
        new:true,
       });
       console.log("delete message",deleteNotify);
       return res.status(200).json({
        success:true,
        message:"Successfullly deleted the message",
        deleteMessage:deleteNotify
       })
    }catch(error){
        console.log("Error",error);
         return res.status(500).json({
            success:false,
            message:"Error While Deleting The Notification! ",
            error:error.message
         })
    }
}