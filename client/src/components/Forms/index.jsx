import CreateRoomForm from "./CreateRoomForm"
import JoinRoomForm from "./JoinRoomForm"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"
import "./index.css"

const Forms = ({ uuid , socket, setUser }) =>{
    return (
    <div className="d-flex align-items-center" style={{height:'100vh', justifyContent:'space-evenly', backgroundColor:'blue'}} >
        <div style={{width:'40vw ', backgroundColor:'rgb(179 177 177)', minHeight:'fit-content', padding:'5vh 4vw', borderRadius:'20px'}}>
            <h1 className="text-primary fw-bold">Create Room</h1>
            
            <CreateRoomForm uuid = {uuid} socket = {socket} setUser={setUser}/>
        </div>
        <div style={{minHeight:'fit-content', width:'40vw ', backgroundColor:'#ffc355', padding:'5vh 4vw', borderRadius:'20px'}}>
            <h1 className="text-primary fw-bold">Join Room</h1>
            <JoinRoomForm uuid={uuid} socket = {socket} setUser={setUser} />
        </div>
        
    </div>
    ); 
};
 
export default Forms;