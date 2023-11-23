import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"

const JoinRoomForm = ({ uuid, socket, user, setuser}) =>{


    const [roomId, setRoomId] = useState("");
    const name = user.username;

    const navigate = useNavigate();

    const handleRoomJoin = (e)=>{
        e.preventDefault();
        if (!name) return toast.dark("Please enter your name!");
        const roomData = {
        name,
        roomId,
        image:user.image,
        userId: user.username,
        host: false,
        presenter: false,
        score:0
        };
        socket.emit("userJoined", {roomData, numberofplayer:undefined});
        navigate(`/${roomId}`);
    }

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