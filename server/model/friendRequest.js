// Import the Mongoose library
const mongoose = require('mongoose');

// Define the structure of the friend request schema using Mongoose Schema
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

// Create a Mongoose model based on the defined schema
const friendRequest = mongoose.model('friendRequest', frndReqSchema);

// Export the friendRequest model for use in other files
module.exports = friendRequest;
