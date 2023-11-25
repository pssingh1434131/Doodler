import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"

const CreateRoomForm = ({ roomId, setRoomId, uuid, socket, user, numberofplayer, setplayercount }) => {
     // Extract username from user object
    const name = user.username;
     // State to handle the number of players locally
    const [localNumberofplayer, setLocalNumberofplayer] = useState(numberofplayer);

    // React Router hook to handle navigation
    const navigate = useNavigate();

     // Function to handle the creation of a room
    const handleCreateRoom = (e) => {
        e.preventDefault();
        // Validation checks for name and number of players
        if (!name) return toast.dark("Please enter your name!");
        if (localNumberofplayer > 5 || localNumberofplayer < 2) {
            setplayercount(2);
            alert("Number of players should be between 2 and 5");
            return;
        }
        // Set the number of players
        setplayercount(parseInt(localNumberofplayer, 10));
        let numberofplayer = parseInt(localNumberofplayer, 10);

        // Prepare room data to be emitted to the server
        const roomData = {
            name,
            roomId,
            image: user.image,
            userId: user.username,
            host: true,
            presenter: false,
            score: 0,
        };
        // Emit event to the server indicating user joined and room data
        socket.emit("userJoined", { roomData, numberofplayer });
        navigate(`/${roomId}`);           // Navigate to the room with the generated roomId
    };
 // JSX form for creating a room
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
            <div className="form-group">
                <div className="input-group d-flex align-items-center justify-content-center">
                    <input
                        type="text"
                        value={roomId}
                        className="form-control my-2"
                        disabled
                        placeholder="Generate room code"
                    />
                    <div className="input-group-append ">
                        <button
                            className="btn btn-outline-success btn-sm me-1"
                            onClick={() => setRoomId(uuid())}
                            type="button">
                            Generate
                        </button>
                        <button className="btn btn-outline-danger btn-sm me-1" style={{ height: '38px', width: '76px' }} type="button" onClick={() => {
                            navigator.clipboard.writeText(roomId);
                            toast.dark("Room code copied to clipboard!");
                        }}>Copy</button>
                    </div>
                </div>
            </div>
            <input
                type="text"
                value={localNumberofplayer}
                onChange={(e) => setLocalNumberofplayer(e.target.value)}
                className="form-control my-2"
                placeholder="Number of players(less than 6)"
            />
            <button type="submit" onClick={handleCreateRoom} className="mt-4 btn-primary btn btn-block form-control">
                Generate Room
            </button>
        </form>
    );
};

export default CreateRoomForm;
