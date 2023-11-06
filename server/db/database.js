const mongoose = require("mongoose");
let dblink = process.env.MONGODB_URI;

mongoose
  .connect(dblink)
  .then(function (db) {
    console.log("Database connected");
  })
  .catch(function (err) {
    console.log(err);
  });
