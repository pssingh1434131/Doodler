const  express = require('express');
const userRouter = express.Router();
const {signup, login,protectRoute,updatename,updatepassword,logout, getuser,updateavatar} = require('../controller/user');

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
.patch(logout)

module.exports = userRouter;