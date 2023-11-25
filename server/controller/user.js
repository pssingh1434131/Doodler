// Import required modules and packages
const userModel = require('../model/userModel');
const onlineUsers = require('../model/onlineUsers');
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY;     // Secret key for JWT
const bcrypt = require('bcryptjs');      // Password hashing library
const {sendmail} = require('./helper');  // Helper function to send emails

// Function to generate a random string of a specified length
async function generateRandomString(length) {
    const cryptoRandomString = await import('crypto-random-string');
    return cryptoRandomString.default({ length: length });
}

// Function to handle forgot password logic
module.exports.forgotpassword = async(req,res) => {
    try {                                            // Logic to generate OTP and send it via email for password reset
        const {email} = req.body;
        const find = await userModel.findOne({email: email});
        if(find) {
            let otp = await generateRandomString(6);
            let data = await sendmail(email,'Reset Password','Otp for reset password is  '+otp);
            if(data.success) {
                res.json({success:true,otp:otp});
            }
            else {
                res.status(400).json({success: false,msg:data.msg});
            }
        }
        else {
            res.status(400).json({success: false,msg:'invalid credentials'});
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({success: false,msg:'error in forgot password'});
    }
}

// Function to reset password
module.exports.resetpassword = async(req,res) => {
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email:email});
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);
        user.password = secPass;
        const updatedData = await user.save();
        res.json({success:true});
    } catch (err) {
        res.status(400).json({success: false,msg:'error in reseting password'});
    }
}

// Function to handle email verification
module.exports.emailverification = async(req,res) => {
    try {                                                       // Logic to generate and send an OTP for email verification
        const {email} = req.body;
        let otp = await generateRandomString(6);
        // console.log(otp);
        let data = await sendmail(email,'Email Verification','Otp for email verification is  '+otp);
        res.json({success:true,otp:otp});
    } catch (err) {
        res.status(400).json({success: false,msg:'error in reseting password'});
    }
}

// Function to handle user signup
module.exports.signup = async(req, res)=>{
    try{
        const {name, username, email, password} = req.body;
        const find = await userModel.findOne({email: email});
        if(find)
        {
            return res.status(400).json({success: false});
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);
        const user = await userModel.create({name: name, username: username, email: email, password: secPass});
        const userstatus = await onlineUsers.create({username:username, status:'offline'});
        return res.json({success: true});
    }
    catch(err){
        console.log(err);
        return res.status(400).json({success: false});
    }
}

// Function to handle user login
module.exports.login = async(req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email: email});
        if(!user){
            return res.status(400).json({success: false});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success:false});
        }
        const uid = user['_id'];
        const authtoken = jwt.sign({ payload: uid }, jwt_key, {
            expiresIn: '30d',
          });
          res.cookie('isloggedin', authtoken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        var userstatus = await onlineUsers.findOne({username:user.username})
        if(!userstatus)
        {
            userstatus = await onlineUsers.create({username:user.username, status:'offline'});
        }
        userstatus.status = 'online';
        userstatus = await userstatus.save();
        return res.json({ success: true, user: {name:user.name, username: user.username, email:user.email, image: user.image},token:authtoken});
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}

// Function to update user's name
module.exports.updatename = async(req, res)=>{
    try{
        const {name} = req.body;
        const user = await userModel.findById({_id:req.id});
        user.name = name;
        const updatedData = await user.save();
        return res.json({ success: true})
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}

// Function to update user's password
module.exports.updatepassword = async(req, res)=>{
    try{
        const {oldpassword,newpassword} = req.body;
        const user = await userModel.findById({_id:req.id});
        const passwordCompare = await bcrypt.compare(oldpassword, user.password);
        if(passwordCompare)
        {
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(newpassword, salt);
            user.password = secPass;
            const updatedData = await user.save();
        }
        else{
            return res.status(400).json({ success: false});
        }
        return res.json({ success: true});
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}

// Function to update user's avatar
module.exports.updateavatar = async(req, res)=>{
    try{
        const {avatar} = req.body;
        const user = await userModel.findById({_id:req.id});
        user.image = avatar;
        const updatedData = await user.save();
        return res.json({ success: true});
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}


module.exports.getuser = async(req, res)=>{
    try{
        const user = await userModel.findById({_id:req.id});
        return res.json({ success: true,user:user});
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}

// Function to get user by username
module.exports.getuserbyusername = async(username)=>{
    try{
        const user = await userModel.findOne({username:username});
        return { success: true,user:user};
    }
    catch(err){
        return {success: false,user:null};
    }
}

module.exports.logout = async function logout(req,res)
{
    const user = req.user;
    const newstatus = await onlineUsers.updateOne({username: user.username}, {status: 'offline'});
    res.cookie('isloggedin','',{maxAge:0});
    return res.json({ success: true});
}

//protect route: Middleware to protect routes and handle user authentication
module.exports.protectRoute = async function protectRoute(req,res,next)
{
    try{
        let token;
        if(req.cookies.isloggedin)
        {
            token = req.cookies.isloggedin;
            let payload=jwt.verify(token,jwt_key);
            if(payload)
            {
                const user = await userModel.findById(payload.payload);
                req.id = user.id;
                req.user=user;
                next();
            }
            else{
                return res.status(400).json({
                    message:"user not verified",
                    success: false
                })
            }
        }
        else{
            return res.status(400).json({
                message:"please login again",
                success: false,
                loggedout:true
            })
        }
    }
    catch(err)
    {
        return res.status(400).json({
            message:err.message,
            success: false
        })
    }
}

//Function to get online users
module.exports.getOnlineUsers = async(req, res)=>{
    try{
        const onlineuser = await onlineUsers.find({status:'online'});
        return res.json({success:true, onlineuser});
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}

// Function to get lobby users
module.exports.getLobbyUsers = async(req, res)=>{
    try{
        const lobbyuser = await onlineUsers.find({status:'lobby'});
        return res.json({success:true, lobbyuser});
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}

// Function to change user status
module.exports.changeUserStatus = async(req,res)=>{
    try{
        const status = req.body.status;
        const user = req.user;
        const newstatus = await onlineUsers.updateOne({username: user.username}, {status: status});
        return res.json({success:true});
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}