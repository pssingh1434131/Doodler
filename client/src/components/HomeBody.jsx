import React, { useState, useEffect } from 'react'
import Friend from './Friend';
import {Link} from "react-router-dom"

function HomeBody({socket}) {
  const [gameHistory, setgameHistory] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Emit a socket event to join a room with the user's username
    socket.emit('join',user.username);
    const fetchGameHistory = async () => {
      try {
        // Fetch the game history from the server
        const response = await fetch("http://localhost:3001/game/getHistory", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const datat = await response.json();
        const data = datat.games;    // Extract the 'games' data from the response
        if (Array.isArray(data)) {
          setgameHistory(data);
        } else {
          console.error('Retrieved data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching game history:', error);
      }
    };
    fetchGameHistory();            // Fetch the user's game history on component mount
  }, []);


   // Listen for 'newgame' socket event to update game history
  useEffect(()=>{
    const insertnewgame = (game)=>{
      console.log(game);
      setgameHistory((prevHistory) => [game, ...prevHistory]);
    }
    socket.on("newgame", insertnewgame);
    return ()=>{
      socket.off("newgame", insertnewgame);
    }
  }, [socket])

  return (
    <div className='d-flex' style={{ width: '100vw', padding: '0 18vw' }}>
      <div className="d-flex justify-content-center align-item-center flex-column" style={{ height: '60vh', flex: '0.3', backgroundColor: 'rgba(68, 68, 193, 0.8)', borderRadius: '50px 0 0 50px' }}>
        <strong style={{ textAlign: 'center', color: 'white', fontSize: 'calc(1vh + 1vw + 10px)', textDecoration: 'underline' }}>PLAY NOW</strong>
        <Link style={{textAlign:'center'}} to='/lobby'><button className='playbtn' style={{ backgroundColor: 'red', minHeight:'fit-content' }}>PLAY ONLINE</button></Link>
        <Link style={{textAlign:'center'}} to='/play'><button className='playbtn' style={{ backgroundColor: 'green',minHeight:'fit-content'  }}>PLAY WITH FRIENDS</button></Link>
        <Link style={{textAlign:'center'}} to='/draw'><button className='playbtn' style={{ backgroundColor: 'blue', minHeight:'fit-content'  }}>DRAW TOGETHER</button></Link>
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
                <div key={index} style={{ border: '2px solid black', width: '100%', minHeight: 'fit-content', textAlign: 'center', fontSize: '1.4vw', backgroundColor: user.username === game.winner ? 'green' : 'red' }}>
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
            <Friend user={user} socket ={socket} />
        </div>
      </div>
    </div>

  )
}

export default HomeBody
