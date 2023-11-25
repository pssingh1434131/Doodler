const mongoose = require('mongoose');

// Define the structure of the game schema using Mongoose Schema
const gameSchema = new mongoose.Schema({
    winner: {
        type: String,
        required: true
    },
    loser: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Create an index on the 'date' field to automatically expire documents after 30 days (2592000 seconds)
gameSchema.index({ date: 1 }, { expireAfterSeconds: 2592000 });

// Create a Mongoose model based on the defined schema
const gameModel = mongoose.model('gameModel', gameSchema);

// Export the gameModel for use in other files
module.exports = gameModel;
