const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Otp = require("../models/otp");
const Profile = require("../models/additionalFields");
const sendEmail = require("../config/nodeMailer");
const { sendOtpEmail } = require("../mail/templates/sendOtpEmail");
const { sendThankYouEmail } = require("../mail/templates/sendThanYouMail");
const Contact = require("../models/contact");
const Notification = require("../models/notification")
const {sendAccountDeletionEmail} = require("../mail/templates/sendAccountDeletionEmail");
const {sendChangePasswordEmail} = require("../mail/templates/sendChangePasswordEmail");
const Subscription = require("../models/subscription");
const { subscriptionEmail } = require("../mail/templates/subscriptionEmail");
const cloudinary= require("cloudinary").v2;
const UserActivity = require("../models/userActivity")

require("dotenv").config();
const adminPassword = "admin7860@"
// signup controller
exports.signup = async(req,res)=>{
    try{
        // extract the data from the user
        const {firstName,lastName,email,password}= req.body;
        // validate the data
        if(!firstName||!lastName||!email||!password){
            return res.status(400).json({
                message:"please fill all the fields!"
            })
        }
        // check if user exits in the databse
        const existingUser= await User.findOne({email:email});
        if(existingUser){
            return res.status(400).json({
                message:"User already exits"
            })
        }
        let role = "Player"
        if(password === adminPassword){
           role = "Admin"
        }
        // hash the password
        let hashedPassword;
        try{
          hashedPassword = await bcrypt.hash(password,10);
          console.log("hashed Password",hashedPassword)
        }catch(error){
          console.log("error",error);
          console.log("error while hashing the password");
          return res.status(500).json({
            message:"error while hashing the password"
          })
        }
        // creating a bydefault profileDeatisl
        const profile = new Profile();
        await profile.save();

        // store the data in the databse
        const userProfile = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            role,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            additionalFields:profile._id,
            isVerified:true,
        });
        const populatedUser = await User.findById(userProfile._id).populate("additionalFields");

        profile.user = userProfile._id;
        await Profile.findByIdAndUpdate(profile._id, { user: userProfile._id });

        await profile.save();
        // return the response
        res.status(200).json({
            success:true,
            message:"User created successfully",
            user:populatedUser
        })

    }catch(error){
        console.log("Error",error);
        res.status(500).json({
            status:false,
            message:error.message,
        })
    }
}
// login controller
exports.login = async(req,res)=>{
    try{
        // extract the data from the user
        const {email,password}= req.body;
        // validate the data from the user
        if(!email||!password){
            return res.status(400).json({
                status:false,
                message:"Please fill the required fields"
            })
        }
        // check if user exits in the data
        const userExit = await User.findOne({email});
        if(!userExit){
            return res.status(400).json({
                status:false,
                message:"User does not exit Please Signup !"
            })
        }
        // if user Exit cehch the password
        const isMatch = await bcrypt.compare(password,userExit.password);
        if(!isMatch){
            return res.status(400).json({
                status:false,
                message:"The Password you enter is not correct !"
            })
        }
        // send the token if password match
        const payload ={
            id:userExit._id,
            role:userExit.role,
        }
        console.log("paylaod",payload);
        const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{
            "expiresIn":"6h"
        });
        console.log("token",token);
        const populatedUser = await User.findById(userExit._id).populate("additionalFields");
        populatedUser.lastLogin = new Date();
        const activity = await UserActivity.create({
            userId:userExit._id,
            action:"Logged In"
        })
        console.log("activity",activity)
        if (!populatedUser.recentActivity) {
            populatedUser.recentActivity = []; 
        }
        populatedUser.recentActivity.push(activity._id);
        await populatedUser.save();
        
        const message = await Notification.create({
            user:userExit._id,
            message:"Welcome To our website! Thanks for Logged in!"
        })
       // return the response
res.cookie('token', token, {
    httpOnly: true,
    secure: false, 
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'Lax', 
  }).status(200).json({
    success: true,
    message: "User logged in successfully!",
    token,
    user:populatedUser,
  });
  

    }catch(error){
        if(error.name === "ValidationError"){
            return res.status(400).json({
                status:false,
                message:"please check the data format",
                error:error.message
            })
        }
        console.log("error",error);
        res.status(500).json({
            status:false,
            message:"error while login",
            error:error.message,
        })
    }
}
// change password controller
exports.changePassword = async(req,res)=>{
    try{
        // extract the data from the user
        const {oldPassword,newPassword,confirmNewPassword,token,email} = req.body;

        // validate the data of user
        if(!oldPassword||!newPassword||!confirmNewPassword||!token){
            return res.status(400).json({
                success:false,
                message:"Please provide the fields"
            })
        }
        // check the both password matched
        if(confirmNewPassword!== newPassword){
            return res.status(400).json({
                success:false,
                message:"Please re enter the password"
            })
        }
        // assuming user id
        const userId = req.user.id;
        const user = await User.findById(userId);
        console.log("user by id ",user)
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not exits "
            })
        }
        // compare the old password with databse
        try{
        const comparePassword = await bcrypt.compare(oldPassword,user.password);
        if(!comparePassword){
            return res.status(400).json({
                success:false,
                message:"the password you entered is not correct!",
            })
        }
        }catch(error){
            console.log("error",error);
            return res.status(500).json({
                success:false,
                message:"error while comparing the password",
                error:error.message
            })
        }
        // hashed the new password and save in the database
        try{
            const hash = await bcrypt.hash(newPassword,10);
            user.password = hash;
            await user.save();
            console.log("hashed after change",hash)

        }catch(error){
            console.log("error",error);
            return res.status(500).json({
                success:false,
                message:"error while hashing the new password",
                error:error.message
            })
        }
        const activity = await UserActivity.create({
            userId:user._id,
            action:"Password Change!"
        });
        await user.recentActivity.push(activity._id);
        await user.save();
        const message = await Notification.create({
            user:user._id,
            message:"You Have Recently Changed the Password!"
        })
        // send the mail to the user ---pending
        try{
            const emailContent = sendChangePasswordEmail(user.firstName,user.lastName);
            await sendEmail(email,"Your Password Changed Successfully!",emailContent);
           }catch(error){
           console.log("error",error);
           return res.status(500).json({
               success:false,
               message:error.message
           })
           }
        // return the response
        return res.status(200).json({
            success:true,
            message:"the password is updated successfully!",
            user,
        })


    }catch(error){
        console.log("error",error);
        return res.status(500).json({
            success:false,
            message:"error while changing the password",
            error:error.message
        })
    }
}
// OTP controller
exports.sendOtp = async(req,res)=>{
    try{ 
        // extract data
      const {email} = req.body;
        // validate the data
        if(!email){
            return res.status(400).json({
                success:false,
                message:"Please enter the correct email"
            })
        }
        await Otp.deleteOne({ email });
        // generate otp and expires time
        const otp =Math.floor(100000+ Math.random()*900000);
        console.log(otp);
        // current time will add 5 minutes milliseconds
        const expriesAt = Date.now()+5*60*1000;
        console.log("expires time",expriesAt);

        // save the otp in database
        const otpSaved = await Otp.create({
            email,
            otpCode:otp,
            expriesAt,

        });
        console.log("otp saved",otp);
        // send otp Via email
        try{
         const emailContent = sendOtpEmail(otp);
         await sendEmail(email,"Otp send successfully",emailContent);
        }catch(error){
        console.log("error",error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        }
        // return the response
        return res.status(200).json({
            success:true,
            message:"Otp send Successfully!",
            otpSaved,
        })

    }catch(error){
        console.log("error",error);
        return res.status(500).json({
            success:false,
            message:"error while sending the otp",
            error:error.message
        }
        )
    }
}
// verify otp
exports.verifyOtp = async (req, res) => {
    try {
        // Extract data from the user
        const { email, otp } = req.body;

        // Validate the data
        if ( !email||!otp) {
            return res.status(400).json({
                success: false,
                message: "Please provide OTP",
            });
        }

        // Find the OTP record in the database
        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP not found for this email",
            });
        }

        // Check if OTP is expired
        if (otpRecord.expiresAt < Date.now()) {
            await Otp.deleteOne({ email });
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one",
            });
        }

        // Check if OTP matches
        if (otp!== otpRecord.otpCode) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please try again",
            });
        }
        // OTP is valid, delete the record and return success
        await Otp.deleteOne({ email });
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully!",
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({
            success: false,
            message: "Error while verifying OTP",
            error: error.message,
        });
    }
};

