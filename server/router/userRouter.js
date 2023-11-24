const  express = require('express');
const userRouter = express.Router();
const {signup, login,protectRoute,updatename,updatepassword,logout, getuser,updateavatar, getOnlineUsers, changeUserStatus, getLobbyUsers, getuserbyusername,forgotpassword,resetpassword,emailverification} = require('../controller/user');
const {sendinvite} = require("../controller/chatControl");
const { reset } = require('nodemon');

userRouter
.route('/signup')
.post(signup);

userRouter
.route('/login')
.post(login);

userRouter
.route('/forgotpassword')
.post(forgotpassword);

userRouter
.route('/resetpass')
.patch(resetpassword);

userRouter
.route('/emailverification')
.post(emailverification);

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
.route("/sendinvite")
.post(sendinvite);

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