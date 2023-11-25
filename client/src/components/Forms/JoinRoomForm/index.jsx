import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"

const JoinRoomForm = ({ uuid, socket, user, setuser}) =>{

// State for the room ID input
    const [roomId, setRoomId] = useState("");

    const name = user.username;  // Extract username from user object

    // React Router hook for navigation
    const navigate = useNavigate();

    // Function to handle joining a room
    const handleRoomJoin = (e)=>{
        e.preventDefault();

         // Check if the username is entered
        if (!name) return toast.dark("Please enter your name!");
        // Prepare room data to be emitted to the server
        const roomData = {
        name,
        roomId,
        image:user.image,
        userId: user.username,
        host: false,
        presenter: false,
        score:0
        };
        // Emit event to the server indicating user joined and room data
        socket.emit("userJoined", {roomData, numberofplayer:undefined});
        // Navigate to the specified room ID
        navigate(`/${roomId}`);
    }
// JSX form for joining a room
    return (
        <form className="form w-100 mt-4">

            <div className="form-group">
                <input 
                type="text"
                className="form-control my-2"
                placeholder="Enter your name"
                value={name}
                disabled={true}
                />
            </div>
            <div className="form-group ">
            <div className="input-group d-flex align-items-center justify-content-center">
                    <input
                    type = "text"
                    className="form-control my-2 " 
                    placeholder="Enter room code"
                    value={roomId}
                    onChange={(e)=> setRoomId(e.target.value)}
                    />
                    </div>
            </div>
            <button type ="submit" onClick={handleRoomJoin} className="mt-4 btn-primary btn btn-block form-control">Join Room</button>
        </form>
    )
};

export default JoinRoomForm;