import React, { useEffect, useState, useLayoutEffect } from "react";
import rough from "roughjs";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const roughGenerator = rough.generator();

const Whiteboard = ({ canvasRef, ctxRef, elements, setElements, tool, color, user, socket }) => {
  const [img, setImg] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Move useEffect outside of the if statement
  useEffect(() => {
    socket.on("whiteBoardDataResponse", (data) => {
      setImg(data.imgURL);
    });
  }, [socket, canvasRef]);

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

  }, [color, canvasRef]);

  const drawElements = () => {
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
  };


  // Move useLayoutEffect outside of the if statement
  useLayoutEffect(() => {
    if (!canvasRef || !canvasRef.current) {
      return;
    }
    
    drawElements();
    const canvasImage = canvasRef.current.toDataURL();
    socket.emit("whiteboardData", canvasImage);
  }, [elements, canvasRef, socket]);
  


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

  const handleMouseMove = (e)=>{
    //console.log("mouse move", e)
    const { offsetX, offsetY } = e.nativeEvent;

    if(isDrawing){

        if(tool==="pencil"){
             //pencil by default as static
            const { path } = elements[elements.length-1];
            const newPath = [...path, [offsetX, offsetY]];

            setElements((prevElements) =>
                prevElements.map((ele, index)=>{
                    if(index===elements.length-1){
                        return {
                            ...ele,
                            path: newPath,
                        };
                    }
                    else{
                        return ele;
                    }
                })
            );
        }
        else if(tool=="line"){
            setElements((prevElements) =>
                prevElements.map((ele, index)=>{
                    if(index===elements.length-1){
                        return {
                            ...ele,
                            width: offsetX,
                            height: offsetY,
                        };
                    }
                    else{
                        return ele;
                    }
                })
            );
        }
        else if(tool=="rect"){
            setElements((prevElements) =>
                prevElements.map((ele, index)=>{
                    if(index===elements.length-1){
                        return {
                            ...ele,
                            width: offsetX - ele.offsetX,
                            height: offsetY- ele.offsetY,
                        };
                    }
                    else{
                        return ele;
                    }
                })
            );
        }
        
    }
};

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  if (!user?.presenter) {
    return (
      <div className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3" style={{ height: "500px", width: "100%", backgroundColor: "white" }}>
        <img
          src={img}
          alt="Real Time whiteboard image shared by presenter"
          style={{
            height: window.innerHeight * 2,
            width: "285",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3"
      style={{ height: "500px", width: "100%", backgroundColor: "white" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Whiteboard;
