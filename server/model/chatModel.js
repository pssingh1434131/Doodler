const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    from:{
        type:String,
        required:true
    },
    to:{
        type: String,
        required: true
    },
    msg:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const chatModel = mongoose.model('chatModel', chatSchema);

module.exports = chatModel;
