const mongoose = require('mongoose');

const frndReqSchema = new mongoose.Schema({
    from:{
        type:String,
        required:true
    },
    to:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const friendRequest = mongoose.model('friendRequest', frndReqSchema);

module.exports = friendRequest;
