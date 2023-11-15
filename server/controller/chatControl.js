const express = require('express');
const chatModel = require('../model/chatModel');

module.exports.getmessages = async (to, from) => {
    try {
        const msgs = await chatModel.find({
            $or: [
                { to: to, from: from },
                { to: from, from: to }
            ]
        });
        msgs.sort((a, b) => new Date(a.date) - new Date(b.date));
        return { success: true, data: msgs };
    }
    catch (err) {
        return { success: false, data: [] };
    }
}

module.exports.sendmessages = async (to, from, msg) => {
    try {
        const sentmsg = await chatModel.create({ from: from, to: to, msg: msg.msg });
        return { success: true, data: msg };
    }
    catch (err) {
        return { success: false, data: null };
    }
}

