import CreateRoomForm from "./CreateRoomForm"
import JoinRoomForm from "./JoinRoomForm"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"
import "./index.css"
import { useState,useEffect } from "react";
import updateStatus from "../../services/setStatus";

const Forms = ({ uuid , socket}) =>{
    useEffect(() => {
        updateStatus('online');
    
        // Set the status to 'offline' when the user leaves the page
        const handleBeforeUnload = () => {
          updateStatus('offline');
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
          updateStatus('offline');
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []);
    const [user, setuser] = useState(JSON.parse(localStorage.getItem('user')));
    return (
    <div className="d-flex align-items-center" style={{height:'100vh', justifyContent:'space-evenly'}} >
        <div style={{width:'40vw ', backgroundColor:'rgb(179 177 177)', minHeight:'fit-content', padding:'5vh 4vw', borderRadius:'20px'}}>
            <h1 className="text-primary fw-bold">Create Room</h1>
            
            <CreateRoomForm uuid = {uuid} socket = {socket} user={user} setuser={setuser}/>
        </div>
        <div style={{minHeight:'fit-content', width:'40vw ', backgroundColor:'#ffc355', padding:'5vh 4vw', borderRadius:'20px'}}>
            <h1 className="text-primary fw-bold">Join Room</h1>
            <JoinRoomForm uuid={uuid} socket = {socket} user={user} setuser={setuser}/>
        </div>
        
    </div>
    ); 
};
 
export default Forms;