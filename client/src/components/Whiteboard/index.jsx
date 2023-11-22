import React, { useEffect, useState, useLayoutEffect,useCallback} from "react";
import rough from "roughjs";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const roughGenerator = rough.generator();

const Whiteboard = ({ canvasRef, ctxRef, elements, setElements, tool, color, user, socket, thickness, setThickness }) => {
  const [img, setImg] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mousePointer, setMousePointer] = useState({ x: 0, y: 0, userName: "" });
  const [showname, changeshowname] = useState(true);
  const [broadcastname, changebroadcast] = useState(true);

  const [isErasing, setIsErasing] = useState(false);
  

  const drawElements = useCallback(() => {
    if (!canvasRef.current || !ctxRef.current) {
      return;
    }

    const roughCanvas = rough.canvas(canvasRef.current);
    const ctx = canvasRef.current.getContext("2d");

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (elements.length > 0) {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    elements.forEach((element) => {

      

      ctx.lineWidth = element.strokeWidth || thickness;
      
      if (element.type === "ellipse") {
        roughCanvas.draw(
          roughGenerator.ellipse(
            (element.startX + element.endX) / 2,
            (element.startY + element.endY) / 2,
            Math.abs(element.endX - element.startX),
            Math.abs(element.endY - element.startY),
            {
              stroke: element.stroke,
              strokeWidth: element.strokeWidth ,
              roughness: 0,
            }
          )
        );
      }
      else if (element.type === "trapezium") {
        const x1 = element.startX;
        const y1 = element.startY;
        const x2 = element.endX;
        const y2 = element.endY;
        const baseWidth = element.baseWidth;
        const topWidth = element.topWidth;
      
        const trapeziumPath = [
          [x1, y1],
          [x2, y1],
          [x2 - (baseWidth - topWidth) / 2, y2],
          [x1 + (baseWidth - topWidth) / 2, y2],
        ];
      
        roughCanvas.draw(
          roughGenerator.polygon(trapeziumPath, {
            stroke: element.stroke,
            roughness: 0,
            strokeWidth: element.strokeWidth ,
          })
        );
      }
      else if (element.type === "square") {
        roughCanvas.draw(
          roughGenerator.rectangle(
            element.offsetX,
            element.offsetY,
            element.sideLength,
            element.sideLength,
            {
              stroke: element.stroke,
              strokeWidth: element.strokeWidth,
              roughness: 0,
            }
          )
        );
      }
      else if (element.type === "circle") {
        roughCanvas.draw(
          roughGenerator.circle(element.offsetX, element.offsetY, element.radius * 2, {
            stroke: element.stroke,
            strokeWidth: element.strokeWidth ,
            roughness: 0,
          })
        );
      }
      else if (element.type === "rect") {
        roughCanvas.draw(
          roughGenerator.rectangle(element.offsetX, element.offsetY, element.width, element.height, {
            stroke: element.stroke,
            strokeWidth: element.strokeWidth,
            roughness: 0,
          })
        );
      } else if (element.type === "line") {
        roughCanvas.draw(
          roughGenerator.line(element.offsetX, element.offsetY, element.width, element.height, {
            stroke: element.stroke,
            strokeWidth: element.strokeWidth ,
            roughness: 0,
          })
        );
      } else if (element.type === "pencil") {
        roughCanvas.linearPath(element.path, {
          stroke: element.stroke,
          strokeWidth: element.strokeWidth ,
          roughness: 0,
        });
      }
      else if (element.type === "quadraticCurvy" && element.points.length >= 2) {
        const curvePoints = element.points.map(({ x, y }) => [x, y]);
        const path = roughGenerator.curve(curvePoints, {
          stroke: element.stroke,
          strokeWidth: element.strokeWidth ,
          roughness: 0,
          curve: "quadraticBezier", // Use quadratic Bezier curve
        });
        roughCanvas.draw(path);
      }
    });

    ctx.lineWidth = thickness;
    roughCanvas.circle(mousePointer.x, mousePointer.y, 5, {
      fill: color,
      roughness: 1,
    });

    if (showname && mousePointer.userName !== "") {
      ctxRef.current.fillStyle = color;
      ctxRef.current.font = "12px Arial";
      ctxRef.current.fillText(mousePointer.userName, mousePointer.x, mousePointer.y + 10);
    }
  }, [canvasRef, ctxRef, elements, color, mousePointer.x, mousePointer.y, mousePointer.userName, showname, thickness]);
 
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
    ctx.lineCap = "round";
    ctx.lineWidth = thickness;

    ctxRef.current = ctx;

    drawElements();

  }, [color, canvasRef, ctxRef, drawElements, thickness]);


  
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
          strokeWidth: thickness,
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
          strokeWidth: thickness,
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
          strokeWidth: thickness,
        },
      ]);
    } else if (tool === "circle") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "circle",
          offsetX,
          offsetY,
          radius: 0,
          stroke: color,
          strokeWidth: thickness,
        },
      ]);
    } else if (tool === "square") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "square",
          offsetX,
          offsetY,
          sideLength: 0,
          stroke: color,
          strokeWidth: thickness,
        },
      ]);
    } else if (tool === "trapezium") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "trapezium",
          startX: offsetX,
          startY: offsetY,
          endX: offsetX,
          endY: offsetY,
          baseWidth: 0,
          topWidth: 0,
          stroke: color,
          strokeWidth: thickness,
        },
      ]);
    }else if (tool === "ellipse") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "ellipse",
          startX: offsetX,
          startY: offsetY,
          endX: offsetX,
          endY: offsetY,
          stroke: color,
          strokeWidth: thickness,
        },
      ]);
    } 
    else if (tool === "quadraticCurvy") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "quadraticCurvy",
          points: [{ x: offsetX, y: offsetY }, { x: offsetX, y: offsetY }], // Start and end point are initially the same
          stroke: color,
          strokeWidth: thickness,
        },
      ]);
      setIsDrawing(true);
    }
    else if (tool === "eraser") {
      setIsErasing(true);
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
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
              };
            }
            else {
              return ele;
            }
          })
        );
      } else if (tool === "circle") {
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              const radius = Math.sqrt((offsetX - ele.offsetX)**2 + (offsetY - ele.offsetY)**2);
              return {
                ...ele,
                radius,
              };
            } else {
              return ele;
            }
          })
        );
      }else if (tool === "square") {
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              const sideLength = Math.abs(offsetX - ele.offsetX); // Assuming square drawn based on the difference in X coordinates
              return {
                ...ele,
                sideLength,
              };
            } else {
              return ele;
            }
          })
        );
      } else if (tool === "trapezium") {
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                endX: offsetX,
                endY: offsetY,
                baseWidth: Math.abs(offsetX - ele.startX),
                topWidth: Math.abs(ele.endX - ele.startX) * 0.6, // You can adjust the ratio for the top width as needed
              };
            } else {
              return ele;
            }
          })
        );
      }else if (tool === "ellipse") {
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                endX: offsetX,
                endY: offsetY,
              };
            } else {
              return ele;
            }
          })
        );
      }
      else if (tool === "quadraticCurvy") {
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              const updatedPoints = ele.points;
              const length = updatedPoints.length;
  
              // Update the endpoint for the line
              updatedPoints[length - 1] = { x: offsetX, y: offsetY };
  
              // Calculate control points for the curve
              const controlX = (updatedPoints[0].x + offsetX) / 2;
              const controlY = (updatedPoints[0].y + offsetY) / 2;
  
              updatedPoints.splice(1, 1, { x: controlX, y: controlY });
  
              return {
                ...ele,
                points: updatedPoints,
              };
            } else {
              return ele;
            }
          })
        );
      }
    }
    if (isErasing) {
      const ctx = canvasRef.current.getContext("2d");
  
      
      const eraserSize = 20; // Define the size of the eraser
      ctx.clearRect(
        offsetX - eraserSize / 2,
        offsetY - eraserSize / 2,
        eraserSize,
        eraserSize
      );
    }
    socket.emit("mouseMove", { x: offsetX, y: offsetY, userName: user.name });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsErasing(false);

  };

  if (!user?.presenter) {
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
        style={{ height: "70vh", width: "100%", backgroundColor: "white", borderRadius: "20px" }}
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
      </> 
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
        style={{ height: "70vh", width: "100%", backgroundColor: "white", borderRadius: "20px" }}
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
