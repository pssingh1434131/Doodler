// Import required libraries
const mongoose = require('mongoose');
const validator = require("email-validator"); // Library to validate email format

// Define the structure of the user schema using Mongoose Schema
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true,   // Ensures uniqueness of 'username'
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:function(){
            return validator.validate(this.email)   // Validates the email format using the 'email-validator' library
        }
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:'Binx_Bond0.png'   // Sets a default value for 'image'
    }
})

const userModel = mongoose.model('userModel',userSchema);

// Export the userModel for use in other files
module.exports = userModel;