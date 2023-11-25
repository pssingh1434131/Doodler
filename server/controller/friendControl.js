const  express = require('express');
const friendRequest = require('../model/friendRequest');
const friendship = require('../model/friendship');
const chatModel = require('../model/chatModel');

// Retrieve friends list for a specific user
module.exports.getFriends = async(username)=>{
    try{
        const user = username;
        const friendlist = await friendship.find({
            $or: [
              { person1: user},
              { person2: user}
            ]
          });
        return {success: true, data:friendlist};
    }
    catch(err){
        return {success: false,data: []};
    }
}

// Send a friend request from 'from' user to 'to' user
module.exports.sendFriendRequest = async (to, from)=>{
    try{
        let touser = to;
        let fromuser = from;
        const friends = await friendship.findOne({
            $or: [
              { person1: to,person2:from},
              { person1: from,person2:to}
            ]
        });
        if(friends) return {success:false,msg:`you and ${from} are already friends`,data:[]};
        let request = await friendRequest.findOne({from: fromuser, to: touser});
        if(request){
            request.date = Date.now();
            request.save();
        }
        else request = await friendRequest.create({from: fromuser, to: touser});
        const data = await friendRequest.find({to: touser});
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        return {success:true,data: data,msg:'request is sent'};
    }catch(err){
        return {success: false,data: [],msg:'failed to send request'};
    }
}
// Retrieve friend requests received by a user
module.exports.receiveFriendRequest = async(username)=>{
    try{
        let user = username;
        const receivedRequest = await friendRequest.find({to:user});
        receivedRequest.sort((a, b) => new Date(b.date) - new Date(a.date));
        return {success:true, data: receivedRequest};
    }catch(err){
        return {success: false,data: []};
    }
}

// Delete a specific friend request by its ID
module.exports.deleteFriendRequest = async(id)=>{
    try{
        const deletereq = await friendRequest.findByIdAndDelete(id);
        return {success:true};
    }catch(err){
        return {success: false};
    }
}

// Delete a friendship by its ID and associated chat messages
module.exports.deleteFriendship = async(id)=>{
    try{
        const deletefriend = await friendship.findByIdAndDelete(id);
        const deletemsgs = await chatModel.deleteMany({
            $or: [
              { to: deletefriend.person1 ,from: deletefriend.person2},
              { to: deletefriend.person2 ,from: deletefriend.person1}
            ]})
        return {success:true,data:deletefriend};
    }catch(err){
        return {success: false};
    }
}

// Accept a friend request by deleting it and creating a friendship
module.exports.acceptFriendreq = async (id) => {
    try {

        const deletereq = await friendRequest.findByIdAndDelete(id);
        const friends = await friendship.create({ person1: deletereq.from, person2: deletereq.to });

        return { success: true, data: friends };
    } catch (err) {
        console.error(err);
        return { success: false,data: null };
    }
};
