import React, { useState, useEffect, useRef } from 'react';
import io from "socket.io-client";
let socket = io.connect("http://localhost:3001");

function Friend({user,socket}) {
    // State variables initialization
    const [friendid, changeid] = useState('');
    const [friendreq, addfriendreq] = useState([]);
    const [livereq, setlivereq] = useState(false);
    const [friends, setfriends] = useState([]);

    // Establishing socket connections and handling cleanup on component unmount
    useEffect(() => {
        socket.emit("join_room", user.username);
        return () => {
            // socket.disconnect();
        };
    }, [user.username]);

    // Event handler for input change
    const onchange = (event) => {
        changeid(event.target.value);
    };

    // Socket event listeners for pending friend requests and current friends
    socket.on('getpendingreq',(data)=>{
            addfriendreq(data);
            if(data.length>0) setlivereq(true);
    })

    // Handling current friends received from the server
    socket.on('getcurfriends',(data)=>{
            setfriends(data);
    })

     // Functions for sending, accepting, and deleting friend requests and friends
    const sendRequest = async () => {
        socket.emit('sendrequest',{ to: friendid, from: user.username},(response)=>{
            alert(response);
        });
        changeid('');
    };

    // Deleting a friend request
    const deleteRequest = async (index, _id) => {
        socket.emit('deletereq',{id:_id},(response)=>{
            if(response.success) {
                const updatedFriendReq = [...friendreq.slice(0, index), ...friendreq.slice(index + 1)];
                addfriendreq(updatedFriendReq);
                if(friendreq.length===0) setlivereq(false);
            }
            alert(response.msg);
        })
    };

     // Deleting a friend from the list
    const deletefriend = async (index, _id) => {
        socket.emit('deletefreind',{id:_id,username:user.username},(response)=>{
            if(response.success) {
                const updatedFriendReq = [...friends.slice(0, index), ...friends.slice(index + 1)];
                setfriends(updatedFriendReq);
            }
            alert(response.msg);
        })
    };
    
    // Accepting a friend request
    const acceptRequest = async (index, _id) => {
        socket.emit('acceptRequest',{id:_id,username:user.username},(response)=>{
            if(response.success) {
                const updatedFriendReq = [...friendreq.slice(0, index), ...friendreq.slice(index + 1)];
                addfriendreq(updatedFriendReq);
                if(friendreq.length===0) setlivereq(false);
                setfriends([...friends, response.friends]);
            }
            alert(response.msg);
        })
    };

    const refreq = useRef();
    const showRequest = () => {     // Function to display friend requests modal
        refreq.current.click();
    };

    // Function to calculate time elapsed since a timestamp
    function timeAgo(timestamp) {
        const now = new Date();
        const seconds = Math.floor((now - timestamp) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            day: 86400,
            hour: 3600,
            minute: 60,
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const difference = Math.floor(seconds / secondsInUnit);

            if (difference >= 1) {
                return `${difference} ${unit}${difference > 1 ? 's' : ''} ago`;
            }
        }

        return 'Just now';
    }

    // JSX structure for rendering friend requests and friend list
    return (
        <>
            <button
                type="button"
                ref={refreq}
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#exampleModalFriend"
                style={{ display: 'none' }}
            ></button>

            <div className='modal fade' id='exampleModalFriend' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabelFriend' aria-hidden='true' >
                <div className='modal-dialog' role='document'>
                    <div className='modal-content' style={{ border: '10px solid white', borderRadius: '10px',height: '40vh' }}>
                        <div className='modal-header' style={{ color: 'black' }}>
                            <h5 className='modal-title' id='exampleModalLabelFriend'>Friend Requests</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body d-flex flex-column' style={{ backgroundColor: 'black',overflow: 'auto' }}>
                            {friendreq.map((data, index) => (
                                <div className='d-flex justify-content-between flex-row' key={index} style={{ border: '2px solid white', width: '100%', minHeight: 'fit-content', textAlign: 'center', fontSize: '1.5rem' }}>
                                    <div style={{margin:'0px 1vw'}}><h3 style={{ display: 'inline' }}>{data.from}</h3> <h6 style={{ display: 'inline' }}>{timeAgo(new Date(data.date))}</h6></div>
                                    <div ><span style={{margin:'0px 0.5vw', cursor:'pointer'}} onClick={()=>{acceptRequest(index, data._id);}}>&#9989;</span>
                                    <span style={{margin:'0px 0.5vw', cursor:'pointer'}} onClick={()=>{deleteRequest(index, data._id);}}>&#10060;</span></div>
                                </div>
                            ))}
                            {(friendreq.length === 0) && <div style={{fontSize:'3vh', textAlign:'center'}}>No Request</div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-flex align-items-center flex-column' style={{ height: '100%' }}>
                <div className='d-flex align-items-center flex-row' style={{ margin: '1vh' }}>
                    <input
                        type='text'
                        placeholder='Enter username'
                        value={friendid}
                        onChange={onchange}
                        style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', width:'70%', fontSize:'1vw' }}
                    />
                    <button type='submit' className='btn btn-primary' onClick={sendRequest} style={{width:'30%', fontSize:'1vw', minWidth:'fit-content'}}>
                        Add friend
                    </button>
                </div>
                <div className='d-flex align-items-center flex-column' style={{ justifyContent: 'space-evenly', height: '100%', width: '100%' }}>
                    <h3 style={{ width: '100%', textAlign: 'center' }}>
                        <strong>FRIEND LIST</strong>
                        <i
                            className='fa fa-bell'
                            style={{ position: 'relative', fontSize: '30px', right: '-1vw', cursor: 'pointer', color: livereq ? 'red' : 'white' }}
                            onClick={() => {
                                setlivereq(false);
                                showRequest();
                            }}
                        ></i>
                    </h3>

                    <div
                        className='d-flex align-items-center flex-column'
                        style={{ backgroundColor: 'black', color:'white',height: '80%', width: '90%', overflow: 'auto', border: '2px solid white', borderRadius: '5%'}}
                    >
                        {friends.map((data, index) => (
                                <div className='d-flex justify-content-between align-items-center flex-row' key={index} style={{ border: '1px solid white', width: '100%', height: '5vh', textAlign: 'center', fontSize: '100%' }}>
                                    <div style={{margin:'0px 1vw'}}><h3 style={{ display: 'inline', fontSize:'1.5vw' }}>{data.person1===user.username?data.person2:data.person1}</h3> </div>
                                    <div >
                                    <span style={{margin:'0px 1vw', cursor:'pointer',fontSize:'calc(1vw+2vh)'}} onClick={()=>{deletefriend(index, data._id);}}>&#10060;</span></div>
                                </div>
                            ))}
                            {(friends.length === 0) && <div style={{fontSize:'3vh'}}>No Friend</div>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Friend;
