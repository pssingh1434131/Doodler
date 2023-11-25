// Import necessary modules
const  express = require('express');
// Create an instance of Express Router
const gameRouter = express.Router();

// Import user controller for route protection
const {protectRoute} = require('../controller/user');
// Import game-related controller functions
const {getHistory, uploadGame} = require('../controller/gamehistory');

// Middleware to protect routes using a user authentication function
gameRouter.use(protectRoute);

// Define route for fetching game history
gameRouter
.route('/getHistory')
.get(getHistory);

// Define route for uploading game data
gameRouter
.route('/uploadGame')
.post(uploadGame);

// Export the configured gameRouter for use in other files
module.exports = gameRouter;