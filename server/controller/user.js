const  express = require('express');
const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY;
const bcrypt = require('bcryptjs');

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
        return res.json({success: true});
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}

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
        const authtoken = jwt.sign({payload: uid}, jwt_key);
        res.cookie('isloggedin',authtoken,{httpOnly:true});
        return res.json({ success: true})
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}

module.exports.updatename = async(req, res)=>{
    try{
        const {name} = req.body;
        const user = await userModel.findById({_id:req.id});
        user.name = name;
        const updatedData = await userModel.updateOne({_id:id},user,{new:true});
        return res.json({ success: true})
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}

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
            const updatedData = await userModel.updateOne({_id:id},user,{new:true});
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

module.exports.updateavatar = async(req, res)=>{
    try{
        const {avatar} = req.body;
        const user = await userModel.findById({_id:req.id});
        user.image = avatar;
        const updatedData = await userModel.updateOne({_id:id},user,{new:true});
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

module.exports.logout = function logout(req,res)
{
    res.cookie('isloggedin','',{maxAge:1});
    res.json({ success: true});
}

//protect route
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
                req.role = user.role;
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
                success: false
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