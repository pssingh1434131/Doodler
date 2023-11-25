// Import necessary components and libraries
import Forgotpassword from "./components/Forgotpassword";
import Home from "./components/Home";
import Loginpage from "./components/Loginpage";
import Signuppage from "./components/Signuppage";
import Chat from "./components/Chat";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect} from "react";
import { ToastContainer, toast} from "react-toastify";
import io from "socket.io-client"
import Forms from './components/Forms/index'
import RoomPage from './pages/RoomPage';
import CollabForms from "./components/collabForms/index"
import CollabRoomPage from "./pages/collab_RoomPage"

import "./App.css";
import Lobby from "./components/Lobby";

const server = "http://localhost:3001";     // Server URL
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);   // Initialize socket connection to the server

function App() {
  // State variables using useState hook
  const [users, setUsers] = useState([]);
  const [round, setround] = useState(1);
  const [numberofplayer, setplayercount] = useState(2);
  const [myindex, setIndex] = useState(-1);
  const user = JSON.parse(localStorage.getItem('user'));

  // Custom PrivateRoute component to handle private routes
  const PrivateRoute = ({ element, path }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? element : <Navigate to="/" />;
  };

  // Custom PublicRoute component to handle public routes
  function PublicRoute({ element }) {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? <Navigate to="/home" /> : element;
  }

   // useEffect hook to manage socket event listeners and cleanup
  useEffect(() => {
    const handleUserJoined = (data) => {
        if (data.success) {
            setUsers(data.users);
            setround(1);
            if (data.numberofplayers) {
                if (data.users.length == data.numberofplayers) {
                    for (let i = 0; i < data.users.length; i++) {
                        if (data.users[i].name === user.username) {
                            setIndex(i);
                            break;
                        }
                    }
                }
                setplayercount(data.numberofplayers);
            }
            else{
              if (data.users.length == numberofplayer) {
                for (let i = 0; i < data.users.length; i++) {
                    if (data.users[i].name === user.username) {
                        setIndex(i);
                        break;
                    }
                }
            }
            }
        } else {
            console.log("userJoined error");
        }
    };

    const handleAllUsers = (data) => {
        setUsers(data);
    };

    const handleUserJoinedMessage = (data) => {
        toast.info(`${data} joined the room`);
    };

    const handleUserLeftMessage = (data) => {
        toast.info(`${data} left the room`);
        setUsers((prevUsers) => prevUsers.filter((user) => user.name !== data));
    };

    // Event listeners for socket events
    socket.on("userIsJoined", handleUserJoined);
    socket.on("allUsers", handleAllUsers);
    socket.on("userJoinedMessageBroadcasted", handleUserJoinedMessage);
    socket.on("userLeftMessageBroadcasted", handleUserLeftMessage);
    
    // Cleanup - removing event listeners when component unmounts
    return () => {
        socket.off("userIsJoined", handleUserJoined);
        socket.off("allUsers", handleAllUsers);
        socket.off("userJoinedMessageBroadcasted", handleUserJoinedMessage);
        socket.off("userLeftMessageBroadcasted", handleUserLeftMessage);
    };
}, [socket]);

// Function to generate UUID
  const uuid = () => {
    let S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };

   // Rendering component with React Router setup
  return (
    <>
      <ToastContainer />         {/* Notification container for toasts */}
      <BrowserRouter>
        <Routes>                  {/* Define routes for different components */}
          <Route
            path="/"
            element={<PublicRoute element={<Loginpage />} />}
          />
          <Route path="/signup" element={<PublicRoute element={<Signuppage />} />} />
          <Route
            path="/forgotpassword"
            element={<PublicRoute element={<Forgotpassword />} />}
          />
          <Route
            exact
            path="/home"
            element={<PrivateRoute element={<Home socket={socket}/>} />}
          />
          <Route
            exact
            path="/chat"
            element={<PrivateRoute element={<Chat socket = {socket} />} />}
          />
          <Route exact
            path="/play"
            element={<PrivateRoute element={<Forms uuid={uuid} socket={socket} numberofplayer={numberofplayer} setplayercount={setplayercount}/>} />} />

          <Route exact
            path="/draw"
            element={<PrivateRoute element={<CollabForms uuid={uuid} socket={socket} />} />} />
            
          <Route exact
            path="/lobby"
            element={<PrivateRoute element={<Lobby socket={socket} numberofplayer={numberofplayer}/>} />} />
          <Route exact
            path="/:roomId"
            element={<PrivateRoute element={<RoomPage socket={socket} round={round} setround={setround} numberofplayer={numberofplayer} setplayercount={setplayercount} users={users} setUsers={setUsers} myindex={myindex} setIndex={setIndex} />} />}
          />
          <Route exact
            path="/collab/:roomId"
            element={<PrivateRoute element={<CollabRoomPage socket={socket} users={users} />} />}
          />

        </Routes>
      </BrowserRouter>
    </>
  );
}
  
export default App;    // Export the main App component
