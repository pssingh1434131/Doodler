// Import the Mongoose library
const mongoose = require('mongoose');

// Define the structure of the chat schema using Mongoose Schema
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
        default: Date.now    // Sets the default value for the 'date' field as the current date/time
    }
});

// Create a Mongoose model based on the defined schema
const chatModel = mongoose.model('chatModel', chatSchema);

// Export the chatModel for use in other files
module.exports = chatModel;
