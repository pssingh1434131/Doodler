// Import the Mongoose library
const mongoose = require('mongoose');

const onlineusers = mongoose.Schema({
    username:{
        type:String,
        required:true,  // Indicates that 'username' field is mandatory
        unique:true,    // Ensures uniqueness of 'username'
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'busy', 'lobby'],  // Specifies allowed values for 'status'
    },
})

// Create a Mongoose model based on the defined schema
const onlineUsers = mongoose.model('onlineStatus',onlineusers);

// Export the onlineUsers model for use in other files
module.exports = onlineUsers;