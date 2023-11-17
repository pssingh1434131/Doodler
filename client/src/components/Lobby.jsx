import React, { useEffect, useState } from 'react';
import updateStatus from '../services/setStatus';
import { useNavigate } from "react-router-dom"

function Lobby({ uuid, socket }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const [randomplayer, setplayer] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    updateStatus('lobby');

    const handleBeforeUnload = () => {
      updateStatus('offline');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Fetch random player with a timeout of 1 minute
    const fetchRandomPlayerWithTimeout = async () => {
      const timeoutId = setTimeout(() => {
        alert("No user found");
        clearTimeout(timeoutId);
        navigate('/home');
      }, 60000);

      try {
        while (timeoutId) {
          const response = await fetch('http://localhost:3001/user/getlobbyusers', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          let datat = await response.json();
          const data = datat.lobbyuser;
          if (Array.isArray(data) && data.length > 1) {
            const players = data.filter((users) => users.username !== user.username);
            const randomIndex = Math.floor(Math.random() * players.length);
            let randomPlayer = players[randomIndex];
            let resp = await fetch(`http://localhost:3001/user/getuserbyusername/${randomPlayer.username}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });
            datat = await resp.json();
            randomPlayer = datat.user;
            setplayer(randomPlayer);
            clearTimeout(timeoutId);
            
          }
        }
      } catch (error) {
        console.error('Error fetching player:', error);
      }
    };

    fetchRandomPlayerWithTimeout();

    return () => {
      updateStatus('offline');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [socket, user, navigate]);

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
