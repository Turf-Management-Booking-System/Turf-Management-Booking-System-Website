const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Otp = require("../models/otp");
const Profile = require("../models/additionalFields");
const sendEmail = require("../config/nodeMailer");
const { sendOtpEmail } = require("../mail/templates/sendOTPEmail");
const { sendThankYouEmail } = require("../mail/templates/sendThanYouMail");
const Contact = require("../models/contact");
const Notification = require("../models/notification")
const {sendAccountDeletionEmail} = require("../mail/templates/sendAccountDeletionEmail");
const {sendChangePasswordEmail} = require("../mail/templates/sendChangePasswordEmail");
const Subscription = require("../models/subscription");
const { subscriptionEmail } = require("../mail/templates/subscriptionEmail");
const cloudinary= require("cloudinary").v2;
const UserActivity = require("../models/userActivity");
const Comment = require("../models/comment");
const Booking = require("../models/booking")

require("dotenv").config();
const adminPassword = "admin7860@"

exports.signup = async(req,res)=>{
    try{
        const {firstName,lastName,email,password}= req.body;
        if(!firstName||!lastName||!email||!password){
            return res.status(400).json({
                message:"please fill all the fields!"
            })
        }
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
        const profile = new Profile();
        await profile.save();
        const userProfile = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            role,
            image:`https:api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            additionalFields:profile._id,
            isVerified:true,
        });
        const populatedUser = await User.findById(userProfile._id).populate("additionalFields");

        profile.user = userProfile._id;
        await Profile.findByIdAndUpdate(profile._id, { user: userProfile._id });

        await profile.save();
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

exports.login = async(req,res)=>{
    try{
        const {email,password}= req.body;
        if(!email||!password){
            return res.status(400).json({
                status:false,
                message:"Please fill the required fields"
            })
        }
        const userExit = await User.findOne({email});
        if(!userExit){
            return res.status(400).json({
                status:false,
                message:"User does not exit Please Signup !"
            })
        }
        const isMatch = await bcrypt.compare(password,userExit.password);
        if(!isMatch){
            return res.status(400).json({
                status:false,
                message:"The Password you enter is not correct !"
            })
        }
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

exports.changePassword = async(req,res)=>{
    try{
        const {oldPassword,newPassword,confirmNewPassword,token,email} = req.body;
        if(!oldPassword||!newPassword||!confirmNewPassword||!token){
            return res.status(400).json({
                success:false,
                message:"Please provide the fields"
            })
        }
        if(confirmNewPassword!== newPassword){
            return res.status(400).json({
                success:false,
                message:"Please re enter the password"
            })
        }
        const userId = req.user.id;
        const user = await User.findById(userId);
        console.log("user by id ",user)
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not exits "
            })
        }
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

exports.sendOtp = async(req,res)=>{
    try{ 
        const {email} = req.body;
        if(!email){
            return res.status(400).json({
                success:false,
                message:"Please enter the correct email"
            })
        }
        await Otp.deleteOne({ email });
        const otp =Math.floor(100000+ Math.random()*900000);
        console.log(otp);
        const expriesAt = Date.now()+5*60*1000;
        console.log("expires time",expriesAt);
        const otpSaved = await Otp.create({
            email,
            otpCode:otp,
            expriesAt,
        });
        console.log("otp saved",otp);
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
        })
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if ( !email||!otp) {
            return res.status(400).json({
                success: false,
                message: "Please provide OTP",
            });
        }
        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP not found for this email",
            });
        }
        if (otpRecord.expiresAt < Date.now()) {
            await Otp.deleteOne({ email });
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one",
            });
        }
        if (otp!== otpRecord.otpCode) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please try again",
            });
        }
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

exports.resetPassword = async(req,res)=>{
    try{
        const {newPassword,confirmPassword,email} = req.body;
        if(!email||!newPassword||!confirmPassword){
            return res.status(400).json({
                success:false,
                message:"PLease enter the data properly!"
            })
        }
        const userExit = await User.findOne({email});
        if(!userExit){
            return res.status(400).json({
                success:false,
                message:"user not exits or found"
            })
        }
        const hashedPassword= await bcrypt.hash(newPassword,10);
        userExit.password = hashedPassword;
        const activity = await UserActivity.create({
            userId:userExit._id,
            action:"Password Reset!"
        });
        await userExit.recentActivity.push(activity._id);
        await userExit.save();
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

exports.forgetPassword = async (req, res) => {
    try {
        const { email} = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found with this email address",
            });
        }
        const generateOtp = () => Math.floor(100000 + Math.random() * 900000);
        const otpCode = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await Otp.create({
            email,
            otpCode,
            expiresAt,
        });
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
            if(!fullName ||!email ||!message){
                return res.status(401).json({
                    success:false,
                    message:"Please provide the Required Fields",
                })
            }
            const contact = await Contact.create({
                fullName,
                email,
                message
            });
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

const isSupported = (supportedFileTypes, fileType) => {
    return supportedFileTypes.includes(fileType);
}

async function uploadFileToCloudinary(file, folder,quality) {
    const options = { folder };
    if(quality){
        options.quality =quality;
    }
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;
}

exports.uploadProfileImage = async (req, res) => {
    try {
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
        const file = req.files.imageUrl;
        console.log("File details:", file);
        const supportedFileTypes = ["png", "jpeg", "jpg"];
        const fileType = file.name.split(".").pop().toLowerCase();
        console.log("File type:", fileType);
        if (!isSupported(supportedFileTypes, fileType)) {
            return res.status(400).json({
                success: false,
                message: "File type is not supported"
            });
        }
        const response = await uploadFileToCloudinary(file, "Turf-Management-System");
        console.log("Cloudinary response:", response);
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
        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            fileData: filedata
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

exports.deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required!"
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        // Prepare deletion operations that won't fail if collections don't exist
        const deletionOperations = [
            Profile.findOneAndDelete({ user: id }).catch(() => null),
            Comment.deleteMany({ userId: id }).catch(() => ({ deletedCount: 0 })),
            Booking.deleteMany({ userId: id }).catch(() => ({ deletedCount: 0 }))
        ];

        // Execute all deletions in parallel (won't fail if any operation fails)
        const [deleteProfile, deletedComments, deletedBookings] = await Promise.all(deletionOperations);

        // Delete user (main operation)
        const deletedUser = await User.findByIdAndDelete(id);

        // Send email (non-critical operation)
        try {
            const emailContent = sendAccountDeletionEmail(user.firstName, user.lastName);
            await sendEmail(email, "Account Deleted From Kick On Turf!", emailContent);
        } catch (emailError) {
            console.log("Email sending failed (non-critical):", emailError);
        }

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
            details: {
                userDeleted: !!deletedUser,
                profileDeleted: !!deleteProfile,
                commentsDeleted: deletedComments?.deletedCount || 0,
                bookingsDeleted: deletedBookings?.deletedCount || 0
            }
        });

    } catch (error) {
        console.error("Account deletion error:", error);
        return res.status(500).json({
            success: false,
            message: "Error during account deletion",
            error: error.message
        });
    }
};

exports.subscription = async(req,res)=>{
    try{
        const{email} = req.body;
        if(!email){
            return res.status(400).json({
                success:false,
                message:"Please Enter The Email!"
            })
        }
        const isSubscribed = await Subscription.findOne({email:email});
        if(isSubscribed){
            return res.status(404).json({
                success:false,
                message:"You Are Already Subscribed!"
            })
        }
        const subscribed = await Subscription.create({
            email:email
        })
        const emailContent = subscriptionEmail(email);
        await sendEmail(email,"You Are Now Subscribed To kick On Turf!",emailContent)
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
                options: { sort: { createdAt: -1 },limit:3},
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