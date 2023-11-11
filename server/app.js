const express = require('express');
require('dotenv').config();
require('./db/database');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['polling', 'websocket'],
});

const port = 3001;

server.listen(port, () => {
  console.log(`Server is running at port no ${port}`);
});

const userRouter = require('./router/userRouter');
const gameRouter = require('./router/gameRouter');
const friendRouter = require('./router/friends');

app.use('/user', userRouter);
app.use('/game', gameRouter);
app.use('/friend', friendRouter);

io.on('connection', (socket) => {
  socket.on("join_room", (username) => {
    socket.join(username);
});
  socket.on('friendRequest', (data) => {
    io.to(data.to).emit('friendRequest', data);
  });
});