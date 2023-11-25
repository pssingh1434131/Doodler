import React, { useEffect, useState } from 'react';
import updateStatus from '../services/setStatus';
import { useNavigate } from "react-router-dom"

function Lobby({ socket, numberofplayer }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const [randomplayer, setplayer] = useState(null);
  const navigate = useNavigate();
  let timet = null;
  useEffect(() => {

    // the component mounts, emit socket events and perform initial setup
    socket.emit('join', user.username);   // Join the user to the lobby room in the socket connection

    socket.emit('updatestatus', { status: 'lobby', user: user });   // Update user status to 'lobby' in the socket
    localStorage.removeItem("blocked");
    localStorage.removeItem("badwordcnt");
    localStorage.removeItem("gamechat");
    updateStatus('lobby');   // Update status locally

    // When the user leaves the page or refreshes, update the status to 'offline'
    const handleBeforeUnload = () => {
      updateStatus('offline');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Fetch random player with a timeout of 1 minute
    timet = setTimeout(() => {
      alert("No user found");
      clearTimeout(timet);
      socket.emit('deleteroom', user);
      navigate('/home');
    }, 60000);

    // Clean up functions on component unmount or changes
    return () => {
      updateStatus('offline');
      socket.emit('deleteroom', user);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (timet) clearTimeout(timet);
    };
  }, []);

  // useEffect(() => {

  // },[socket])

  // useEffect to handle response when another user requests to join the room
  useEffect(() => {
    const reqtojoin = (data) => {
      let randomPlayer = null;
      if (timet) clearTimeout(timet);
      let str = data.roomId;
      let roomData = {
        name: user.username,
        roomId: str,
        userId: user.username,
        image: user.image,
        host: false,
        presenter: false,
        score: 0
      };
      randomPlayer = data.player1.username === user.username ? data.player2 : data.player1;
      setplayer(randomPlayer);
      socket.emit("userJoined", { roomData, numberofplayer });  // Notify the server that the user has joined
      navigate(`/${str}`);
    }

    // Listen for the request to join the room
    socket.on('reqforjoinroom', reqtojoin);

     // Clean up function for removing the event listener
    return () => {
      socket.off('reqforjoinroom', reqtojoin);
    }
  }, [socket])

  return (
    // Render the lobby UI
    <div className="d-flex align-items-center justify-content-around" style={{ height: '100vh', color: 'white' }}>
      {user && (
        <div className="d-flex align-items-center justify-content-center" style={{ width: '30vw', height: '30vh' }}>
          <div style={{ fontSize: 'calc(3vh + 3vw + 10px)' }}>{user.username}</div>\
          <img src={require(`../avatar/${user.image}`)} alt="avatar" style={{ height: 'calc(4vh + 4vw + 10px)' }} />
        </div>
      )}
      <div style={{ fontSize: 'calc(4vh + 4vw + 10px)' }}>VS</div>
      {randomplayer && (
        <div className="d-flex align-items-center justify-content-center" style={{ width: '30vw', height: '30vh' }}>
          <img src={require(`../avatar/${randomplayer.image}`)} alt="avatar" style={{ height: 'calc(4vh + 4vw + 10px)' }} />
          <div style={{ fontSize: 'calc(3vh + 3vw + 10px)' }}>{randomplayer.username}</div>
        </div>
      )}
      {
        !randomplayer && (
          <div className="d-flex align-items-center justify-content-center" style={{ width: '30vw', height: '30vh', fontSize: 'calc(4vh + 4vw + 10px)' }}>
            Searching...
          </div>
        )
      }
    </div>
  );
}

export default Lobby;
