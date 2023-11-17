const mongoose = require('mongoose');

const onlineusers = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'busy', 'lobby'],
    },
})

const onlineUsers = mongoose.model('onlineStatus',onlineusers);

module.exports = onlineUsers;