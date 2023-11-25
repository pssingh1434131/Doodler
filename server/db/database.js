// Import the Mongoose library
const mongoose = require("mongoose");

// Retrieve the MongoDB URI from the environment variables
let dblink = process.env.MONGODB_URI;

// Connect to the MongoDB database using the retrieved URI
mongoose
  .connect(dblink)
  .then(function (db) {
    console.log("Database connected");    // Log a success message if the connection is successful
  })
  .catch(function (err) {
    console.log(err);     // Log any errors that occur during the connection process
  });
