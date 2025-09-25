// import validator from "validator";
// import userModel from "../models/userModel.js";
// import jwt from "jsonwebtoken"
// import bcrypt from "bcrypt"

// const createToken=(id)=>{
//     return jwt.sign({id},process.env.JWT_SECRET)

// }

// const loginUser=async(req,res)=>{

//     try {
//         const {email,password}=req.body;
//         const user=await userModel.findOne({email});

//         if(!user){
//             return res.json({success:false, message:'user doesnt exists'})

//         }

//         const isMatch=await bcrypt.compare(password,user.password);

//         if(isMatch){
//             const token=createToken(user._id)
//             res.json({success:true,token})
//         }
//         else{
//             res.json({success:false,message:'Invalid creds'})
//         }


//     } catch (error) {

//         console.log(error);
//         res.json({success:false,message:error.message})
        
//     }

// }

// const registerUser=async(req,res)=>{
//     try {
//         const {name,email,password}=req.body;

//         const exists=await userModel.findOne({email})
//         if(exists){
//             return res.json({success:false,message:"User already exists"})
//         }

//         if(!validator.isEmail(email)){
//             return res.json({success:false,message:"enter valid email"})
//         }
//         if(password.length<8){
//             return res.json({success:false,message:"enter strong passw"})
//         }


//         const salt =await bcrypt.genSalt(10);
//         const hashedPassword=await bcrypt.hash(password,salt)

//         const newUser=new userModel({
//             name,
//             email,
//             password:hashedPassword
//         })

//         const user=await newUser.save()

//         const token=createToken(user._id)

//         res.json({success:true,token})
        
        
//     } catch (error) {

//         console.log(error);
//         res.json({success:false,message:error.message})
        
//     }

    

// }

// const adminLogin=async(req,res)=>{
//     try {
//         const {email,password}=req.body
//         if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
//             const token=jwt.sign(email+password,process.env.JWT_SECRET);
//             res.json({success:true,token})

//         }
//         else{
//             res.json({success:false,message:"invalid creds"})
//         }
        
//     } catch (error) {

//         console.log(error);
//         res.json({success:false,message:error.message})
        
//     }

// }

// export {loginUser,registerUser,adminLogin}

import validator from "validator";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateOTP, sendVerificationEmail } from "../utils/emailService.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            // Generate new OTP for unverified users
            const otp = generateOTP();
            const expiry = new Date();
            expiry.setMinutes(expiry.getMinutes() + 10); // OTP expires in 10 minutes

            user.verificationOTP = otp;
            user.otpExpires = expiry;
            await user.save();

            // Send verification email
            await sendVerificationEmail(email, otp);

            return res.json({
                success: false,
                requireVerification: true,
                message: 'Account not verified. New OTP has been sent to your email.',
                email
            });
        }

        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = generateOTP();
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 10); // OTP expires in 10 minutes

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            verificationOTP: otp,
            otpExpires: expiry,
            isVerified: false
        });

        await newUser.save();

        // Send verification email
        const emailSent = await sendVerificationEmail(email, otp);

        if (!emailSent) {
            return res.json({ success: false, message: "Failed to send verification email" });
        }

        res.json({
            success: true,
            message: "Registration successful. Please verify your email with the OTP sent.",
            requireVerification: true,
            email
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.isVerified) {
            return res.json({ success: false, message: "Email already verified" });
        }

        if (user.verificationOTP !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (new Date() > user.otpExpires) {
            return res.json({ success: false, message: "OTP expired" });
        }

        // Mark user as verified
        user.isVerified = true;
        user.verificationOTP = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate token for auto-login after verification
        const token = createToken(user._id);
        res.json({ success: true, message: "Email verified successfully", token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.isVerified) {
            return res.json({ success: false, message: "Email already verified" });
        }

        // Generate new OTP
        const otp = generateOTP();
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 10); // OTP expires in 10 minutes

        user.verificationOTP = otp;
        user.otpExpires = expiry;
        await user.save();

        // Send verification email
        const emailSent = await sendVerificationEmail(email, otp);

        if (!emailSent) {
            return res.json({ success: false, message: "Failed to send verification email" });
        }

        res.json({
            success: true,
            message: "New OTP sent successfully"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


const getUserProfile = async (req, res) => {
    try {
        console.log('getUserProfile called, req.body:', req.body);
        const { userId } = req.body;
        console.log('Looking for user with ID:', userId);
        
        const user = await userModel.findById(userId).select('-password -verificationOTP');
        console.log('Found user:', user ? 'User exists' : 'User not found');
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Use stored profile picture or generate one
        let profilePicture = user.profilePicture;
        console.log('Stored profile picture:', profilePicture);
        
        if (!profilePicture) {
            if (user.googleId) {
                // For Google users without stored picture, generate based on name
                profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4285f4&color=ffffff&size=40`;
            } else if (user.githubId) {
                // For GitHub users, try to get avatar by user ID
                profilePicture = `https://avatars.githubusercontent.com/u/${user.githubId}?s=40`;
            } else {
                // For regular users, generate avatar based on name
                profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=000000&color=ffffff&size=40`;
            }
        }

        console.log('Final profile picture URL:', profilePicture);

        const responseData = {
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                profilePicture,
                isGoogleUser: !!user.googleId,
                isGitHubUser: !!user.githubId
            }
        };
        
        console.log('Sending response:', responseData);
        res.json(responseData);
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin, verifyOTP, resendOTP, getUserProfile };


