import { useRef, useState } from "react"
import "./index.css"
import Whiteboard from "../../components/Whiteboard";
import Chat from "../../components/Chat/index";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"

const RoomPage = ({ user, socket, users }) => {

    const canvasRef = useRef(null);
    const ctxRef = useRef(null);


    const [tool, setTool] = useState("pencil");
    const [color, setColor] = useState("black");
    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([]);
    const [openedUserTab, setOpenedUserTab] = useState(false);
    const [openedChatTab, setOpenedChatTab] = useState(false);


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


    return (
        <div className="row" style={{ height: '100vh' }}>
            <divc className="d-flex justify-content-start align-items-center" style={{position:'absolute', top: "5%"}}>
                <button
                    type="button"
                    className="btn btn-dark"
                    style={{height: "40px", minHeight:'fit-content', width: "5vw", minWidth:'fit-content', zIndex: 1, margin:'0px 2vw' }}
                    onClick={() => setOpenedUserTab(true)}
                >
                    Users
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    style={{ height: "40px", minHeight:'fit-content', width: "5vw", minWidth:'fit-content',zIndex: 1, margin:'0px 1vw'}}
                    onClick={() => setOpenedChatTab(true)}
                >
                    Chats
                </button>
            </divc>

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
                                        <p key={index * 999} className="my-2  text-center w-100" style={{border:'1px solid white', borderRadius:'5px', padding:'1px 0px'}}>
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
                    <Chat setOpenedChatTab={setOpenedChatTab} socket={socket} />
                )
            }
            <div className="text-center" style={{ fontSize: 'calc(1vh + 1vw + 10px)' }}>White Board <span className="" style={{ color: "blue" }}>[Users Online: {users.length}]</span></div>
            {
                <div className="col-md-10 mx-auto px-5 mb-3 d-flex align-items-center justify-content-center">
                    <div className="d-flex col-md-3 gap-3 justify-content-center gap-1">
                        <div className="d-flex gap-1">
                            <label htmlFor="pencil">Pencil</label>
                            <input
                                type="radio"
                                name="tool"
                                id="pencil"
                                value="pencil"
                                checked={tool === "pencil"}
                                className="mt-1"
                                onChange={(e) => setTool(e.target.value)}
                                disabled={!user?.presenter}
                            />
                        </div>
                        <div className="d-flex gap-1">
                            <label htmlFor="line">Line</label>
                            <input
                                type="radio"
                                name="tool"
                                id="line"
                                value="line"
                                checked={tool === "line"}
                                className="mt-1"
                                onChange={(e) => setTool(e.target.value)}
                                disabled={!user?.presenter}
                            />
                        </div>
                        <div className="d-flex gap-1">
                            <label htmlFor="rect">Rectangle</label>
                            <input
                                type="radio"
                                name="tool"
                                id="rect"
                                value="rect"
                                checked={tool === "rect"}
                                className="mt-1"
                                onChange={(e) => setTool(e.target.value)}
                                disabled={!user?.presenter}
                            />
                        </div>
                    </div>
                    <div className="col-md-2 mx-auto">
                        <div className="d-flex align-items-center ">
                            <label htmlFor="color">Select Color: </label>
                            <input
                                type="color"
                                id="color"
                                className="mt-1 ms-2"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                disabled={!user?.presenter}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 d-flex gap-2">
                        <button className="btn btn-primary mt-1"
                            disabled={elements.length === 0 || !user?.presenter}
                            onClick={() => undo()}
                        >Undo</button>
                        <button className="btn btn-outline-primary mt-1"
                            disabled={history.length < 1 || !user?.presenter}
                            onClick={() => redo()}
                        >Redo</button>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-danger" onClick={handleClearCanvas} disabled={!user?.presenter}>Clear Canvas</button>
                    </div>
                </div>
            }

            <div className="col-md-10 mx-auto mt-4 canvas-box ">
                <Whiteboard
                    canvasRef={canvasRef}
                    ctxRef={ctxRef}
                    elements={elements}
                    setElements={setElements}
                    color={color}
                    tool={tool}
                    user={user}
                    socket={socket}
                />
            </div>
        </div>
    )
}

export default RoomPage
