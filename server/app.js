const express = require('express');
require('dotenv').config();
require('./db/database');
const cors = require('cors');
const http = require('http')
const bodyParser = require("body-parser");
const cookieparser = require('cookie-parser');
const {Server}=require("socket.io");

const app = express();
const server = http.createServer(app)
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
};
app.use(cors(corsOptions));
const port = 3001;

server.listen(port, () => {
    console.log(`server is running at port no ${port}`);
});

const userRouter = require("./router/userRouter");
const gameRouter = require("./router/gameRouter");
const friendRouter = require("./router/friends");

app.use("/user", userRouter);
app.use("/game", gameRouter);
app.use("/friend", friendRouter);

const io = new Server(server);

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("join_room", (data) => {
      socket.join(data);
    });
  
    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });
  });