const express = require('express');
require('dotenv').config();
require('./db/database');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');
const { Server } = require('socket.io');
const { getFriends, sendFriendRequest, receiveFriendRequest, deleteFriendRequest, acceptFriendreq, deleteFriendship } = require('./controller/friendControl');
const { addUser, getUser, removeUser } = require("./utils/users");
const { getmessages, sendmessages } = require('./controller/chatControl');
const {uploadgame} = require("./controller/gamehistory")
const { getuserbyusername } = require('./controller/user');


const app = express();
const server = http.createServer(app);
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(express.json());

const urlaccess = ['http://localhost:3000', 'http://192.168.99.98:3000']

const corsOptions = {
  origin: urlaccess,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: urlaccess,
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

let userRoom, imgUrl, numberofplayers = 0;
let scores = [0, 0, 0, 0, 0];
let requestcnt = 0;
let users = [];

const createobj = (user) => {
  return {
    player1: user,
    player2: '',
    roomId: '',
    vacant: true
  }
}

const getroomid = (username1,username2) => {
  let array = [username1,username2];
  array.sort();
  return array.join('&');
}


io.on('connection', (socket) => {

  socket.on('join', (username) => {
    socket.join(username);
  })

  socket.on("join_room", async (username) => {
    socket.join(username);
    let datat = await receiveFriendRequest(username);
    let data = datat.data;
    io.to(username).emit('getpendingreq', data);
    datat = await getFriends(username);
    data = datat.data;
    io.to(username).emit('getcurfriends', data);
  });

  socket.on('sendrequest', async (options, callback) => {
    const to = options.to;
    const from = options.from;
    const datat = await sendFriendRequest(to, from);
    let data = datat.data;
    if (datat.success) io.to(to).emit('getpendingreq', data);
    callback(datat.msg);
  })

  socket.on('deletereq', async (options, callback) => {
    const id = options.id;
    const data = await deleteFriendRequest(id);
    if (data.success) callback({ success: true, msg: 'request is denied' });
    else callback({ success: false, msg: 'error in denying the request' });
  })

  socket.on('deletefreind', async (options, callback) => {
    const id = options.id;
    const username = options.username;
    const data = await deleteFriendship(id);
    if (data.success) {
      if (username === data.data.person1) {
        let datat = await getFriends(data.data.person2);
        io.to(data.data.person2).emit('getcurfriends', datat.data);
      }
      else {
        let datat = await getFriends(data.data.person1);
        io.to(data.data.person1).emit('getcurfriends', datat.data);
      }
      callback({ success: true, msg: 'friendship is removed' });
    }
    else callback({ success: false, msg: 'error in removing friend' });
  })

  socket.on('acceptRequest', async (options, callback) => {
    const id = options.id;
    const username = options.username;
    const data = await acceptFriendreq(id);
    if (data.success) {
      if (username === data.data.person1) {
        let datat = await getFriends(data.data.person2);
        io.to(data.data.person2).emit('getcurfriends', datat.data);
      }
      else {
        let datat = await getFriends(data.data.person1);
        io.to(data.data.person1).emit('getcurfriends', datat.data);
      }
      callback({ success: true, msg: 'accepted request', friends: data.data });
    }
    else callback({ success: false, msg: 'error in accepting the request', friends: null });
  })

  socket.on('updatestatus',async (data) => {
    const userd = await getuserbyusername(data.user.username);
    const userdata = userd.user;
    let flag = true;
    for(let i=0;i<users.length;i++){
      if(users[i].vacant && userdata.username===users[i].player1.username) {
        flag = false;
        // console.log('inside same');
        continue;
      }
      if(users[i].vacant) {
        flag = false;
        // console.log('different')
        // console.log(users[i]);
        // console.log(userdata);
        let newobj = users[i];
        users.splice(i, 1);
        newobj.player2 = userdata;
        newobj.vacant = false;
        newobj.roomId = getroomid(newobj.player1.username,newobj.player2.username);
        io.to(newobj.player1.username).emit('reqforjoinroom',newobj);
        io.to(newobj.player2.username).emit('reqforjoinroom',newobj);
        // console.log(newobj);
        break;
      }
    }
    if(flag) {
      let obj = createobj(userdata);
      users.push(obj);
    }
  })

  socket.on('deleteroom',(data) => {
    for(let i=0;i<users.length;i++){
      if(users[i].player1.username===data.username) {
        users.splice(i, 1);
        break;
      }
    }
  })

  socket.on("userJoined", ({ roomData, numberofplayer }) => {
    const { name, userId, image, roomId, host, presenter, score } = roomData;
    if (numberofplayer) {
      numberofplayers = numberofplayer;
    }
    userRoom = roomId;
    imgUrl = undefined;
    socket.join(roomId);

    const users = addUser({ name, userId, image, roomId, host, presenter, socketId: socket.id, score });
    if (numberofplayers === users.length) {
      users[0].presenter = true;
    }
    if (!numberofplayer) {
      numberofplayers = parseInt(numberofplayers, 10);
      io.to(userRoom).emit("userIsJoined", { success: true, users, numberofplayers });
    }
    if (numberofplayer) {
      io.to(userRoom).emit("userIsJoined", { success: true, users });
    }
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

  socket.on("message", (data) => {
    const filteredword = data;
    const user = getUser(socket.id);
    if (user) {
      socket.broadcast.to(userRoom).emit("messageResponse", { filteredword, name: user.name })
    }

  })
  
  socket.on('changemousemove',({ x, y, userName }) => {
    socket.broadcast.to(userRoom).emit("mouseMove", { x, y, userName })
  })


  socket.on("disconnect", (data) => {
    const user = getUser(socket.id);
    //console.log("disconnected",user);
    if (user) {
      removeUser(socket.id);
      socket.broadcast.to(userRoom).emit("userLeftMessageBroadcasted", user.name)
    }
  })

  socket.on("Userdisconnect", (user) => {
    const userCurrent = getUser(socket.id);
    //console.log("disconnected",user);
    if (userCurrent) {
      removeUser(socket.id);
      socket.broadcast.to(userRoom).emit("userLeftMessageBroadcasted", userCurrent.name)
    }
  })

  socket.on("joinchatroom", async (username) => {
    socket.join(username);
    datat = await getFriends(username);
    data = datat.data;
    if (datat.success) io.to(username).emit('getfriendlist', data);
    else io.to(username).emit('getfriendlist', []);
  });

  socket.on('joinchatroom2', async ({roomId,array}, callback) => {
    socket.join(roomId);
    const datat = await getmessages(array[0], array[1]);
    const data = datat.data;
    if (datat.success) callback({ data: data, success: true });
    else callback({ data: [], success: false });
  })

  socket.on('sendmessage', async (options, callback) => {
    const datat = await sendmessages(options.msg1.to, options.msg1.from, options.msg1);
    const data = datat.data;
    if(datat.success) {
      io.to(options.roomId).emit('recievemsg', data);
      callback({ data: data, success: true });
    }
    else callback({ data: null, success: false });
  })
  socket.on('leaveroom',(roomId)=>{
    socket.leave(roomId);
  })

  socket.on('whatisdrawn', (draw) => {
    draw = draw.toLowerCase();
    socket.broadcast.to(userRoom).emit("drawing", draw);
  })

  socket.on('updateuserarray', ({ ind, data }) => {
    setTimeout(() => {
      let len = data.length;
      for (let i = 0; i < data.length; i++) {
        data[i].score += scores[i];
      }
      data[ind % len].presenter = false;
      data[(ind + 1) % len].presenter = true;
      scores.fill(0);
      io.to(userRoom).emit("updatedusersarray", data);
    }, 10000);
  })

  socket.on('takescore', (score) => {
    for (let i = 0; i < score.length; i++) {
      scores[i] += score[i];
    }
  })

  socket.on("blockuser", (name)=>{
    io.to(userRoom).emit("blockuserchat", name);
  })

  socket.on("handlegamesave", async(data)=>{
    ++requestcnt;
    if(requestcnt===2){
      const game = await uploadgame(data);
      requestcnt=0;
      io.to(data.winner).emit("newgame", game);
      io.to(data.loser).emit("newgame", game);
    }
  })
});