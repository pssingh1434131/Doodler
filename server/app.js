const express = require('express');
require('dotenv').config();
require('./db/database');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');
const { Server } = require('socket.io');
const {getFriends, sendFriendRequest, receiveFriendRequest, deleteFriendRequest, acceptFriendreq, deleteFriendship} = require('./controller/friendControl');
const { addUser, getUser, removeUser } = require("./utils/users");

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

let userRoom,imgUrl;

io.on('connection', (socket) => {
  socket.on("join_room", async (username) => {
    socket.join(username);
    let datat = await receiveFriendRequest(username);
    let data = datat.data;
    io.to(username).emit('getpendingreq', data);
    datat = await getFriends(username);
    data = datat.data;
    io.to(username).emit('getcurfriends', data);
  });

  socket.on('sendrequest',async (options,callback)=>{
    const to = options.to;
    const from = options.from;
    const datat = await sendFriendRequest(to,from);
    let data = datat.data;
    if(datat.success) io.to(to).emit('getpendingreq', data);
    callback(datat.msg);
  })

  socket.on('deletereq',async (options,callback)=>{
    const id = options.id;
    const data = await deleteFriendRequest(id);
    if(data.success) callback({success:true,msg:'request is denied'});
    else callback({success:false,msg:'error in denying the request'});
  })

  socket.on('deletefreind',async (options,callback)=>{
    const id = options.id;
    const username = options.username;
    const data = await deleteFriendship(id);
    if(data.success) {
      if(username===data.data.person1) {
        let datat = await getFriends(data.data.person2);
        io.to(data.data.person2).emit('getcurfriends', datat.data);
      }
      else{
        let datat = await getFriends(data.data.person1);
        io.to(data.data.person1).emit('getcurfriends', datat.data);
      }
      callback({success:true,msg:'friendship is removed'});
    }
    else callback({success:false,msg:'error in removing friend'});
  })

  socket.on('acceptRequest',async (options,callback)=>{
    const id = options.id;
    const username = options.username;
    const data = await acceptFriendreq(id);
    if(data.success) 
    {
      if(username===data.data.person1) {
        let datat = await getFriends(data.data.person2);
        io.to(data.data.person2).emit('getcurfriends', datat.data);
      }
      else{
        let datat = await getFriends(data.data.person1);
        io.to(data.data.person1).emit('getcurfriends', datat.data);
      }
      callback({success:true,msg:'accepted request',friends: data.data});
    }
    else callback({success:false,msg:'error in accepting the request',friends: null});
  })

  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter} = data;
    userRoom = roomId;
    socket.join(roomId);
    
    const users = addUser({ name, userId, roomId, host, presenter, socketId:socket.id });

    socket.emit("userIsJoined", { success: true, users });
    socket.broadcast.to(userRoom).emit("userJoinedMessageBroadcasted", name)

    socket.broadcast.to(userRoom).emit("allUsers", users)

    //console.log("imgUrl-> joined")
    socket.broadcast.to(userRoom).emit("whiteBoardDataResponse", {
      imgURL: imgUrl,
    });
});

socket.on("whiteboardData", (data) => {
    imgUrl = data;
    //console.log("updated image->")
    socket.broadcast.to(userRoom).emit("whiteBoardDataResponse", {
      imgURL: data,
    });
});

  socket.on("message", (data)=>{
    const {message} = data;
    const user = getUser(socket.id);
    if(user){
      socket.broadcast.to(userRoom).emit("messageResponse", {message, name: user.name})
    }
    
  })


  socket.on("disconnect", (data)=>{
    const user = getUser(socket.id);
    //console.log("disconnected",user);
    if(user){
      removeUser(socket.id);
      socket.broadcast.to(userRoom).emit("userLeftMessageBroadcasted", user.name)
    }
    
  })

});