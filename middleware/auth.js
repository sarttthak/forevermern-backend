// import jwt from "jsonwebtoken";

// const authUser=async(req,res,next)=>{
//     const {token}=req.headers;

//     if(!token){
//         return res.json({success:false, message:"not authorised, login again"})
//     }

//     try {
//         const token_decode=jwt.verify(token,process.env.JWT_SECRET)
//         req.body.userId=token_decode.id 
//         next()
//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:error.message})
//     }


// }

// export default authUser

import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Initialize req.body if it doesn't exist (for GET requests)
        if (!req.body) {
            req.body = {};
        }
        
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authUser;