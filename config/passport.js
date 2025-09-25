// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as GitHubStrategy } from 'passport-github2';
// import dotenv from 'dotenv';

// dotenv.config();

// // Configure passport to use Google OAuth
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: `${process.env.BACKEND_URL}/api/user/auth/google/callback`,
//     passReqToCallback: true
//   },
//   (req, accessToken, refreshToken, profile, done) => {
//     // Extract user info from profile
//     const userProfile = {
//       id: profile.id,
//       displayName: profile.displayName,
//       name: profile.name ? `${profile.name.givenName} ${profile.name.familyName}` : profile.displayName,
//       email: profile.emails && profile.emails[0] ? profile.emails[0].value : undefined
//     };
    
//     return done(null, userProfile);
//   }
// ));

// // Configure passport to use GitHub OAuth
// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: `${process.env.BACKEND_URL}/api/user/auth/github/callback`,
//     scope: ['user:email'],
//     passReqToCallback: true
//   },
//   (req, accessToken, refreshToken, profile, done) => {
//     // Extract user info from profile
//     const userProfile = {
//       id: profile.id,
//       displayName: profile.displayName,
//       username: profile.username,
//       email: profile.emails && profile.emails[0] ? profile.emails[0].value : undefined
//     };
    
//     return done(null, userProfile);
//   }
// ));

// // Do not use sessions
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// export default passport;


// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as GitHubStrategy } from 'passport-github2';
// import dotenv from 'dotenv';

// dotenv.config();

// // Configure passport to use Google OAuth
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/api/user/auth/google/callback",
//     passReqToCallback: true
//   },
//   (req, accessToken, refreshToken, profile, done) => {
//     // Extract user info from profile
//     const userProfile = {
//       id: profile.id,
//       displayName: profile.displayName,
//       name: profile.name ? `${profile.name.givenName} ${profile.name.familyName}` : profile.displayName,
//       email: profile.emails && profile.emails[0] ? profile.emails[0].value : undefined
//     };
    
//     return done(null, userProfile);
//   }
// ));

// // Configure passport to use GitHub OAuth
// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: "/api/user/auth/github/callback",
//     scope: ['user:email'],
//     passReqToCallback: true
//   },
//   (req, accessToken, refreshToken, profile, done) => {
//     // Extract user info from profile
//     const userProfile = {
//       id: profile.id,
//       displayName: profile.displayName,
//       username: profile.username,
//       email: profile.emails && profile.emails[0] ? profile.emails[0].value : undefined
//     };
    
//     return done(null, userProfile);
//   }
// ));

// // Do not use sessions
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// export default passport;


import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';

dotenv.config();

// Configure passport to use Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/user/auth/google/callback",
    passReqToCallback: true
  },
  (req, accessToken, refreshToken, profile, done) => {
    // Extract user info from profile
    const userProfile = {
      id: profile.id,
      displayName: profile.displayName,
      name: profile.name ? `${profile.name.givenName} ${profile.name.familyName}` : profile.displayName,
      email: profile.emails && profile.emails[0] ? profile.emails[0].value : undefined,
      picture: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined
    };
    
    return done(null, userProfile);
  }
));

// Configure passport to use GitHub OAuth
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/user/auth/github/callback",
    scope: ['user:email'],
    passReqToCallback: true
  },
  (req, accessToken, refreshToken, profile, done) => {
    // Extract user info from profile
    const userProfile = {
      id: profile.id,
      displayName: profile.displayName,
      username: profile.username,
      email: profile.emails && profile.emails[0] ? profile.emails[0].value : undefined,
      avatar_url: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined
    };
    
    return done(null, userProfile);
  }
));

// Do not use sessions
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport;