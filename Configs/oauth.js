require("dotenv").config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
const client_id = process.env.googleClientId;
const client_key = process.env.googleClientKey;




passport.use(new GoogleStrategy({
    clientID: client_id,
    clientSecret: client_key,
   callbackURL: "https://wild-gray-gorilla-garb.cyclic.app/auth/google/callback",
    passReqToCallback: true
  },
  function(accessToken, refreshToken, profile, done) {
//      return cb(null,profile);
//     console.log(profile);
    const user_name = profile["user"]._json.name;
    const user_email = profile["user"]._json.email;
    //create user by user model
    //password : uuidv4();
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
   
    done(null,{user_name,user_email});
    
  }
));

module.exports = passport;
