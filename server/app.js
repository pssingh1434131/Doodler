const express = require('express');
require('dotenv').config();
require('./db/database');
const cors = require('cors');
const http = require('http')
const bodyParser = require("body-parser");
const cookieparser = require('cookie-parser');

const app = express();
const server = http.createServer(app)
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
const port = 3001;

server.listen(port, () => {
    console.log(`server is running at port no ${port}`);
});

const userRouter = require("./router/userRouter");

app.use("/user", userRouter);