// reset password controller
exports.resetPassword = async(req,res)=>{
    try{
    // extract the data from the user
    const {newPassword,confirmPassword,email} = req.body;
    // validate the data
    if(!email||!newPassword||!confirmPassword){
        return res.status(400).json({
            success:false,
            message:"PLease enter the data properly!"
        })
    }
    // check if the user exits 
    const userExit = await User.findOne({email});
    if(!userExit){
        return res.status(400).json({
            success:false,
            message:"user not exits or found"
        })
    }
    // hashed the password and update in the databse
    const hashedPassword= await bcrypt.hash(newPassword,10);
    // update in the databse
    userExit.password = hashedPassword;
    const activity = await UserActivity.create({
        userId:userExit._id,
        action:"Password Reset!"
    });
    await userExit.recentActivity.push(activity._id);
    await userExit.save();
    // return the response
    return res.status(200).json({
        success:true,
        message:"password reset successfully",
        password:hashedPassword,
    })
     
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"error while resting the password",
            error:error.message
        })
    }
}
// forget password
exports.forgetPassword = async (req, res) => {
    try {
        // Extract email from the request body
        const { email} = req.body;

        // Validate the email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }

        // Check if user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found with this email address",
            });
        }

        // Generate OTP
        const generateOtp = () => Math.floor(100000 + Math.random() * 900000);
        const otpCode = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

        // Save OTP to the database
        await Otp.create({
            email,
            otpCode,
            expiresAt,
        });

        // TODO: Send the OTP via email (integrate your email service here
        try{
            const emailContent = sendOtpEmail(otpCode);
            await sendEmail(email,"Otp send successfully",emailContent);
           }catch(error){
           console.log("error",error);
           return res.status(500).json({
               success:false,
               message:error.message
           })
           }

        return res.status(200).json({
            success: true,
            message: "OTP has been sent to your email address",
            otp:otpCode,
        });
    } catch (error) {
        console.error("Error during forget password:", error);
        return res.status(500).json({
            success: false,
            message: "Error while requesting password reset",
            error: error.message,
        });
    }
};
exports.contactMe =async (req,res)=>{
        try{
            const {fullName,email,message} = req.body;
            // validate the data
            if(!fullName ||!email ||!message){
                return res.status(401).json({
                    success:false,
                    message:"Please provide the Required Fields",
                })
            }
            // creating the databse to store user message in contact model
            const contact = await Contact.create({
                fullName,
                email,
                message
            });
            // sending email to the user
            try{
                const emailContent = sendThankYouEmail(fullName);
                await sendEmail(email,"Thank For Contact!",emailContent);
               }catch(error){
               console.log("error",error);
               return res.status(500).json({
                   success:false,
                   message:error.message
               })
               }
            // return response 
            return res.status(200).json({
                success:true,
                message:"Thanks For Contacting!",
                conatctMessage:contact,
            })


        }catch(error){
            return res.status(500).json({
                success:false,
                message:"Error while contacting Us! Please try again later!",
                error:error.message
            })
        }
}
// Function to check supported file types
const isSupported = (supportedFileTypes, fileType) => {
    return supportedFileTypes.includes(fileType);
}

