import "./index.css"
import CreateRoomForm from "./CreateRoomForm"
import JoinRoomForm from "./JoinRoomForm"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"


const Forms = ({ uuid , socket, setUser }) =>{
    return (
    <div className="row h-100 pt-5">
        <div className="col-md-4 mt-5 form-box p-5 border border-primary  rounded-2 mx-auto ">
            <h1 className="text-primary fw-bold px-5">Create Room</h1>
            
            <CreateRoomForm uuid = {uuid} socket = {socket} setUser={setUser}/>
        </div>
        <div className="col-md-4 mt-5 form-box p-5 border border-primary  rounded-2 mx-auto">
            <h1 className="text-primary fw-bold px-5 ">Join Room</h1>
            <JoinRoomForm uuid={uuid} socket = {socket} setUser={setUser} />
        </div>
        
    </div>
    ); 
};
 
export default Forms;