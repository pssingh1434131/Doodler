const  express = require('express');
const userRouter = express.Router();
const {signup, login,protectRoute,updatename,updatepassword,logout, getuser,updateavatar, getOnlineUsers, changeUserStatus, getLobbyUsers, getuserbyusername} = require('../controller/user');

userRouter
.route('/signup')
.post(signup);

userRouter
.route('/login')
.post(login);

userRouter.use(protectRoute);
userRouter
.route('/getuser')
.get(getuser)

userRouter
.route('/getuserbyusername/:username')
.get(getuserbyusername)

userRouter
.route('/updatename')
.patch(updatename)

userRouter
.route('/updatepass')
.patch(updatepassword)

userRouter
.route('/updateavatar')
.patch(updateavatar)

userRouter
.route('/logout')
.post(logout)

userRouter
.route('/getonlineusers')
.get(getOnlineUsers)

userRouter
.route('/getlobbyusers')
.get(getLobbyUsers)

userRouter
.route('/changeuserstatus')
.patch(changeUserStatus)

module.exports = userRouter;