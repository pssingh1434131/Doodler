import React, { useEffect, useState } from 'react';
import updateStatus from '../services/setStatus';
import { useNavigate } from "react-router-dom"

function Lobby({ socket, numberofplayer }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const [randomplayer, setplayer] = useState(null);
  const navigate = useNavigate();
  let timet = null;
  useEffect(() => {
    socket.emit('join', user.username);

    socket.emit('updatestatus', { status: 'lobby', user: user });
    updateStatus('lobby');

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

    return () => {
      updateStatus('offline');
      socket.emit('deleteroom', user);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (timet) clearTimeout(timet);
    };
  }, []);

  // useEffect(() => {

  // },[socket])

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
      socket.emit("userJoined", { roomData, numberofplayer });
      navigate(`/${str}`);
    }

    socket.on('reqforjoinroom', reqtojoin);
    return () => {
      socket.off('reqforjoinroom', reqtojoin);
    }
  }, [socket])

  return (
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
