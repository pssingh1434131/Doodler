import Forgotpassword from "./components/Forgotpassword";
import Home from "./components/Home";
import Loginpage from "./components/Loginpage";
import Signuppage from "./components/Signuppage";
import Chat from "./components/Chat";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client"
import Forms from './components/Forms/index'
import RoomPage from './pages/RoomPage';

import "./App.css";

const server = "http://localhost:3001";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const PrivateRoute = ({ element, path }) => {
  const user = localStorage.getItem("user");
  return user ? element : <Navigate to="/" />;
};

function App() {
  const [user,setUser] = useState(null);
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const handleUserJoined = (data) => {
      if (data.success) {
        console.log("userJoined");
        setUsers(data.users);
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
  
    // Attaching event listeners
    socket.on("userIsJoined", handleUserJoined);
    socket.on("allUsers", handleAllUsers);
    socket.on("userJoinedMessageBroadcasted", handleUserJoinedMessage);
    socket.on("userLeftMessageBroadcasted", handleUserLeftMessage);
  
    // Cleanup function
    return () => {
      // Removing event listeners
      socket.off("userIsJoined", handleUserJoined);
      socket.off("allUsers", handleAllUsers);
      socket.off("userJoinedMessageBroadcasted", handleUserJoinedMessage);
      socket.off("userLeftMessageBroadcasted", handleUserLeftMessage);
    };
  }, []);

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
  return (
    <>
    <ToastContainer />
    <BrowserRouter>
      <Routes>
        <Route exact path="/signup" element={<Signuppage />} />
        <Route exact path="/forgotpassword" element={<Forgotpassword />} />
        <Route
          exact
          path="/home"
          element={<PrivateRoute element={<Home />} />}
        />
        <Route
          exact
          path="/chat"
          element={<PrivateRoute element={<Chat />} />}
        />
         <Route exact
        path="/play" 
        element={<Forms uuid={uuid} socket={socket} setUser={setUser} />} />
        <Route exact
        path="/:roomId" 
        element={<RoomPage user ={user} socket={socket} users={users}/>} 
        />
        <Route
          exact
          path="/"
          element={<Loginpage />}
        />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
