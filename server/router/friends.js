const  express = require('express');
const friendRouter = express.Router();
const {protectRoute} = require('../controller/user');
const {getFriends, sendFriendRequest, receiveFriendRequest, deleteFriendRequest, acceptFriendreq, deleteFriendship} = require('../controller/friendControl');

friendRouter.use(protectRoute);
friendRouter
.route('/getFriends')
.get(getFriends);

friendRouter
.route('/sendRequest')
.post(sendFriendRequest);

friendRouter
.route('/receivedRequest')
.get(receiveFriendRequest);

friendRouter
.route('/deleteRequest')
.delete(deleteFriendRequest);

friendRouter
.route('/deleteFriend')
.delete(deleteFriendship);

friendRouter
.route('/acceptRequest')
.post(acceptFriendreq);

module.exports = friendRouter;