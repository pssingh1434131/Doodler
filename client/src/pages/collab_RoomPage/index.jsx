import { useRef, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./index.css"
import CollabWhiteBoard from "../../components/collabWhiteBoard";
import Chat from "../../components/Chat/index";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"
import { BsDownload } from 'react-icons/bs';
import updateStatus from "../../services/setStatus";

const CollabRoomPage = ({ socket, users }) => {
    const user = JSON.parse(localStorage.getItem('roomdata'));

    //console.log(user.userId)

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


    useEffect(() => {
        updateStatus('busy');

        // Set the status to 'offline' when the user leaves the page
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
        const handleReceivedMessage = (data) => {
            setChat((prevChats) => [...prevChats, data]);
        };

        // Subscribing to the "messageResponse" event
        socket.on("messageResponse", handleReceivedMessage);

        // Cleaning up the event listener
        return () => {
            socket.off("messageResponse", handleReceivedMessage);
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

        // Draw the content from the original canvas onto the temporary canvas
        tempCtx.drawImage(canvas, 0, 0, canvas.width * scaleFactor, canvas.height * scaleFactor);


        tempCanvas.toBlob((blob) => {

            const link = document.createElement('a');
            link.download = 'whiteboard_drawing.png'; //Can Change the file name and extension as needed

            link.href = window.URL.createObjectURL(blob);
            link.click();

            window.URL.revokeObjectURL(link.href); // Clean up the Blob URL after download

        }, 'image/png');
    };




    const handleDisconnect = () => {
        // Emit an event to signal the user's disconnection
        socket.emit("Userdisconnect", user); // 'user' contains user information
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
                    // Apply new thickness only to the current drawing element
                    return {
                        ...element,
                        strokeWidth: newThickness,
                    };
                }
                return element;
            })
        );
    };



    return (
        <div className="row" style={{ height: '100vh' }}>
            <div className="d-flex justify-content-start align-items-center" style={{ position: 'absolute', top: "10px" }}>
                <Link to="/play" style={{ width: '10vw', minWidth: 'fit-content', padding: '0px 1vw', cursor: 'pointer' }} >
                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ height: "40px", minHeight: 'fit-content', width: "5vw", minWidth: 'fit-content', zIndex: 1 }}
                        onClick={() => handleDisconnect()}
                    >
                        &laquo; BACK
                    </button></Link>
            </div>

            <div className="d-flex justify-content-end align-items-center" style={{ position: 'absolute', top: "20px", marginRight: "50px" }}>
                <button
                    type="button"
                    className="btn btn-secondary d-flex align-items-center"
                    style={{ height: "40px", minHeight: 'fit-content', width: "5vw", minWidth: 'fit-content', zIndex: 1, margin: '0px 1vw', fontSize: '18px' }}
                    onClick={handleDownload}
                >
                    <BsDownload style={{ marginRight: '5px' }} />
                    <strong>Download</strong>
                </button>
            </div>

            <div className="d-flex justify-content-start align-items-center" style={{position:'absolute', top: "10px", marginLeft:"200px"}}>
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

            {
                openedUserTab && (
                    <div
                        className="position-fixed top-0 h-100 text-white bg-dark"
                        style={{ width: "15vw", left: "0%", zIndex: 2, background: "white" }}>
                        <button
                            type="button"
                            onClick={() => setOpenedUserTab(false)}
                            className="btn btn-light btn-block w-100 mt-5"
                        >
                            Close
                        </button>
                        {
                            <div className="w-100 mt-5 pt-5">
                                {
                                    users.map((usr, index) => (
                                        <p key={index * 999} className="my-2  text-center w-100" style={{ border: '1px solid white', borderRadius: '5px', padding: '1px 0px' }}>
                                            {usr.name} {user && user.userId === usr.userId && "(You)"}
                                        </p>
                                    ))
                                }
                            </div>
                        }
                    </div>
                )
            }
            {
                openedChatTab && (
                    <Chat setOpenedChatTab={setOpenedChatTab} socket={socket} chat={chat} setChat={setChat} />
                )
            }
            <div className="text-center" style={{ fontWeight: "bold"}}></div>
            {
                <div className="col-md-10 mx-auto px-1 mb-3 d-flex align-items-center justify-content-center">
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
                                //disabled={!user?.presenter}
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
                                //disabled={!user?.presenter}
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
                            //disabled={!user?.presenter}
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
                                //disabled={!user?.presenter}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 d-flex gap-2">
                        <button className="btn btn-primary mt-1"
                            disabled={elements.length === 0 }
                            onClick={() => undo()}
                            style={{ marginLeft: "60px", fontWeight: "bold" }}
                        >Undo</button>
                        <button className="btn btn-outline-primary mt-1"
                            disabled={history.length < 1 }
                            onClick={() => redo()}
                            style={{ fontWeight: "bold" }}
                        >Redo</button>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-danger" onClick={handleClearCanvas}  style={{ fontWeight: "bold" }}>Clear Canvas</button>
                    </div>
                </div>
            }

            <div className="col-md-12 mx-auto mt-5 canvas-box "  >
                <CollabWhiteBoard
                    canvasRef={canvasRef}
                    ctxRef={ctxRef}
                    elements={elements}
                    setElements={setElements}
                    color={color}
                    tool={tool}
                    user={user}
                    socket={socket}
                    thickness={thickness}
                    setThickness={setThickness}
                />
            </div>
        </div>
    )
}

export default CollabRoomPage
