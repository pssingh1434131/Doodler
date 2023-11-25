const  express = require('express');
const gameModel = require('../model/gameHistory');

// Retrieve game history for a user
module.exports.getHistory = async (req, res)=>{
    try{
        const user = req.user;
        let winhistory = await gameModel.find({winner:user.username});
        let losshistory = await gameModel.find({loser:user.username});
        let games = winhistory.concat(losshistory);
        games.sort((a, b) => new Date(b.date) - new Date(a.date));
        return res.json({success: true, games});
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}

// Upload a game result
module.exports.uploadGame = async (req, res)=>{
    try{
        let {winner, loser} = req.body;
        const game = await gameModel.create({winner, loser});
        return res.json({success: true});
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}

// Upload a game result (helper function)
module.exports.uploadgame = async(data)=>{
    try{
        const game = await gameModel.create(data);
        return game;
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}