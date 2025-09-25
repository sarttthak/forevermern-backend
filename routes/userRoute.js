// // import express from 'express';
// // import  {loginUser,registerUser,adminLogin} from '../controllers/userController.js'

// // const userRouter=express.Router();

// // userRouter.post('/register',registerUser);
// // userRouter.post('/login',loginUser);
// // userRouter.post('/admin',adminLogin);

// // export default userRouter;

// // import express from 'express';
// // import { loginUser, registerUser, adminLogin, verifyOTP, resendOTP } from '../controllers/userController.js';

// // const userRouter = express.Router();

// // userRouter.post('/register', registerUser);
// // userRouter.post('/login', loginUser);
// // userRouter.post('/admin', adminLogin);
// // userRouter.post('/verify-otp', verifyOTP);
// // userRouter.post('/resend-otp', resendOTP);

// // export default userRouter;


// import express from 'express';
// import { loginUser, registerUser, adminLogin, verifyOTP, resendOTP } from '../controllers/userController.js';
// import { googleCallback, githubCallback } from '../controllers/socialAuthController.js';
// import passport from 'passport';

// const userRouter = express.Router();

// // Regular auth routes
// userRouter.post('/register', registerUser);
// userRouter.post('/login', loginUser);
// userRouter.post('/admin', adminLogin);
// userRouter.post('/verify-otp', verifyOTP);
// userRouter.post('/resend-otp', resendOTP);

// // Google OAuth routes
// userRouter.get('/auth/google', 
//     passport.authenticate('google', { scope: ['profile', 'email'] })
// );
// userRouter.get('/auth/google/callback', googleCallback);

// // GitHub OAuth routes
// userRouter.get('/auth/github',
//     passport.authenticate('github', { scope: ['user:email'] })
// );
// userRouter.get('/auth/github/callback', githubCallback);

// export default userRouter;

import express from 'express';
import { loginUser, registerUser, adminLogin, verifyOTP, resendOTP, getUserProfile } from '../controllers/userController.js';
import { googleCallback, githubCallback } from '../controllers/socialAuthController.js';
import passport from 'passport';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

// Regular auth routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/verify-otp', verifyOTP);
userRouter.post('/resend-otp', resendOTP);
userRouter.get('/profile', authUser, getUserProfile);

// Google OAuth routes
userRouter.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
userRouter.get('/auth/google/callback', googleCallback);

// GitHub OAuth routes
userRouter.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
);
userRouter.get('/auth/github/callback', githubCallback);

export default userRouter;