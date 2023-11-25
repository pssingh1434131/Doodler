// Importing necessary modules and components
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import moment from 'moment';
import "../Chat.css"

// ChatBody component
function ChatBody({ socket }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [friends, setfriends] = useState([]);
    const [msgs, setmsgs] = useState([]);
    const [selectedchat, changeselectedchat] = useState('');
    const [prselectedchat, changeprselectedchat] = useState('');
    const [slnum, setslnum] = useState(-1);
    const [text, settext] = useState("");
    const chatContainerRef = useRef(null);

    // Effect to fetch initial data and join chat room on component mount
    useEffect(() => {
        socket.emit("joinchatroom", user.username);
        socket.on('getfriendlist', (data) => {    // Setting friends and initial chat messages
            if (data.length > 0) {
                setfriends(data);
                socket.emit('getmessages', data[0], (response) => {
                    if (response.data.length > 0) setmsgs(response.data);
                })
                changeprselectedchat(selectedchat);
                if (data[0].person1 === user.username) changeselectedchat(data[0].person2);
                else changeselectedchat(data[0].person1);
                setslnum(0);
            }
        })
        return () => {
            // socket.disconnect();
            socket.emit('join', user.username);
        };
    }, []);

    
    useEffect(() => {
        // Scroll to the bottom whenever msgs state changes
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [msgs]);

    // Effect to handle chat room changes
    useEffect(() => {
        if (prselectedchat !== '') {
            let array = [user.username, prselectedchat];
            array.sort();
            let roomId = array.join('&');
            socket.emit('leaveroom', roomId);
        }
        let array = [user.username, selectedchat];
        array.sort();
        let roomId = array.join('&');
        socket.emit('joinchatroom2', { roomId: roomId, array: array }, (response) => {
            if (response.success && response.data.length > 0) {
                setmsgs(response.data);
            }
            else{
                setmsgs([]);
            }
        })
    }, [slnum, selectedchat, prselectedchat]);

    useEffect(() => {
        const handleReceiveMsg = (data) => {
            setmsgs((prevMsgs) => [...prevMsgs, data]);
        };

        socket.on('recievemsg', handleReceiveMsg);

        return () => {
            socket.off('recievemsg', handleReceiveMsg); // Clean up the event listener
        };
    }, [socket]);


    // Function to handle selecting a chat from the sidebar
    const selectchat = (index, data) => {
        changeprselectedchat(selectedchat);
        setslnum(index);
        if (data.person1 === user.username) changeselectedchat(data.person2);
        else changeselectedchat(data.person1);
    };

// Function to handle text input change
    const handletextchange = (event) => {
        settext(event.target.value);
    }

// Function to send a message
    const sendmessage = (e) => {
        e.preventDefault();
        const msg1 = {
            from: user.username,
            to: selectedchat,
            msg: text,
            date: Date.now()
        }
        settext('');
        let array = [user.username, selectedchat];
        array.sort();
        let roomId = array.join('&');
        socket.emit('sendmessage', { msg1: msg1, roomId: roomId }, (response) => {
            if (response.success) {
                // setmsgs([...msgs, msg1]);
            }
        })
    };

    // Return statement containing JSX for rendering the chat interface
    return (
        <div className='d-flex flex-column' style={{ width: '100vw', padding: '0 10vw' }}>
            <Link to="/home" style={{ width: '0px', minWidth: 'fit-content' }} ><button className='btn btn-secondary' style={{ width: '8vw', margin: '3vh 0px' }} > &laquo; BACK</button></Link>
            <div className="chat">
                <div id="sidebar" className="chat__sidebar" style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                    <div style={{ fontSize: 'calc(1vh + 1vw + 10px)', padding: '1vh 2vw' }}>FRIENDS</div>
                    <ul className="users">
                        {friends.map((data, index) => (
                            <li key={index} style={index === slnum ? { backgroundColor: 'grey' } : {}} onClick={() => selectchat(index, data)} >{data.person1 === user.username ? data.person2 : data.person1}</li>
                        ))}
                    </ul>
                </div>
                <div className="chat__main" style={{ borderBottomRightRadius: '30px' }}>
                    <div id="messages" className="chat__messages" ref={chatContainerRef}>
                        {Array.isArray(msgs) ? (
                            msgs.map((data, index) => (
                                <div key={index} className='d-flex' style={{ justifyContent: user.username === data.from ? 'flex-end' : 'flex-start' }}>
                                    <div className="message" key={index} style={{ padding: '0px 20px 0px 10px', minWidth: 'fit-content', width: '10vw', position: 'relative' }}>
                                        <p style={{ margin: '0px' }}>
                                            <span className="message__name">{data.from === user.username ? 'You' : data.from}</span>
                                            <span className="message__meta">
                                                {moment(data.date).format('DD/MM/YYYY h:mm a')}
                                            </span>
                                        </p>
                                        <p style={{ color: 'white', paddingLeft: '.2vh', margin: '0px' }}>{data.msg}</p>
                                    </div>
                                </div>

                            ))
                        ) : (
                            <p style={{ color: 'white', textAlign: 'center', fontSize: '16px' }}>Loading messages...</p>
                        )}
                    </div>

                    <div className="compose">
                        <form id="message-form">
                            <input className='form-control' name="message" placeholder="Message" value={text} onChange={handletextchange} />
                            <button className='btn btn-dark' id="send-button" onClick={sendmessage}> Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ChatBody
