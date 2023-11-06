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