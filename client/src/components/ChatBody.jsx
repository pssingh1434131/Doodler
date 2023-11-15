import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import moment from 'moment';
import io from "socket.io-client";
import "../Chat.css"
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
    }, [user.username]);
    
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
    }, [msgs, selectedchat, user.username]);

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
        <div className='d-flex flex-column' style={{ width: '100vw', padding: '0 10vw' }}>
            <Link to="/home" style={{width:'0px',minWidth:'fir-content'}} ><button className='btn btn-secondary' style={{ width: '8vw', margin: '3vh 0px' }} > &laquo; BACK</button></Link>
            <div className="chat" >
                <div id="sidebar" className="chat__sidebar" style={{ borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}>
                    <div style={{ fontSize: 'calc(1vh + 1vw + 10px)', padding: '1vh 2vw' }}>FRIENDS</div>
                    <ul className="users">
                        {friends.map((data, index) => (
                            <li key={index} style={index === slnum ? { backgroundColor: 'grey' } : {}} onClick={() => selectchat(index, data)} >{data.person1 === user.username ? data.person2 : data.person1}</li>
                        ))}
                    </ul>
                </div>
                <div className="chat__main" style={{ borderBottomRightRadius: '30px' }}>
                    <div id="messages" className="chat__messages">
                        {Array.isArray(msgs) ? (
                            msgs.map((data, index) => (
                                <div key={index} className='d-flex' style={{justifyContent: user.username===data.from? 'flex-end':'flex-start'}}>
                                    <div className="message" key={index} style={{ padding:'0px 20px 0px 10px',minWidth: 'fit-content', width: '10vw', position: 'relative' }}>
                                        <p style={{ margin: '0px' }}>
                                            <span className="message__name">{data.from===user.username?'You':data.from}</span>
                                            <span className="message__meta">
                                                {moment(data.date).format('DD/MM/YYYY h:mm a')}
                                            </span>
                                        </p>
                                        <p style={{ color: 'white', paddingLeft: '.2vh', margin: '0px' }}>{data.msg}</p>
                                    </div>
                                </div>

                            ))
                        ) : (
                            <p style={{color:'white', textAlign:'center', fontSize:'16px'}}>Loading messages...</p>
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
