const  express = require('express');
const gameRouter = express.Router();
const {protectRoute} = require('../controller/user');
const {getHistory, uploadGame} = require('../controller/gamehistory');

gameRouter.use(protectRoute);
gameRouter
.route('/getHistory')
.get(getHistory);

gameRouter
.route('/uploadGame')
.post(uploadGame);

module.exports = gameRouter;