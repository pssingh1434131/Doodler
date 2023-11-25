const mongoose = require('mongoose');

// Define the structure of the friendship schema using Mongoose Schema
const friendSchema = new mongoose.Schema({
    person1:{
        type:String,
        required:true
    },
    person2:{
        type: String,
        required: true
    },
});

const friendship = mongoose.model('friendship', friendSchema);

// Export the friendship model for use in other files
module.exports = friendship;
