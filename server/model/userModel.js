const mongoose = require('mongoose');
const validator = require("email-validator");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:function(){
            return validator.validate(this.email)
        }
    },
    password:{
        type:String,
        required:true,
    },
})

const userModel = mongoose.model('userModel',userSchema);

module.exports = userModel;