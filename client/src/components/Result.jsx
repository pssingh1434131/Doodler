import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import winimage from "../celebration.png"

function Result({ users, myindex,socket }) {
    // State to store the winner(s) indexes
    const [winner, setwinner] = useState([]);

     // Hook to handle navigation
    const navigate = useNavigate();

    // Effect to determine winner(s) based on scores
    useEffect(() => {
        let highestScore = users[0].score;
        for (let i = 1; i < users.length; i++) {
            if (users[i].score > highestScore) {
                highestScore = users[i].score;
            }
        }

        let indexesOfHighestScore = [];
        for (let i = 0; i < users.length; i++) {
            if (users[i].score === highestScore) {
                indexesOfHighestScore.push(i);
            }
        }
        setwinner(indexesOfHighestScore);
    }, [users])

    // Function to save game history and navigate to home
    const savehistory = async () => {
        let opponent = users.length===2?users[(myindex+1)%users.length].name:'friends'
        let data = winner.includes(myindex) ? { winner: users[myindex].name, loser: opponent } : { winner: opponent, loser: users[myindex].name };
        if(users.length===2)
        {
            socket.emit("handlegamesave", data);
            navigate("/home");
            return;
        }
        const response = await fetch("http://localhost:3001/game/uploadGame", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        const json = await response.json();
        if (json.success) {
            navigate("/home");
        } else {
            alert("Game save error");
        }
    }

    // JSX elements representing the Result component
    // displaying winner(s) and score(s)
    return (
        <div className="d-flex align-items-center justify-content-around" style={{ width: '100vw' }}>
            <img
                src={winimage}
                alt="Celebration"
                style={{ width: 'calc(6vw + 12vh + 10px)' }}
            />
            <div style={{ backgroundColor: 'white', border: '1px solid black', borderRadius: '20px', width: '45vw', minHeight: 'fit-content' }}>
                <div style={{ textAlign: 'center', fontSize: 'calc(3vh + 3vw + 10px)', borderBottom: '1px solid #E8BEAC', color:'blue' }}>Result</div>
                {users.map((user, index) => (
                    <div key={index} className="d-flex align-items-center justify-content-between" style={{ fontSize: 'calc(2vh + 2vw + 10px)',  padding: '0px 1vw' }}>
                        <div>{user.name}<span style={{ color: 'red' }}>{winner.includes(index) ? "(winner)" : ""}</span></div>
                        <div>{user.score}</div>
                    </div>
                ))}
                <div style={{ textAlign:'center' }}>
                    <button className="btn btn-success" onClick={() => {
                        savehistory();
                    }} style={{width:'15vw', height:'5vh', fontSize:'calc(0.5vh + 0.5vw + 10px)', margin:'1.5vh 0px'}}>Go to home</button>
                </div>

            </div>
            <img
                src={winimage}
                alt="Celebration"
                style={{ width: 'calc(6vw + 12vh + 10px)' }}
            />
        </div>
    )
}

export default Result