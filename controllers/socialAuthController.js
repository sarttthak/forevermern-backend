

import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import passport from "passport";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Google Auth Callback
const googleCallback = (req, res) => {
    passport.authenticate('google', { session: false }, async (err, profile) => {
        if (err || !profile) {
            // Redirect to frontend with error
            const frontendUrl = process.env.FRONTEND_URL ;
            return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Google authentication failed')}`);
        }

        try {
            // Check if user exists
            let user = await userModel.findOne({ email: profile.email });

            if (!user) {
                // Create new user if not exists
                user = new userModel({
                    name: profile.displayName || profile.name,
                    email: profile.email,
                    password: 'SOCIAL_AUTH_' + Math.random().toString(36).substring(2),
                    googleId: profile.id,
                    isVerified: true,
                    profilePicture: profile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName || profile.name)}&background=000000&color=ffffff&size=40`
                });
                await user.save();
            } else if (!user.googleId) {
                // Link Google account to existing user
                user.googleId = profile.id;
                user.isVerified = true;
                if (profile.picture) {
                    user.profilePicture = profile.picture;
                }
                await user.save();
            }

            // Generate token and redirect
            const token = createToken(user._id);
            const frontendUrl = process.env.FRONTEND_URL ;
            res.redirect(`${frontendUrl}/login?token=${token}`);
        } catch (error) {
            console.error('Google auth error:', error);
            const frontendUrl = process.env.FRONTEND_URL ;
            res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Server error during authentication')}`);
        }
    })(req, res);
};

// GitHub Auth Callback
const githubCallback = (req, res) => {
    passport.authenticate('github', { session: false }, async (err, profile) => {
        if (err || !profile) {
            // Redirect to frontend with error
            const frontendUrl = process.env.FRONTEND_URL ;
            return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('GitHub authentication failed')}`);
        }

        try {
            // GitHub might not provide email directly, use primary email or username@github
            const email = profile.email || `${profile.username}@github.com`;
            
            // Check if user exists
            let user = await userModel.findOne({ 
                $or: [
                    { email },
                    { githubId: profile.id }
                ] 
            });

            if (!user) {
                // Create new user if not exists
                user = new userModel({
                    name: profile.displayName || profile.username,
                    email,
                    password: 'SOCIAL_AUTH_' + Math.random().toString(36).substring(2),
                    githubId: profile.id,
                    isVerified: true,
                    profilePicture: profile.avatar_url || `https://github.com/${profile.username}.png?size=40`
                });
                await user.save();
            } else if (!user.githubId) {
                // Link GitHub account to existing user
                user.githubId = profile.id;
                user.isVerified = true;
                if (profile.avatar_url) {
                    user.profilePicture = profile.avatar_url;
                }
                await user.save();
            }

            // Generate token and redirect
            const token = createToken(user._id);
            const frontendUrl = process.env.FRONTEND_URL ;
            res.redirect(`${frontendUrl}/login?token=${token}`);
        } catch (error) {
            console.error('GitHub auth error:', error);
            const frontendUrl = process.env.FRONTEND_URL;
            res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Server error during authentication')}`);
        }
    })(req, res);
};

export { googleCallback, githubCallback };