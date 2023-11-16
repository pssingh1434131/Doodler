import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"

const CreateRoomForm = ({ uuid, socket, user, setuser }) => {

    const [roomId, setRoomId] = useState(uuid());
    const name = user.username;

    const navigate = useNavigate();

    const handleCreateRoom = (e) => {
        e.preventDefault();
        if (!name) return toast.dark("Please enter your name!");

        const roomData = {
            name,
            roomId,
            userId: uuid(),
            host: true,
            presenter: true,
        };
        setuser(roomData);
        localStorage.setItem('roomdata', JSON.stringify(roomData));
        navigate(`/${roomId}`);
        socket.emit("userJoined", roomData);
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
                        <button className="btn btn-outline-danger btn-sm me-1" style={{height:'38px',width:'76px'}} type="button" onClick={() => {
                            navigator.clipboard.writeText(roomId);
                            toast.dark("Room code copied to clipboard!");
                        }}>Copy</button>
                    </div>
                </div>
            </div>
            <button type="submit" onClick={handleCreateRoom} className="mt-4 btn-primary btn btn-block form-control">Generate Room</button>
        </form>
    )
};

export default CreateRoomForm;