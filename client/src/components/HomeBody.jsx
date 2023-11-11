import React, { useState, useEffect } from 'react'
import Friend from './Friend';

function HomeBody() {
  const [gameHistory, setgameHistory] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const response = await fetch("http://localhost:3001/game/getHistory", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const datat = await response.json();
        const data = datat.games;
        if (Array.isArray(data)) {
          setgameHistory(data);
        } else {
          console.error('Retrieved data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching game history:', error);
      }
    };
    fetchGameHistory();
  }, []);

  return (
    <div className='d-flex' style={{ width: '100vw', padding: '0 18vw' }}>
      <div className="d-flex justify-content-center align-item-center flex-column" style={{ height: '60vh', flex: '0.3', backgroundColor: 'rgba(68, 68, 193, 0.8)', borderRadius: '50px 0 0 50px' }}>
        <strong style={{ textAlign: 'center', color: 'white', fontSize: '40px', textDecoration: 'underline' }}>PLAY NOW</strong>
        <button className='playbtn' style={{ backgroundColor: 'red' }}>PLAY ONLINE</button>
        <button className='playbtn' style={{ backgroundColor: 'green' }}>PLAY WITH FRIENDS</button>
        <button className='playbtn' style={{ backgroundColor: 'blue' }}>PLAY WITH COMPUTER</button>
      </div>
      <div className='d-flex align-items-center justify-content-around flex-row' style={{ height: '60vh', color: 'white', flex: '0.7', backgroundColor: 'rgba(68, 68, 193, 0.8)', borderRadius: ' 0 50px 50px 0', borderLeft: "3px solid white" }}>
        {gameHistory && <div className='d-flex align-items-center flex-column' style={{ width: '45%', height: '95%', justifyContent: 'space-evenly' }}>
          <h2><strong>GAME HISTORY</strong></h2>
          <div className='d-flex align-items-center flex-column' style={{ backgroundColor: 'black', height: '80%', width: '100%', overflow: 'auto', border: '2px solid black', borderRadius: '5%' }}>
            {gameHistory.map((game, index) => {
              const gameDate = new Date(game.date);
              const date = gameDate.getDate();
              const month = gameDate.toLocaleString('default', { month: 'long' });
              const hours = gameDate.getHours();
              const minutes = gameDate.getMinutes();

              const formattedDate = `${date} ${month}  ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

              return (
                <div key={index} style={{ border: '2px solid black', width: '100%', height: '9vh', textAlign: 'center', fontSize: '156%', backgroundColor: user.username === game.winner ? 'green' : 'red' }}>
                  {user.username === game.winner ? 'Won' : 'Lost'} against @{user.username === game.winner ? game.loser : game.winner}  <br /> {formattedDate}
                </div>
              );
            })}

            {
              gameHistory.length===0&&<div style={{fontSize:'3vh'}}>No Game to show</div>
            }
          </div>
        </div>}
        <div style={{ width: '45%', height: '95%' }}>
            <Friend user={user} />
        </div>
      </div>
    </div>

  )
}

export default HomeBody