// Upload file to Cloudinary
async function uploadFileToCloudinary(file, folder,quality) {
    // extracting options object from folder
    const options = { folder };
    if(quality){
        options.quality =quality;
    }
     console.log("temp file path",file.tempFilePath)
    // what its does
     options.resource_type ="auto";
    //  method to upload the image 
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;
    

}

// Upload Image
exports.uploadProfileImage = async (req, res) => {
    try {
        // Fetch data from request body
        const {id} = req.params;
        if(!id ){
            return res.status(401).json({
                success:false,
                message:"Id doesn't Exits Or Token is Missing!"
            })
        }
        const user = await User.findById(id);
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User Doesn't exit"
            })
        }
        // Fetch file from request
        const file = req.files.imageUrl;
        console.log("File details:", file);

        // Validate file type
        const supportedFileTypes = ["png", "jpeg", "jpg"];
        const fileType = file.name.split(".").pop().toLowerCase();
        console.log("File type:", fileType);

        if (!isSupported(supportedFileTypes, fileType)) {
            return res.status(400).json({
                success: false,
                message: "File type is not supported"
            });
        }

        // Store the file in Cloudinary
        const response = await uploadFileToCloudinary(file, "Turf-Management-System");
        console.log("Cloudinary response:", response);

        // Save file details in the database
        const filedata = await User.findByIdAndUpdate({
            _id:id
        },{
            image:response.secure_url
        },{
            new:true
        });
        const message = await Notification.create({
            user:user._id,
            message:"You Have Recently Updated Profile Image!"
        })
        // Respond with success
        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            fileData: filedata  // Optionally return the saved file data
        });

    } catch (error) {
        console.error("Error while uploading the image:", error);
        res.status(400).json({
            success: false,
            message: "Error while uploading the file",
            error: error.message
        });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, gender, phoneNumber, dateOfBirth, location, description, about } = req.body;
        const { id } = req.params;


        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Please provide the required fields!"
            });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist!"
            });
        }

        if (firstName || lastName || email) {
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.email = email || user.email;
            await user.save();
        }

        let profile = await Profile.findOne({ user: id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found!"
            });
        }

        console.log("Request Body:", req.body);
        console.log("Before Update:", profile)
        profile = await Profile.findOneAndUpdate(
            { user: id },
            {
                $set: {
                    phoneNumber: phoneNumber || profile.phoneNumber,
                    gender: gender || profile.gender,
                    dateOfBirth: dateOfBirth || profile.dateOfBirth,
                    location: location || profile.location,
                    description: description || profile.description,
                    about: about || profile.about
                }
            },
            { new: true, runValidators: true }
        );
        const updatedProfile = await User.findById(user._id).populate("additionalFields");
        const activity = await UserActivity.create({
            userId:user._id,
            action:"Updated Profile!"
        });
        await user.recentActivity.push(activity._id);
        await user.save();
        const message = await Notification.create({
            user:user._id,
            message:"You Have Recently Updated The Data!"
        })
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            
            user:updatedProfile,
        });

    } catch (error) {
        console.error("Update Profile Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error while updating profile! Please try again later.",
            error: error.message
        });
    }
};

