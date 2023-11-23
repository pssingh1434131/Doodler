import React, { useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import filter from 'bad-words';
import { toast } from 'react-toastify';
const Filter = new filter({ replaceRegex: /[A-Za-z0-9가-힣_]/g });

const Chat = ({ setOpenedChatTab, socket, chat, setChat, blocked, setblocked}) => {
  const [message, setMessage] = useState("");
  const [badwordcnt, increasecnt] = useState(0);
  // useEffect(() => {
  //   const handleReceivedMessage = (data) => {
  //     setChat((prevChats) => [...prevChats, data]);
  //   };

  //   // Subscribing to the "messageResponse" event
  //   socket.on("messageResponse", handleReceivedMessage);

  //   // Cleaning up the event listener
  //   return () => {
  //     socket.off("messageResponse", handleReceivedMessage);
  //   };
  // }, [socket]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      let isabusive = Filter.isProfane(message);
      let filteredword = message;
      if (isabusive) {
        toast.error(`WARNING: Bad words usage is not allowed. ${2 - badwordcnt} more warning left otherwise you will be blocked.`);
        if (badwordcnt === 2) {
          setblocked(true);
          toast.error(`Chat blocked!!`);
        }
        increasecnt(badwordcnt + 1);
        filteredword = Filter.clean(filteredword);
      }
      setChat((prevChats) => [...prevChats, { filteredword, name: "You" }]);
      socket.emit("message", filteredword);
      setMessage("");
    }
  };

  return (
    <div className="position-fixed top-0 h-100 text-white bg-dark" style={{ width: "20vw", left: "0%", zIndex: 2 }}>
      <button
        type="button"
        onClick={() => setOpenedChatTab(false)}
        className="btn btn-light btn-block w-100 mt-5"
      >
        Close
      </button>
      <div
        className="w-100 mt-5 p-2 border border-1 border-white rounded-3 "
        style={{ height: "65%", overflow: 'auto' }}
      >
        {chat.map((msg, index) => (
          <p key={index * 999} className="my-2 text-center w-100 py-2 border border-left-0 border-right-0">
            {msg.name}: {msg.filteredword}
          </p>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="w-100 mt-4 d-flex rounded-3 ">
        <input
          type="text"
          placeholder="Enter message"
          className="h-110 border-0 rounded-0 py-2 px-4"
          style={{ width: "90%" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={blocked}
        />
        <button type="submit" className="btn btn-primary rounded-0" disabled={blocked}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
