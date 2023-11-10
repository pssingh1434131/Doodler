const  express = require('express');
const friendRouter = express.Router();
const {protectRoute} = require('../controller/user');
const {getFriends, sendFriendRequest, receiveFriendRequest, deleteFriendRequest} = require('../controller/friendControl');

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

module.exports = friendRouter;