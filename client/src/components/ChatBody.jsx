import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import io from "socket.io-client";
let socket = io.connect("http://localhost:3001");

function ChatBody(props) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [friends, setfriends] = useState([]);
    const [msgs, setmsgs] = useState([]);
    const [selectedchat, changeselectedchat] = useState(null);
    const [slnum, setslnum] = useState(-1);
    const [text, settext] = useState("");

    useEffect(() => {
        socket.emit("joinchatroom", user.username);
        return () => {
            // socket.disconnect();
        };
    }, [props.user.username]);
    
    useEffect(() => {
        socket.on('recievemsg', (data) => {
            if (selectedchat !== null) {
                const targetUsername = user.username === selectedchat.person1 ? selectedchat.person2 : selectedchat.person1;
                if (data.from === targetUsername) {
                    setmsgs([...msgs, data]);
                }
            }
        });
        socket.on('getfriendlist', (data) => {
            if(data.length>0) {
                setfriends(data);
                socket.emit('getmessages', data[0], (response) => {
                    if (response.data.length > 0) setmsgs(response.data);
                })
                changeselectedchat(data[0]);
                setslnum(0);
            }
        })
        return () => {
            // socket.disconnect();
        };
    }, [socket,msgs]);

    const selectchat = (index, data) => {
        setslnum(index);
        setmsgs([]);
        socket.emit('getmessages', data, (response) => {
            if (response.success && response.data.length > 0) setmsgs(response.data);
        })
        changeselectedchat(data);
    };

    const handletextchange = (event) => {
        settext(event.target.value);
    }


    const sendmessage = (e) => {
        e.preventDefault();
        const msg1 = {
            from: user.username,
            to: selectedchat.person1 === user.username ? selectedchat.person2 : selectedchat.person1,
            msg: text,
            date: Date.now()
        }
        settext('');
        socket.emit('sendmessage', { msg1 }, (response) => {
            if(response.success) {
                setmsgs([...msgs, msg1]);
            }
        })
    };

    return (
        <div className='d-flex' style={{ width: '100vw', padding: '0 10vw' }}>
            <div className="chat">
                <div id="sidebar" className="chat__sidebar">
                    <h2 style={{ padding: '1vw' }}>Friends</h2>
                    <ul className="users">
                        {friends.map((data, index) => (
                            <li key={index} style={index === slnum ? { backgroundColor: 'grey' } : {}} onClick={() => selectchat(index, data)} >{data.person1 === user.username ? data.person2 : data.person1}</li>
                        ))}
                    </ul>
                </div>
                <div className="chat__main">
                    <div id="messages" className="chat__messages">
                        {Array.isArray(msgs) ? (
                            msgs.map((data, index) => (
                                <div className="message" key={index}>
                                    <p style={{ margin: '0px' }}>
                                        <span className="message__name">{data.from}</span>
                                        <span className="message__meta">
                                            {moment(data.date).format('DD/MM/YYYY h:mm a')}
                                        </span>
                                    </p>
                                    <p style={{ color: 'white', paddingLeft: '.2vh', margin: '0px' }}>{data.msg}</p>
                                </div>
                            ))
                        ) : (
                            <p>Loading messages...</p>
                        )}
                    </div>

                    <div className="compose">
                        <form id="message-form">
                            <input name="message" placeholder="Message" value={text} onChange={handletextchange} />
                            <button id="send-button" onClick={sendmessage}>Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ChatBody
