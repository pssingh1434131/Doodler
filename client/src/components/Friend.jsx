import React, { useState, useEffect, useRef } from 'react';
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

function Friend(props) {

    const [friendid, changeid] = useState('');
    const [friendreq, addfriendreq] = useState([]);
    const [livereq, setlivereq] = useState(false);
    const [friends, setfriends] = useState([]);

    const onchange = (event) => {
        changeid(event.target.value);
    };

   socket.emit("join_room", props.user.username);

    const sendRequest = async () => {
        const response = await fetch("http://localhost:3001/friend/sendRequest", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ to: friendid }),
            credentials:'include'
        });
        const json = await response.json();
        if (json.success) {
            // socket.emit("send_message", { from: props.user.username, to: friendid, date: Date.now() }, friendid);
            socket.emit('friendRequest', { to: friendid, from: props.user.username });
        }
        else {
            alert("Invalid credentials");
        }
        changeid('');
    };

    const deleteRequest = async (index, _id) => {
        const response = await fetch("http://localhost:3001/friend/deleteRequest", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: _id}),
            credentials:'include'
        });
        const json = await response.json();
        if (json.success) {
            // Create a new array without the deleted element
            const updatedFriendReq = [...friendreq.slice(0, index), ...friendreq.slice(index + 1)];
            addfriendreq(updatedFriendReq);
        } else {
            alert("Invalid credentials");
        }
    };
    
    const deletefriend = async (index, _id) => {
        const response = await fetch("http://localhost:3001/friend/deleteFriend", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: _id}),
            credentials:'include'
        });
        const json = await response.json();
        if (json.success) {
            // Create a new array without the deleted element
            const updatedFriends = [...friends.slice(0, index), ...friends.slice(index + 1)];
            setfriends(updatedFriends);
        } else {
            alert("Invalid credentials");
        }
    };
    
    const acceptRequest = async (index, _id) => {
        const response = await fetch("http://localhost:3001/friend/acceptRequest", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: _id}),
            credentials:'include'
        });
        const json = await response.json();
        if (json.success) {
            // Create a new array without the deleted element
            const updatedFriendReq = [...friendreq.slice(0, index), ...friendreq.slice(index + 1)];
            addfriendreq(updatedFriendReq);
            
            // Push the single friend object into the friends array
            setfriends([...friends, json.friends]);
        } else {
            alert("Invalid credentials");
        }
    };
    


    const refreq = useRef();
    const showRequest = () => {
        refreq.current.click();
    };

    useEffect(() => {
        socket.on('friendRequest', (data) => {
            addfriendreq((prevFriendReq) => [data, ...prevFriendReq]);
            setlivereq(true);
        });
      }, []);

    useEffect(() => {
        // Define addfriendlist function
        const addfriendlist = async () => {
            try {
                const response = await fetch("http://localhost:3001/friend/receivedRequest", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                const datat = await response.json();
                if (!datat.success) {
                    alert("cannot fetch friend requests");
                    return;
                }
                const data = datat.receivedRequest;
                if (Array.isArray(data)) {
                    addfriendreq(data);
                } else {
                    console.error('Retrieved data is not an array:', data);
                }
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };
    
        // Execute addfriendlist only once on mount
        addfriendlist();
    
        // Subscribe to socket events and fetch friends
        
    
        const findfriends = async () => {
            try {
                const response = await fetch("http://localhost:3001/friend/getFriends", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                const datat = await response.json();
                if (!datat.success) {
                    alert("cannot fetch friends");
                    return;
                }
                const data = datat.friendlist;
                if (Array.isArray(data)) {
                    setfriends(data);
                } else {
                    console.error('Retrieved data is not an array:', data);
                }
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };
    
        // Execute findfriends whenever the component mounts or updates
        findfriends();
    
        // Cleanup: Unsubscribe from socket events on component unmount
    }, [addfriendreq, setfriends, setlivereq]);
    

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
                                <div className='d-flex justify-content-between flex-row' key={index} style={{ border: '2px solid white', width: '100%', height: '5vh', textAlign: 'center', fontSize: '156%' }}>
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
                        style={{ padding: '0.375rem 0.75rem', borderRadius: '8px' }}
                    />
                    <button type='submit' className='btn btn-primary' onClick={sendRequest}>
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
                                    <div style={{margin:'0px 1vw'}}><h3 style={{ display: 'inline' }}>{data.person1===props.user.username?data.person2:data.person1}</h3> </div>
                                    <div >
                                    <span style={{margin:'0px 1vw', cursor:'pointer'}} onClick={()=>{deletefriend(index, data._id);}}>&#10060;</span></div>
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
