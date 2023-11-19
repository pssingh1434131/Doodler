import React from 'react'

function Friendlobby(numberofplayer, users) {
    return (
        <div style={{ height: '100vh' }}>
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ width: '100vw', position: 'absolute', top: '20vh', color: 'white' }}>
                <div style={{ width: '7vh', height: '7vh' }} className="spinner-border" role="status">
                    <span className="sr-only"></span>
                </div>
                <div style={{ fontSize:'4vh'}}>Waiting for other players to join...</div>
            </div>

            <div className="d-flex align-items-center justify-content-center" style={{ position: 'absolute', top: '60vh' }}>
                {users.length > 0 && users.map((user, index) => (
                    <div
                        className="d-flex flex-column justify-content-center align-items-center"
                        style={{ height: "20vh", width: '10vw' }}
                        key={index}
                    >
                        <img
                            src={require(`../avatar/${user.image}`)}
                            alt="Avatar"
                            style={{ height: "10vh", width: "10vh" }}
                        />
                        <strong
                            style={{ textAlign: "center" }}
                        >
                            {user.username}
                        </strong>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Friendlobby
