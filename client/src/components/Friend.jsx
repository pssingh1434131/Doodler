import React, { useState, useRef } from 'react';

function Friend() {
    const [friendid, changeid] = useState('');
    const onchange = (event) => {
        changeid(event.target.value);
    };
    const sendRequest = () => {
        console.log(friendid);
        
        changeid('');
    };

    const refreq = useRef();
    const showRequest = () => {
        refreq.current.click();
    };

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

            <div className='modal fade' id='exampleModalFriend' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabelFriend' aria-hidden='true'>
                <div className='modal-dialog' role='document'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='exampleModalLabelFriend'>Friend Request Modal</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            {/* Your modal body content */}
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
                            style={{ position: 'relative', fontSize: '30px', right: '-1vw', cursor: 'pointer' }}
                            onClick={showRequest}
                        ></i>
                    </h3>

                    <div
                        className='d-flex align-items-center flex-column'
                        style={{ backgroundColor: '#b1b0b0', height: '80%', width: '90%', overflow: 'auto', border: '2px solid black', borderRadius: '5%' }}
                    >
                        {/* Your friend list content */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Friend;
