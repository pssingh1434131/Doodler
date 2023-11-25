const express = require('express');
const chatModel = require('../model/chatModel');

// Retrieve messages between 'to' and 'from' users
module.exports.getmessages = async (to, from) => {
    try {
        const msgs = await chatModel.find({
            $or: [
                { to: to, from: from },
                { to: from, from: to }
            ]
        });
        msgs.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort messages by date
        return { success: true, data: msgs };
    }
    catch (err) {
        return { success: false, data: [] };
    }
}

// Send messages from 'from' user to 'to' user
module.exports.sendmessages = async (to, from, msg) => {
    try {
        const sentmsg = await chatModel.create({ from: from, to: to, msg: msg.msg });
        return { success: true, data: msg };
    }
    catch (err) {
        return { success: false, data: null };
    }
}

// Send invitation messages
module.exports.sendinvite = async (req, res)=>{
    try{
        const sentmsg = await chatModel.create(req.body);
        return res.json({success:true});
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}