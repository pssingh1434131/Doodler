import React, { useEffect, useState, useLayoutEffect, useCallback } from "react";
import rough from "roughjs";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const roughGenerator = rough.generator();

const Whiteboard = ({ canvasRef, ctxRef, elements, setElements, tool, color, user, socket }) => {
  const [img, setImg] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mousePointer, setMousePointer] = useState({ x: 0, y: 0, userName: "" });
  const [showname, changeshowname] = useState(true);
  const [broadcastname, changebroadcast] = useState(true);

  const drawElements = useCallback(() => {
    if (!canvasRef.current || !ctxRef.current) {
      return;
    }

    const roughCanvas = rough.canvas(canvasRef.current);

    if (elements.length > 0) {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    elements.forEach((element) => {
      if (element.type === "rect") {
        roughCanvas.draw(
          roughGenerator.rectangle(element.offsetX, element.offsetY, element.width, element.height, {
            stroke: element.stroke,
            strokeWidth: 5,
            roughness: 0,
          })
        );
      } else if (element.type === "line") {
        roughCanvas.draw(
          roughGenerator.line(element.offsetX, element.offsetY, element.width, element.height, {
            stroke: element.stroke,
            strokeWidth: 5,
            roughness: 0,
          })
        );
      } else if (element.type === "pencil") {
        roughCanvas.linearPath(element.path, {
          stroke: element.stroke,
          strokeWidth: 5,
          roughness: 0,
        });
      }
    });

    roughCanvas.circle(mousePointer.x, mousePointer.y, 5, {
      fill: color,
      roughness: 1,
    });

    if (showname && mousePointer.userName !== "") {
      ctxRef.current.fillStyle = color;
      ctxRef.current.font = "12px Arial";
      ctxRef.current.fillText(mousePointer.userName, mousePointer.x, mousePointer.y + 10);
    }
  }, [canvasRef, ctxRef, elements, color, mousePointer.x, mousePointer.y, mousePointer.userName, showname]);

  useEffect(() => {
    socket.on("whiteBoardDataResponse", (data) => {
      setImg(data.imgURL);
    });
  }, [socket, canvasRef]);

  useEffect(() => {
    socket.on("mouseMove", ({ x, y, userName }) => {
      setMousePointer({ x, y, userName });
    });
  }, [socket]);

  useEffect(() => {
    if (!canvasRef || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    ctxRef.current = ctx;

    drawElements();
  }, [color, canvasRef, ctxRef, drawElements]);

  useLayoutEffect(() => {
    if (!canvasRef || !canvasRef.current) {
      return;
    }

    drawElements();
    const canvasImage = canvasRef.current.toDataURL();
    socket.emit("whiteboardData", canvasImage);
  }, [elements, canvasRef, socket, ctxRef, drawElements]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
        },
      ]);
    } else if (tool === "line") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "line",
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          stroke: color,
        },
      ]);
    } else if (tool === "rect") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "rect",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke: color,
        },
      ]);
    }

    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setMousePointer({ x: offsetX, y: offsetY, userName: user.name });
    
    if (isDrawing) {
      if (tool === "pencil") {
        const { path } = elements[elements.length - 1];
        const newPath = [...path, [offsetX, offsetY]];

        setElements((prevElements) =>
          prevElements.map((ele, index) => (index === elements.length - 1 ? { ...ele, path: newPath } : ele))
        );
      } else if (tool === "line") {
        setElements((prevElements) =>
          prevElements.map((ele, index) =>
            index === elements.length - 1 ? { ...ele, width: offsetX, height: offsetY } : ele
          )
        );
      } else if (tool === "rect") {
        setElements((prevElements) =>
          prevElements.map((ele, index) =>
            index === elements.length - 1
              ? { ...ele, width: offsetX - ele.offsetX, height: offsetY - ele.offsetY }
              : ele
          )
        );
      }

      socket.emit("mouseMove", { x: offsetX, y: offsetY, userName: user.name });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  if (!user?.presenter) {
    return (
      <div
        className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3"
        style={{ height: "60vh", width: "100%", backgroundColor: "white", borderRadius: "20px" }}
      >
        <img
          src={img}
          alt=""
          style={{
            height: window.innerHeight * 2,
            width: window.innerWidth * 2,
          }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="col-md-8 form-check form-switch px-0 mx-auto">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckDefault"
          onClick={() => {
            changeshowname(!showname);
          }}
        />
        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
          {showname === true ? "Don't show name with mouse pointer" : "Show name with mouse pointer"}
        </label>
      </div>
      <div className="col-md-8 form-check form-switch px-0 mx-auto">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckDefault"
          onClick={() => {
            changebroadcast(!broadcastname);
          }}
        />
        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
          {broadcastname === true ? "Don't broadcast your name" : "Broadcast your name"}
        </label>
      </div>
      <div
        className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3"
        style={{ height: "60vh", width: "100%", backgroundColor: "white", borderRadius: "20px" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <canvas ref={canvasRef} />
      </div>
    </>
  );
};

export default Whiteboard;
