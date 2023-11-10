import React, { useState, useEffect , useRef } from 'react';
import io from "socket.io-client";

function Friend(props) {
    const socket = io.connect("http://localhost:3001");
    const [friendid, changeid] = useState('');
    const [friendreq, addfriendreq] = useState([]);
    const [livereq, setlivereq] = useState(false);
    const onchange = (event) => {
        changeid(event.target.value);
    };

    socket.emit("join_room", props.user.username);

    const sendRequest = async() => {
        const response = await fetch("http://localhost:3001/friend/sendRequest", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({to: friendid})
        });
        const json = await response.json();
        if (json.success){
            socket.emit("send_message", { from: props.user.username, to: friendid, date: Date.now() }, friendid);

        }
        else{
            alert("Invalid credentials");
        }
        changeid('');
    };

    const refreq = useRef();
    const showRequest = () => {
        refreq.current.click();
    };
    
    useEffect(() => {
        socket.on("receive_message", (data) => {
            addfriendreq(friendreq.unshift(data));
            setlivereq(true);
        });
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
              if(!datat.success){
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
          addfriendlist();
      }, [socket, addfriendreq]);

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

            <div className='modal fade' id='exampleModalFriend' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabelFriend' aria-hidden='true' style={{color:'black'}}>
                <div className='modal-dialog' role='document'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='exampleModalLabelFriend'>Friend Request Modal</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close' onClick={()=>{
                                setlivereq(false);
                            }}>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                        {friendreq.map((data, index) => (
                            <div>
                                data.from
                            </div>
                        ))}
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-secondary' data-dismiss='modal'>
                                Close
                            </button>
                            <button type='button' className='btn btn-primary'>
                                Save changes
                            </button>
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
                            style={{ position: 'relative', fontSize: '30px', right: '-1vw', cursor: 'pointer', color:livereq?'red':'white' }}
                            onClick={showRequest}
                        ></i>
                    </h3>

                    <div
                        className='d-flex align-items-center flex-column'
                        style={{ backgroundColor: '#b1b0b0', height: '80%', width: '90%', overflow: 'auto', border: '2px solid black', borderRadius: '5%' }}
                    >
                        
                    </div>
                </div>
            </div>
        </>
    );
}

export default Friend;
