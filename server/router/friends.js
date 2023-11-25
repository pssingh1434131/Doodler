// Import necessary modules
const  express = require('express');
// Create an instance of Express Router
const friendRouter = express.Router();

// Import user controller for route protection
const {protectRoute} = require('../controller/user');

// Import friend-related controller functions
const {getFriends, sendFriendRequest, receiveFriendRequest, deleteFriendRequest, acceptFriendreq, deleteFriendship} = require('../controller/friendControl');

// Middleware to protect routes using a user authentication function
friendRouter.use(protectRoute);

// routes for getting a user's friends
friendRouter
.route('/getFriends')
.get(getFriends);

// route for sending a friend request
friendRouter
.route('/sendRequest')
.post(sendFriendRequest);

//  route for retrieving received friend requests
friendRouter
.route('/receivedRequest')
.get(receiveFriendRequest);

//  route for deleting a friend request
friendRouter
.route('/deleteRequest')
.delete(deleteFriendRequest);

// route for deleting a friendship
friendRouter
.route('/deleteFriend')
.delete(deleteFriendship);

// route for accepting a friend request
friendRouter
.route('/acceptRequest')
.post(acceptFriendreq);

// Export the configured friendRouter for use in other files
module.exports = friendRouter;