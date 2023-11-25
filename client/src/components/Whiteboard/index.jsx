import React, { useEffect, useState, useLayoutEffect,useCallback} from "react";
import rough from "roughjs";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const roughGenerator = rough.generator();

const Whiteboard = ({ canvasRef, ctxRef, elements, setElements, tool, color, user, socket, thickness, setThickness }) => {
   // State declarations
  const [img, setImg] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mousePointer, setMousePointer] = useState({ x: 0, y: 0, userName: "" });
  const [showname, changeshowname] = useState(true);
  const [broadcastname, changebroadcast] = useState(true);
  const [mouseusername, setmouseusername] = useState('');  const [isEraserActive, setIsEraserActive] = useState(false);
  const [erasedElements, setErasedElements] = useState([]);
  
 // UseEffect hook for emitting mouse move
  useEffect(() => {
    if(showname) {
      setMousePointer({x:mousePointer.x,y:mousePointer.y,userName:mouseusername});
    }
    else {
      setMousePointer({x:mousePointer.x,y:mousePointer.y,userName:''});
    }
  }, [showname,mouseusername]);

  // UseEffect hook for managing show/hide username
  useEffect(() => {
    if(!user.presenter) return;
    let username = !broadcastname?"":user.name;
    socket.emit('changemousemove',{ x: mousePointer.x, y: mousePointer.y, userName: username });
  }, [broadcastname,user]);

  // Function to draw elements on canvas
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

    // Drawing logic for different shapes

    elements.forEach((element) => {

      ctx.lineWidth = element.strokeWidth || thickness;

      if (isEraserActive && erasedElements.some((erasedElement) => erasedElement === element)) {
        return;
      }
      
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

    if (showname) {
      ctxRef.current.fillStyle = color;
      ctxRef.current.font = "12px Arial";
      ctxRef.current.fillText(mousePointer.userName, mousePointer.x, mousePointer.y + 10);
    }
    else {
      ctxRef.current.fillStyle = color;
      ctxRef.current.font = "12px Arial";
      ctxRef.current.fillText('', mousePointer.x, mousePointer.y + 10);
    }
  }, [canvasRef, ctxRef, elements, color, mousePointer, thickness]);
 

  // UseEffects for socket events, canvas initialization, and drawing elements
  useEffect(() => {
    socket.on("whiteBoardDataResponse", (data) => {
      setImg(data.imgURL);
    });
  }, [socket, canvasRef]);

  useEffect(() => {
    const mouseMove = (data) => {
        setmouseusername(data.userName);
        if(showname) setMousePointer(data);
        else setMousePointer({x:data.x,y:data.y,userName:''});
    }
    socket.on('mouseMove',mouseMove);
    return () => {
      socket.off('mouseMove',mouseMove);
    }
  }, [socket,showname]);

  useEffect(() => {
    if(!ctxRef || !ctxRef.current) return;
    ctxRef.current.fillStyle = color;
    ctxRef.current.font = "12px Arial";
    ctxRef.current.fillText(mousePointer.userName, mousePointer.x, mousePointer.y + 10);
  }, [mousePointer]);

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


  // Function to handle mouse events

  const handleMouseDown = (e) => {           // Logic to handle mouse down event based on the tool selected
    const { offsetX, offsetY } = e.nativeEvent;     
    if (tool === "eraser") {
      setIsEraserActive(true);
      // Simulate erasing by drawing a white square
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "square", // Use square type to simulate erasing
          offsetX,
          offsetY,
          sideLength: thickness, // Use thickness as the side length of the square
          stroke: "#FFFFFF", // White color to simulate erasing
          strokeWidth: thickness, // Use the same thickness for the eraser
        },
      ]);
    }
      else if (tool === "pencil") {
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
    setIsDrawing(true);
}

  const handleMouseMove = (e) => {          // Logic to handle mouse move event based on the tool selected
    const { offsetX, offsetY } = e.nativeEvent;
    let ssusername = showname?user.name:'';        
    setMousePointer({ x: offsetX, y: offsetY, userName: ssusername });
    
    if (isDrawing) {
      if ((isEraserActive && tool === "eraser")) {
        
        setElements((prevElements) => [
          ...prevElements,
          {
            type: "square",
            offsetX,
            offsetY,
            sideLength: thickness, 
            stroke: "#FFFFFF", 
            strokeWidth: thickness, // Using the same thickness for the eraser
          },
        ]);
      }
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
                topWidth: Math.abs(ele.endX - ele.startX) * 0.6, //can adjust the ratio for the top width as needed
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
  
              // Calculating control points for the curve
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
 
    if (isDrawing && isEraserActive) {           // bug to be fixed in case of line and rect
      const elementsToErase = elements.filter((element) => {
        if (element.type === "rect") {
          return (
            offsetX >= element.offsetX &&
            offsetX <= element.offsetX + element.width &&
            offsetY >= element.offsetY &&
            offsetY <= element.offsetY + element.height
          );
        } else if (element.type === "line") {
          // Check if the cursor is close to the line within a small range to consider it for erasing
          const dist = Math.hypot(offsetX - element.offsetX, offsetY - element.offsetY);
          return dist < element.strokeWidth; // Modify this threshold based on the line width
        } else {
          // For other elements, retain the existing logic
          return (
            offsetX >= element.offsetX &&
            offsetX <= element.offsetX + element.width &&
            offsetY >= element.offsetY &&
            offsetY <= element.offsetY + element.height
          );
        }
      });
            
      setErasedElements((prevErasedElements) => [...prevErasedElements, ...elementsToErase]);
    }
    
    let susername = showname?user.name:"";
    let busername = broadcastname?user.name:"";
    setmouseusername(busername);
    setMousePointer({ x: offsetX, y: offsetY, userName: susername });
  };

  const handleMouseUp = () => {     // Logic to handle mouse up event
    setIsDrawing(false);
    setIsEraserActive(false);
  };


  // Conditional rendering based on user role

  if (!user?.presenter) {   
    // Render for non-presenters
    return (
      <>
       {/* Render checkbox for showing/hiding name */}
      {/* Render canvas for the whiteboard */}
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
          Don't broadcast your name
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
