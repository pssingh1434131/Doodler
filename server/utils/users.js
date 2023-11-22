const users = [];

// Join user to chat

const addUser = ({name, userId,image, roomId, host, presenter, socketId, score}) => {
  let boolean = false;
  users.forEach(element => {
    if(element.name===name) {
      boolean = true;
    }
  });
  if(boolean) return users.filter((user)=>user.roomId===roomId);
  const user = {name, userId, image, roomId, host, presenter, socketId, score};
  users.push(user);
  users.sort((a, b) => a.name.localeCompare(b.name));
  return users.filter((user)=>user.roomId===roomId);
};

// User leaves chat

const removeUser = (id) => {
  const index = users.findIndex((user) => user.socketId === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//get a user from the list
const getUser = (id)=>{
    return users.find((user)=>user.socketId===id);
}

//get all users from the room
const getUsersInRoom = (roomId)=>{
    return users.filter((user)=>user.roomId===roomId);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};
