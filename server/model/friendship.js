const mongoose = require('mongoose');

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

module.exports = friendship;
