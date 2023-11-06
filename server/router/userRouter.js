const  express = require('express');
const userRouter = express.Router();
const {signup, login} = require('../controller/user');

userRouter
.route('/signup')
.post(signup);

userRouter
.route('/login')
.post(login);

module.exports = userRouter;