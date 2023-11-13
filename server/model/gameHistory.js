const mongoose = require('mongoose');

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

gameSchema.index({ date: 1 }, { expireAfterSeconds: 2592000 });

const gameModel = mongoose.model('gameModel', gameSchema);

module.exports = gameModel;
