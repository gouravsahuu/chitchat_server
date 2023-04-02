const passport = require("./Configs/oauth");
const express = require("express");
const {connection} = require("./Configs/db");
const {userRoute} = require("./Routes/user.routes");
const app = express();
const {UserModel} = require("./Models/user.model");
const jwt = require("jsonwebtoken");
const tokenkey = process.env.tokenkey;
const reftokenkey = process.env.reftokenkey;
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use("/user",userRoute);

app.get("/",(req,res) => {
    // res.redirect(__dirname+"../message/frontend/messagepage.html");
    res.send("Homepage")
})

app.get("/message/frontend/messagepage.html",(req,res) => {
    console.log(__dirname);
    // res.send("hii")

   res.sendFile(path.join(__dirname,"../message/frontend/messagepage.html"));
})


// o auth logic

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', {failureRedirect: '/login', session:false }),
  async function(req, res) {
    // Successful authentication, redirect home.
    // return value will be received here in req.user
    // console.log(req.user);
//      const user = {
//       "email" : profile._json.email,
//       "email_verified" : profile._json.email_verified,
//       "family_name" : profile._json.family_name,
//       "given_name" : profile._json.given_name,
//       "name" : profile._json.name,
//       "picture" : profile._json.picture,
//       "sub" : profile._json.sub,
//     }

    //check if user already exists
    const userExist = await UserModel.find({email:req.user._json.email});
    
    if(userExist.length > 0){
        // console.log("User already exists");
        
        const token = jwt.sign({userID : userExist[0]._id}, tokenkey, { expiresIn: '1h' });
        const reftoken = jwt.sign({userID : userExist[0]._id}, reftokenkey, { expiresIn: '7d' });
        // res.redirect('/');
        // console.log(token,reftoken);
        res.redirect("/message/frontend/messagepage.html");
        // res.send({"message":"Login Successfull","token":token,"refresh_token":reftoken});
    }
    else{
        const new_user = new UserModel(req.user._json);
        await new_user.save();
        // console.log("User created");
        // res.redirect('/');
        res.send({"message":"User Registered Successfully"});
    }
    
  });

app.listen(4500, async () => {
    try{
        await connection;
        console.log("Connected to Database");
    }
    catch(err){
        console.log(err.message);
    }
    console.log("Server is running at port 4500");
})

