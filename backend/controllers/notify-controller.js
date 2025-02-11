const Notification = require("../models/notification")

exports.createNotication =async (req,res)=>{
    try{
    // insert the message to whom user
    const{userId,message}= req.body;
    // validate
    if(!userId||!message){
        return res.status(401).json({
            success:false,
            message:"Insert The Data Properly!"
        })
    }
    // create a new notification 
    const newMessage = await Notification({
        userId,
        message
    });
    console.log("new message",newMessage);
    // return response 
    return res.status(200).json({
        success:true,
        message:"Notification Created Successfully!",
        message:newMessage,
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
    // get id
     const{userId} = req.params;
    //  validate
     if(!userId){
        return res.status(401).json({
            success:false,
            message:"Please Enter The Data Properly"
        })
     }
    //  fetch the message
     const messages = await Notification.find({
        userId
     }).sort({createdAt:-1});
    console.log("fetch messages",messages);
    // return reponse
    return res.status(200).json({
        success:true,
        message:"Fetch The Current message!",
        message:messages,
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
exports.markAsRead=async(req,res)=>{
    try{
        const {notificationId} = req.params;
        if(!notificationId){
            return res.status(401).json({
                success:false,
                message:"Please Provide The Data"
            })
        }
        const markAsReads= await Notification.findByIdAndUpdate({
            notificationId},
        {
            isRead:true,
        },{
            new:true,
        });
        console.log("read the message",markAsReads);
        return res.status(200).json({
            success:true,
            message:"Read the Message!",
            messageRead:markAsReads,
        })

    }catch(error){
        console.log("Error",error);
        return res.status(500).json({
           success:false,
           message:"Error While Reading  The Notification! ",
           error:error.message
        })
    }
}
exports.deleteNotification=async(req,res)=>{
    try{
       const {notificationId} = req.params;
       if(!notificationId){
        return res.status(401).json({
            success:false,
            message:"Please Provide The Data!",
        })
       }
       const deleteNotify = await Notification.findByIdAndDelete(notificationId,{
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