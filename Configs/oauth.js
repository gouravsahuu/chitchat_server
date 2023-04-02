require("dotenv").config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
const client_id = process.env.googleClientId;
const client_key = process.env.googleClientKey;
const { v4: uuidv4 } = require('uuid');



passport.use(new GoogleStrategy({
    clientID: client_id,
    clientSecret: client_key,
    callbackURL: "https://wild-gray-gorilla-garb.cyclic.app/auth/google/callback",
    passReqToCallback: true
  },
  function(accessToken, refreshToken, profile, cb) {
//     console.log(profile);
    // const user_email = profile.__json.email;
    //create user by user model
    //password : uuidv4();
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
   
    
    return cb(null,profile);
  }
));

module.exports = passport;
