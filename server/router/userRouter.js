const  express = require('express');   // Import necessary modules
const userRouter = express.Router();    // Create an instance of Express Router

// Import user-related controller functions
const {signup, login,protectRoute,updatename,updatepassword,logout, getuser,updateavatar, getOnlineUsers, changeUserStatus, getLobbyUsers, getuserbyusername,forgotpassword,resetpassword,emailverification} = require('../controller/user');
const {sendinvite} = require("../controller/chatControl");
const { reset } = require('nodemon');

// Route for user signup
userRouter             
.route('/signup')
.post(signup);

// Route for user login
userRouter              
.route('/login')
.post(login);

// Route for handling forgot password functionality
userRouter               
.route('/forgotpassword')
.post(forgotpassword);

// Route for resetting password
userRouter         
.route('/resetpass')
.patch(resetpassword);

// Route for email verification
userRouter
.route('/emailverification')
.post(emailverification);

// Middleware to protect routes using a user authentication function
userRouter.use(protectRoute);

// Route for fetching user details
userRouter
.route('/getuser')
.get(getuser)

// Route for fetching user details by username
userRouter
.route('/getuserbyusername/:username')
.get(getuserbyusername)

// Route for updating user's name
userRouter
.route('/updatename')
.patch(updatename)

// Route for updating user's password
userRouter
.route('/updatepass')
.patch(updatepassword)

// Route for updating user's avatar
userRouter
.route('/updateavatar')
.patch(updateavatar)

// Route for user logout
userRouter
.route('/logout')
.post(logout)

// Route for sending invitations
userRouter
.route("/sendinvite")
.post(sendinvite);

// Route for fetching online users
userRouter
.route('/getonlineusers')
.get(getOnlineUsers)

// Route for fetching lobby users
userRouter
.route('/getlobbyusers')
.get(getLobbyUsers)

// Route for changing user status
userRouter
.route('/changeuserstatus')
.patch(changeUserStatus)


// Export the configured userRouter for use in other files
module.exports = userRouter;