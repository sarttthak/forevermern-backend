// import mongoose from "mongoose";

// const userSchema=new mongoose.Schema({
//     name:{type:String,required:true},
//     email:{type:String,required:true,unique:true},
//     password:{type:String,required:true},
//     cartData:{type:Object,default:{}}
   
// },{minimize:false})

// const userModel= mongoose.model.user || mongoose.model("user",userSchema);

// export default userModel
// ----------------
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     cartData: { type: Object, default: {} },
//     isVerified: { type: Boolean, default: false },
//     verificationOTP: { type: String },
//     otpExpires: { type: Date },
// }, { minimize: false });

// const userModel = mongoose.model.user || mongoose.model("user", userSchema);

// export default userModel;



//-------------------------------------------------
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     cartData: { type: Object, default: {} },
//     isVerified: { type: Boolean, default: false },
//     verificationOTP: { type: String },
//     otpExpires: { type: Date },
// }, { minimize: false });

// const userModel = mongoose.model.user || mongoose.model("user", userSchema);

// export default userModel;


// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     cartData: { type: Object, default: {} },
//     isVerified: { type: Boolean, default: false },
//     verificationOTP: { type: String },
//     otpExpires: { type: Date },
//     // Social auth fields
//     googleId: { type: String },
//     githubId: { type: String },
// }, { minimize: false });

// const userModel = mongoose.model.user || mongoose.model("user", userSchema);

// export default userModel;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String },
    otpExpires: { type: Date },
    // Social auth fields
    googleId: { type: String },
    githubId: { type: String },
    profilePicture: { type: String },
}, { minimize: false });

const userModel = mongoose.model.user || mongoose.model("user", userSchema);

export default userModel;