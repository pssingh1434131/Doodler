const  express = require('express');
const friendRequest = require('../model/friendRequest');
const friendship = require('../model/friendship')

module.exports.getFriends = async(req, res)=>{
    try{
        const user = req.user;
        const friendlist = await friendship.find({
            $or: [
              { person1: user.username },
              { person2: user.username }
            ]
          });
        return res.json({success: true, friendlist});
    }
    catch(err){
        return res.status(400).json({success: false});
    }
}

module.exports.sendFriendRequest = async(req, res)=>{
    try{
        let touser = req.body.to;
        let fromuser = req.user.username;
        const request = await friendRequest.create({from: fromuser, to: touser});
        return res.json({success:true, request});
    }catch(err){
        return res.status(400).json({success: false});
    }
}

module.exports.receiveFriendRequest = async(req, res)=>{
    try{
        let user = req.user.username;
        const receivedRequest = await friendRequest.find({to:user});
        receivedRequest.sort((a, b) => new Date(b.date) - new Date(a.date));
        return res.json({success:true, receivedRequest});
    }catch(err){
        return res.status(400).json({success: false});
    }
}

module.exports.deleteFriendRequest = async(req, res)=>{
    try{
        let id = req.body.id;
        const deletereq = await friendRequest.findByIdAndDelete(id);
        return res.json({success:true});
    }catch(err){
        return res.status(400).json({success: false});
    }
}

module.exports.deleteFriendship = async(req, res)=>{
    try{
        let id = req.body.id;
        const deletefriend = await friendship.findByIdAndDelete(id);
        return res.json({success:true});
    }catch(err){
        return res.status(400).json({success: false});
    }
}

module.exports.acceptFriendreq = async (req, res) => {
    try {
        let id = req.body.id;
        const deletereq = await friendRequest.findByIdAndDelete(id);
        
        const friends = await friendship.create({ person1: deletereq.from, person2: deletereq.to });
        
        return res.json({ success: true, friends });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ success: false });
    }
};