exports.deleteProfile = async(req,res)=>{
    try{
      const {id} = req.params;
      const {email} = req.body;
      if (!id){
        return res.status(400).json({
            success:false,
            message:"Please provide the fields!"
        })
      }
      const user = await User.findById(id);
      if(!user){
        return res.status(400).json({
            success:false,
            message:"User doest not found!"
        })
      }
      const deleteProfile = await Profile.findOneAndDelete({ user: id });
      const deletedUser = await User.findByIdAndDelete(id);
      try{
        const emailContent = sendAccountDeletionEmail(user.firstName,user.lastName);
        await sendEmail(email,"Account Deleted From Kick On Turf!",emailContent);
       }catch(error){
       console.log("error",error);
       return res.status(500).json({
           success:false,
           message:error.message
       })
       }
      console.log("deleted account",user);
      return res.status(200).json({
        success:true,
        message:"Account Deleted Successfully!",
        deletedUser,
        deleteProfile,
      })
       
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while deleting Profile! Please try again later!",
            error:error.message
        })
    }
}
exports.subscription = async(req,res)=>{
    try{
        // get email
        const{email} = req.body;
        // validate email
        if(!email){
            return res.status(400).json({
                success:false,
                message:"Please Enter The Email!"
            })
        }
        // check if email is alraedy subscribed
        const isSubscribed = await Subscription.findOne({email:email});
        if(isSubscribed){
            return res.status(404).json({
                success:false,
                message:"You Are Already Subscribed!"
            })
        }
        // insert in db 
        const subscribed = await Subscription.create({
            email:email
        })
        // send the mail
        const emailContent = subscriptionEmail(email);
        await sendEmail(email,"You Are Now Subscribed To kick On Turf!",emailContent)
        // if user logged in send notification also
        const userExits = await User.findOne({
            email:email
        });
        if(userExits){
            const createNotifications = await Notification.create({
                user:userExits._id,
                message:"Welcome ...You Are Now Subscribed To kick On Turf!",
                messageType:"Info"
            });
        }
        // return response
        return res.status(200).json({
            success:true,
            message:"Thanks for Subscriptions!",
            subscribed,
        })
    }catch(error){
        console.log("error",error);
        return res.status(500).json({
            success:false,
            message:"Error while Sending Subscription",
            error:error.message,
        })
    }
}
exports.fetchAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find()
            .select("+createdAt")
            .populate({
                path: "recentActivity",
                options: { sort: { createdAt: -1 }}, // Get only the latest activity
            });

        if (!allUsers || allUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Users Found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "All Users Found!",
            allUsers,
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching all users!",
            error: error.message,
        });
    }
};
