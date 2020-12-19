const GoogleStratrgy = require('passport-google-oauth20').Strategy;
// const { function } = require('joi');
// const passport = require('passport');
const moogoose = require('mongoose');
const User = require("../models/User");

module.exports = function(passport){
    passport.use(
        new GoogleStratrgy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/user/google/callback',
            },
             (accessToken, refreshToken, profile, done) => {
                //  const newUser ={
                //     googleId:profile.id,
                //     // displayName:profile.displayName,
                //     firstName:profile.name.givenName,
                //     lastName:profile.name.familyName,
                //     image:profile.photos[0].value, 
                //     // email:profile.
                //  }
                //  try{
                //      let user =  User.findOne({googleId:profile.id})
                //     if (user){
                //         done(null,user)
                //     }
                //     else{
                //         user =  User.create(newUser);
                //         done(null,err)
                //     }
                //  }catch(err){
                //      console.log(err);
                //  }
                
                // return done(null,profile);
            }
        )
    )

    passport.serializeUser((user,done)=>{
       done(null, user.id)
    })
    passport.deserializeUser((user,done)=>{
        done(err,user)
        // User.findById(id,(err,user)=> done(err,user))
    })
}