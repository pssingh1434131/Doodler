import { useRef, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Whiteboard from "../../components/Whiteboard";
import Chat from "../../components/Chat/index";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"
import { BsDownload } from 'react-icons/bs';
import updateStatus from "../../services/setStatus";
import { toast } from "react-toastify";
import Result from "../../components/Result";
import "./index.css"


const RoomPage = ({ socket, round, setround, numberofplayer, setplayercount, users, setUsers, myindex, setIndex }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [tool, setTool] = useState("pencil");
    const [color, setColor] = useState("black");
    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([]);
    const [openedUserTab, setOpenedUserTab] = useState(false);
    const [openedChatTab, setOpenedChatTab] = useState(false);
    const [chat, setChat] = useState([]);
    const [selectedShape, setSelectedShape] = useState("");
    const [thickness, setThickness] = useState(5);
    const [guess, setguess] = useState("");
    const [draw, setdraw] = useState("");
    const [countdown, setCountdown] = useState(5);
    const [attempts, setattempts] = useState(3);
    const [scores, setscore] = useState(Array.from({ length: numberofplayer }, () => 0));
    const [blocked, setblocked] = useState(false);
    const [kicked, setkicked] = useState([]);
    let timerId;

    useEffect(() => {
        updateStatus('busy');
        const handleBeforeUnload = () => {
            updateStatus('offline');
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            updateStatus('offline');
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (users.length === numberofplayer && countdown > 0) {
            timerId = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        }
        return () => clearInterval(timerId);
    }, [users, countdown]);

    useEffect(() => {
        const blockuserchat = (name) => {
            if (myindex !== -1 && users[myindex].name == name) {
                setblocked(true);
                localStorage.setItem('blocked', true);
            }
        }
        socket.on("blockuserchat", blockuserchat);
        return () => {
            socket.off("blockuserchat", blockuserchat);
        };
    }, [socket, blocked, myindex, users]);

    useEffect(() => {
        if (countdown == 0) {
            if (users[myindex].presenter && round <= 3) {
                socket.emit("updateuserarray", { ind: myindex, data: users });
            }
        }
    }, [countdown])

    useEffect(() => {
        if (chat.length !== 0)
            localStorage.setItem('gamechat', JSON.stringify(chat));
    }, [chat])

    useEffect(() => {
        const handleReceivedMessage = (data) => {
            setChat((prevChats) => [...prevChats, data]);
        };

        const handledrawingword = (draw) => {
            setdraw(draw);
        }

        const updateuserarray = (data) => {
            if (data[0].presenter) setround((prev) => prev + 1);
            for (let i = 0; i < data.length; i++) {
                if (data[i].name == user.username) {
                    setIndex(i);
                    break;
                }
            }
            setplayercount(data.length);
            setUsers(data);
        };

        const handlekickeduser = ({ kickeduser, name }) => {
            toast.error(`${name == user.username ? 'You are' : name + ' is'} kicked out.`);
            setkicked(kickeduser);
        }

        const leaveroom = ({ kickeduser, roomId }) => {
            if (kickeduser.includes(user.username)) {
                socket.emit("leaveroom", roomId);
                navigate('/home');
            }
        }

        socket.on("messageResponse", handleReceivedMessage);
        socket.on("drawing", handledrawingword);
        socket.on("updatedusersarray", updateuserarray);
        socket.on("kickedUser", handlekickeduser);
        socket.on("leaveroomonkick", leaveroom);

        return () => {
            socket.off("messageResponse", handleReceivedMessage);
            socket.off("drawing", handledrawingword);
            socket.off("updatedusersarray", updateuserarray);
            socket.off("kickedUser", handlekickeduser);
            socket.off("leaveroomonkick", leaveroom);
        };
    }, [socket]);

    const handleDownload = () => {
        const canvas = canvasRef.current;

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const scaleFactor = 5;
        tempCanvas.width = canvas.width * scaleFactor;
        tempCanvas.height = canvas.height * scaleFactor;
        tempCtx.fillStyle = 'white'; // Set white background
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        tempCtx.drawImage(canvas, 0, 0, canvas.width * scaleFactor, canvas.height * scaleFactor);


        tempCanvas.toBlob((blob) => {

            const link = document.createElement('a');
            link.download = 'whiteboard_drawing.png';

            link.href = window.URL.createObjectURL(blob);
            link.click();

            window.URL.revokeObjectURL(link.href);

        }, 'image/png');
    };



    const handleguesssubmit = () => {
        socket.emit("whatisdrawn", draw);
        setdraw("");
    }

    const handleDisconnect = () => {
        socket.emit("Userdisconnect", user);
    };
    const handleClearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d")
        ctx.fillRect = "white";
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setElements([]);
    }

    const undo = () => {

        setHistory((prevHistory) => [
            ...prevHistory,
            elements[elements.length - 1],
        ]);
        setElements((prevElements) =>
            prevElements.slice(0, prevElements.length - 1)
        );
    };

    const redo = () => {

        setElements((prevElements) => [
            ...prevElements,
            history[history.length - 1],
        ]
        );
        setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
    };

    const handleThicknessChange = (newThickness) => {
        setThickness(newThickness);

        setElements((prevElements) =>
            prevElements.map((element, index) => {
                if (index === prevElements.length) {
                    return {
                        ...element,
                        strokeWidth: newThickness,
                    };
                }
                return element;
            })
        );
    };

    const shareOnTwitter = (imageUrl) => {
        const shareText = encodeURIComponent("Check out my awesome drawing!");
        const shareURL = encodeURIComponent(imageUrl);
        window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareURL}`, "_blank");
    };
    
    const shareOnFacebook = (imageUrl) => {
        const shareURL = encodeURIComponent(imageUrl);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareURL}`, "_blank");
    };

    const shareOnInstagram = (imageUrl) => {
        const shareText = encodeURIComponent("Check out my awesome drawing!");
        const shareURL = encodeURIComponent(imageUrl);
        window.open(`https://www.instagram.com/?caption=${shareText}&url=${shareURL}`, "_blank");
    };

    const shareimage = async (site) => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL('image/png');
        const apiKey = process.env.REACT_APP_API_KEY;
        const uploadEndpoint = 'https://api.imgbb.com/1/upload';
        const name = 'Doodler drawing';
        const expiration = 3600 * 24 * 30;
        const formData = new FormData();
        formData.append('key', apiKey);
        const base64String = dataURL.split(',')[1]; // Remove the prefix
        formData.append('image', base64String);
        formData.append('name', name);
        formData.append('expiration', expiration);

        try {
            const response = await fetch(uploadEndpoint, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log(data);
            if (data.success) {
                const imageUrl = data.data.url;
                if(site==="facebook"){
                    shareOnFacebook(imageUrl);
                }
                else if(site==="twitter"){
                    shareOnTwitter(imageUrl);
                }else{
                    shareOnInstagram(imageUrl);
                }
            } else {
                console.error('Error uploading image to ImgBB:', data.error.message);
            }
        } catch (error) {
            console.error('Error uploading image to ImgBB:', error);
        }
    }

    const guessedword = () => {
        let score;
        if (attempts === 3) {
            score = 100;
        }
        else if (attempts === 2) {
            score = 50;
        }
        else if (attempts === 1) {
            score = 20;
        }
        let guessed = guess.toLowerCase();
        if (guessed === draw) {
            let tempscore = scores;
            tempscore[myindex] = score;
            setscore(tempscore);
            setattempts(3);
            socket.emit("takescore", scores);
        }
        else {
            toast.error("Incorrect guess, " + (attempts - 1) + " attemps remaining");
        }
        setattempts(attempts - 1);
        setguess("");
    };

    if (round === 4) {
        return (<div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', width: '100vw' }}>
            <Result users={users} myindex={myindex} socket={socket} />
        </div>)
    }

    return (
        <>
            {users.length === numberofplayer ?
                <div className="row" style={{ height: '100vh' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <Link to="/home" style={{ margin: '0px 2vw', Width: '10vw', minHeight: 'fit-content', display: 'block', zIndex: 1 }} >
                            <button
                                type="button"
                                className="btn btn-secondary"
                                style={{ height: "40px", minHeight: 'fit-content', width: "5vw", minWidth: 'fit-content' }}
                                onClick={() => handleDisconnect()}
                            >
                                &laquo; BACK
                            </button>
                        </Link>
                        <div className="d-flex align-items-center justify-content-start" style={{ width: '50vw' }}>
                            <button
                                type="button"
                                className="btn btn-dark"
                                style={{ height: "40px", minHeight: 'fit-content', width: "5vw", minWidth: 'fit-content', zIndex: 1, margin: '0px 1vw' }}
                                onClick={() => setOpenedUserTab(true)}
                            >
                                Active users:  {users.length}
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                style={{ height: "40px", minHeight: 'fit-content', width: "5vw", minWidth: 'fit-content', zIndex: 1, margin: '0px 1vw' }}
                                onClick={() => setOpenedChatTab(true)}
                            >
                                Chats
                            </button>
                        </div>
                        <strong style={{ fontSize: '5vh', display: 'block', width: '100vw', position: 'absolute', textAlign: 'center', color: 'black' }}>
                            Round {round}
                        </strong>
                        <button
                            type="button"
                            className="btn btn-secondary d-flex align-items-center"
                            style={{ height: "40px", minHeight: 'fit-content', width: "5vw", minWidth: 'fit-content', zIndex: 1, margin: '0px 1vw', fontSize: '18px' }}
                            onClick={handleDownload}
                        >
                            <BsDownload style={{ marginRight: '5px' }} />
                            <strong>Download</strong>
                        </button>
                        {/* <button
                            type="button"
                            className="btn btn-secondary d-flex align-items-center"
                            onClick={}
                            style={{ height: "40px", minHeight: 'fit-content', width: "5vw", minWidth: 'fit-content', zIndex: 1, margin: '0px 1vw', fontSize: '18px' }}
                        >
                            <strong>Share Drawing</strong>
                        </button> */}
                        <div className="d-flex align-item-center justify-content-around" style={{ marginRight: '2vw', width: '10vw', zIndex: '1', display:users[myindex].presenter?'block':'none' }}>
                            <a className="fab fa-facebook" onClick={() => { shareimage("facebook") }} style={{ fontSize: '50px', color: 'white', textDecoration: 'none', cursor: 'pointer' }}></a>
                            <a className="fab fa-twitter" onClick={() => { shareimage("twitter") }} style={{ fontSize: '50px', color: 'white', textDecoration: 'none', cursor: 'pointer' }}></a>
                            <a className="fab fa-instagram" onClick={() => { shareimage("instagram") }} style={{ fontSize: '50px', color: 'white', textDecoration: 'none', cursor: 'pointer' }}></a>
                        </div>
                    </div>

                    {
                        openedUserTab && (
                            <div
                                className="position-fixed top-0 h-100 text-white bg-dark"
                                style={{ width: "18vw", left: "0%", zIndex: 2, background: "white", minWidth: 'fit-content' }}>
                                <button
                                    type="button"
                                    onClick={() => setOpenedUserTab(false)}
                                    className="btn btn-light btn-block w-100 mt-5"
                                >
                                    Close
                                </button>
                                {
                                    <div className="w-100 mt-5 pt-5" style={{ minWidth: 'fit-content' }}>
                                        {
                                            users.map((usr, index) => (
                                                <div key={index * 999} className="my-3 text-center w-100 d-flex justify-content-between align-items-center" style={{ border: '1px solid white', borderRadius: '5px', padding: '1px 0px', height: '35px', minWidth: 'fit-content' }}>
                                                    <div style={{ margin: '0px 5px' }}>{usr.name} {users[myindex].userId === usr.userId && "(You)"}</div>
                                                    {users[myindex].host && (
                                                        <div style={{ fontSize: '13px', display: index !== myindex ? 'block' : 'none' }}>
                                                            <button style={{ background: 'none', borderRadius: '3px', cursor: 'pointer', color: 'white', margin: '4px' }} onClick={() => { socket.emit("blockuser", usr.name) }}>Block chat</button>
                                                            <button style={{ background: 'none', borderRadius: '3px', cursor: 'pointer', color: 'white', margin: '4px' }} onClick={() => { socket.emit("kickuser", usr.name) }}>Kick</button>
                                                        </div>
                                                    )}
                                                </div>

                                            ))
                                        }
                                    </div>
                                }
                            </div>
                        )
                    }
                    {
                        openedChatTab && (
                            <Chat setOpenedChatTab={setOpenedChatTab} socket={socket} chat={chat} setChat={setChat} user={users[myindex]} blocked={blocked} setblocked={setblocked} />
                        )
                    }
                    {
                        <div className="col-md-10 mx-auto px-1 d-flex align-items-center justify-content-center">
                            <div className="d-flex col-md-3 gap-3 justify-content-center gap-1">
                                <div className="d-flex gap-1">
                                    <label htmlFor="pencil" style={{ fontWeight: "bold", fontSize: "16px" }}>Pencil</label>
                                    <input
                                        type="radio"
                                        name="tool"
                                        id="pencil"
                                        value="pencil"
                                        checked={tool === "pencil"}
                                        className="mt-1"
                                        onChange={(e) => setTool(e.target.value)}
                                        disabled={!(users[myindex].presenter)}
                                    />
                                </div>
                                <div className="d-flex gap-1">
                                    <label htmlFor="line" style={{ fontWeight: "bold", fontSize: "16px" }} >Line</label>
                                    <input
                                        type="radio"
                                        name="tool"
                                        id="line"
                                        value="line"
                                        checked={tool === "line"}
                                        className="mt-1"
                                        onChange={(e) => setTool(e.target.value)}
                                        disabled={!(users[myindex].presenter)}
                                    />
                                </div>
                                <div >
                                    <div className="shapes-container">
                                        <label htmlFor="shape" style={{ marginRight: '5px', fontWeight: "bold", fontSize: "16px" }}>Shapes:</label>
                                        <select
                                            id="shape"
                                            value={selectedShape}
                                            onChange={(e) => {
                                                setSelectedShape(e.target.value); // Update the selected shape when the dropdown value changes
                                                setTool(e.target.value); // Set the tool based on the selected shape
                                            }}
                                            disabled={!(users[myindex].presenter)}
                                        >
                                            <option value="">Choose</option>
                                            <option value="rect">Rectangle</option>
                                            <option value="circle">Circle</option>
                                            <option value="square">Square</option>
                                            <option value="trapezium">Trapezium</option>
                                            <option value="ellipse">Ellipse</option>
                                            <option value="quadraticCurvy">Curve</option>

                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex gap-1">
                                <label htmlFor="eraser" style={{ marginLeft: "20px", fontWeight: "bold", fontSize: "16px" }}>Eraser</label>
                                <input
                                    type="radio"
                                    name="tool"
                                    id="eraser"
                                    value="eraser"
                                    checked={tool === "eraser"}
                                    className="mt-1"
                                    onChange={(e) => setTool(e.target.value)}
                                    disabled={!(users[myindex].presenter)}
                                />
                            </div>

                            <div className="whiteboard-container">
                                {/* Thickness adjuster */}
                                <div className="thickness-slider">
                                    <label htmlFor="thickness" style={{ fontWeight: "bold", fontSize: "16px" }}>Thickness:</label>
                                    <input
                                        type="range"
                                        id="thickness"
                                        min="1"
                                        max="20"
                                        value={thickness}
                                        disabled={!(users[myindex].presenter)}
                                        onChange={(e) => handleThicknessChange(parseInt(e.target.value))}
                                        style={{
                                            background: `linear-gradient(to right, ${color}, ${color} ${((thickness - 1) / 19) * 100}%, #d3d3d3 ${(thickness / 20) * 100}%, #d3d3d3)`,
                                        }}
                                    />
                                    <span>{thickness}</span>
                                </div>
                            </div>

                            <div className="col-md-2 mx-auto">
                                <div className="d-flex align-items-center ">
                                    <label htmlFor="color" style={{ fontWeight: "bold", fontSize: "16px" }}>Select Color: </label>
                                    <input
                                        type="color"
                                        id="color"
                                        className="mt-1 ms-2"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        disabled={!(users[myindex].presenter)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3 d-flex gap-2">
                                <button className="btn btn-primary mt-1"
                                    disabled={elements.length === 0 || !(users[myindex].presenter)}
                                    onClick={() => undo()}
                                    style={{ marginLeft: "60px", fontWeight: "bold" }}
                                >Undo</button>
                                <button className="btn btn-outline-primary mt-1"
                                    disabled={history.length < 1 || !(users[myindex].presenter)}
                                    onClick={() => redo()}
                                    style={{ fontWeight: "bold" }}
                                >Redo</button>
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-danger" onClick={handleClearCanvas} disabled={!(users[myindex].presenter)} style={{ fontWeight: "bold" }}>Clear Canvas</button>
                            </div>
                        </div>
                    }

                    <div className="col-md-12 mx-auto canvas-box "  >
                        <Whiteboard
                            canvasRef={canvasRef}
                            ctxRef={ctxRef}
                            elements={elements}
                            setElements={setElements}
                            color={color}
                            tool={tool}
                            user={users[myindex]}
                            socket={socket}
                            thickness={thickness}
                            setThickness={setThickness}
                        />
                    </div>
                    <div style={{ position: 'absolute', color: 'white', right: '1vw', top: '27vh', border: '1px solid white', borderRadius: '10px', backgroundColor: 'black', width: '15vw', minHeight: 'fit-content', padding: '1vh 1vw' }}>
                        <div style={{ textAlign: 'center', fontSize: '2vw' }}>Scoreboard</div>
                        {users.map((user, index) => (
                            <div key={index} className="d-flex align-items-center justify-content-between" style={{ fontSize: '1.2vw' }}>
                                <div>{user.name}<span style={{ color: 'red' }}>{user.presenter ? "◀" : ""}</span><span style={{ color: 'red' }}>{kicked.includes(user.name) ? "kicked" : ""}</span></div>
                                <div>{user.score + scores[index]}</div>
                            </div>
                        ))}
                    </div>
                    {!users[myindex].presenter && <div style={{ position: 'absolute', color: 'white', right: '1vw', bottom: '10vh', border: '1px solid white', borderRadius: '10px', backgroundColor: 'black', width: '15vw', minHeight: 'fit-content', padding: '1vh 1vw' }}>
                        <div style={{ textAlign: 'center', fontSize: '2vw' }}>Guess</div>
                        <div className="d-flex flex-column align-items-center justify-content-between" style={{ fontSize: '1.2vw' }}>
                            <input disabled={draw == "" && attempts !== 0} className="form-control" type="text" value={guess} onChange={(e) => { setguess(e.target.value) }} />
                            <button disabled={draw == "" && attempts !== 0} className="btn btn-secondary mt-2" onClick={guessedword}>Submit</button>
                        </div>
                    </div>}
                    {users[myindex].presenter && <div style={{ position: 'absolute', color: 'white', right: '1vw', bottom: '10vh', border: '1px solid white', borderRadius: '10px', backgroundColor: 'black', width: '15vw', minHeight: 'fit-content', padding: '1vh 1vw' }}>
                        <div style={{ textAlign: 'center', fontSize: '2vh' }}>What are you drawing?</div>
                        <div className="d-flex flex-column align-items-center justify-content-between" style={{ fontSize: '1.2vw' }}>
                            <input className="form-control" type="text" value={draw} onChange={(e) => { setdraw(e.target.value) }} />
                            <button className="btn btn-secondary mt-2" onClick={handleguesssubmit}>Submit</button>
                        </div>
                    </div>}
                    {countdown > 0 && <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh', width: '100vw', fontSize: 'calc(5vh + 5vw + 10px)', position: 'absolute', zIndex: '10', color: 'grey' }}>
                        <span>
                            {countdown}
                        </span>
                    </div>}
                </div> : (
                    <div style={{ height: '100vh' }}>
                        <div className="d-flex flex-column justify-content-center align-items-center" style={{ width: '100vw', position: 'absolute', top: '20vh', color: 'white' }}>
                            <div style={{ width: '7vh', height: '7vh' }} className="spinner-border" role="status">
                                <span className="sr-only"></span>
                            </div>
                            <div style={{ fontSize: '4vh' }}>Waiting for other players to join...</div>
                        </div>

                        <div className="d-flex align-items-center justify-content-center" style={{ position: 'absolute', top: '60vh', width: '100vw' }}>
                            {users.length > 0 && users.map((user, index) => (
                                <div
                                    className="d-flex flex-column justify-content-center align-items-center"
                                    style={{ height: "20vh", width: '10vw' }}
                                    key={index}
                                >
                                    <img
                                        src={require(`../../avatar/${user.image}`)}
                                        alt="Avatar"
                                        style={{ height: "10vh", width: "10vh" }}
                                    />
                                    <strong
                                        style={{ textAlign: "center" }}
                                    >
                                        {user.name}
                                    </strong>
                                </div>
                            ))}

                        </div>
                    </div>
                )}
        </>
    )
}

export default RoomPage
