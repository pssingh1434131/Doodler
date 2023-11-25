import CreateRoomForm from "./CreateRoomForm"
import JoinRoomForm from "./JoinRoomForm"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"
import "./index.css"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import updateStatus from "../../services/setStatus";

const Forms = ({ uuid, socket, numberofplayer, setplayercount }) => {
  const [roomId, setRoomId] = useState(uuid());
  const [friends, setfriends] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Emit 'join_room' event with the username when user.username changes
    socket.emit("join_room", user.username);
  }, [user.username]);

  // Listen for 'getcurfriends' event and update friends state
  socket.on('getcurfriends', (data) => {    
    setfriends(data);
  })
  useEffect(() => {
     // Update user status to 'online' when component mounts
    updateStatus('online');

     // Clear local storage data when component mounts
    localStorage.removeItem("blocked");
    localStorage.removeItem("badwordcnt");
    localStorage.removeItem("gamechat");
    // Set the status to 'offline' when the user leaves the page
    const handleBeforeUnload = () => {
      updateStatus('offline');
    };

    // Event listener for beforeunload to update status
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      updateStatus('offline');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const sendinvite = async(username) => {
     // Prepare invitation data
    const data = {
      from: user.username, // Sender's username
      to: username,  // Receiver's username
      msg: `Join my room to play Doodler with me: ${roomId}`,   // Receiver's username
      date: Date.now()
    }
    // Send invitation via HTTP POST request
    const response = await fetch("http://localhost:3001/user/sendinvite", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    
    // Handle the response from the server
    const json = await response.json();
    if (json.success) {
      alert(`Invite sent to ${username}`);
    } else {
      alert("Invalid credentials");
    }
  }

 // Cleanup: Update status to 'offline' and remove event listener
  return (
    <>
      <Link to="/home" style={{ width: '0px', minWidth: 'fit-content', margin: '0px 2vw', position: 'absolute' }} ><button className='btn btn-secondary' style={{ width: '8vw', margin: '3vh 0px' }} > &laquo; BACK</button></Link>
      <div style={{ width: '20vw', height: '43vh', position: 'absolute', left: '10vw', top: '35vh' }}>
        <div
          className='d-flex align-items-center flex-column'
          style={{ backgroundColor: 'black', color: 'white', height: '80%', width: '90%', border: '2px solid white', borderRadius: '5%' }}
        >
          <div style={{ fontSize: 'calc(0.7vh + 0.7vw + 10px)' }}>Invite Friends</div>
          <div style={{ width: '100%', overflow: 'auto' }}>
            {friends.map((data, index) => (
              <div className='d-flex justify-content-between align-items-center flex-row' key={index} style={{ border: '1px solid white', width: '100%', height: '5vh', textAlign: 'center', fontSize: '90%' }}>
                <div style={{ margin: '0px 1vw' }}><h3 style={{ display: 'inline', fontSize: '1.2vw' }}>{data.person1 === user.username ? data.person2 : data.person1}</h3> </div>
                <div >
                  <span style={{ margin: '0px 1vw', cursor: 'pointer', fontSize: 'calc(1vw+2vh)' }} onClick={() => { sendinvite(data.person1 === user.username ? data.person2 : data.person1) }}>Invite</span></div>
              </div>
            ))}
            {(friends.length === 0) && <div style={{ fontSize: '3vh' }}>No Friend</div>}
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end" style={{ height: '100vh', justifyContent: 'space-evenly' }} >
        <div style={{ width: '40vw ', backgroundColor: 'rgb(179 177 177)', minHeight: 'fit-content', padding: '5vh 4vw', borderRadius: '20px', margin: '0px 20vw' }}>
          <h1 className="text-primary fw-bold">Create Room</h1>

          <CreateRoomForm roomId={roomId} setRoomId={setRoomId} uuid={uuid} socket={socket} user={user} numberofplayer={numberofplayer} setplayercount={setplayercount} />
        </div>
        <div style={{ minHeight: 'fit-content', width: '40vw ', backgroundColor: '#ffc355', padding: '5vh 4vw', borderRadius: '20px', margin: '0px 20vw' }}>
          <h1 className="text-primary fw-bold">Join Room</h1>
          <JoinRoomForm uuid={uuid} socket={socket} user={user} />
        </div>

      </div>
    </>

  );
};

export default Forms;