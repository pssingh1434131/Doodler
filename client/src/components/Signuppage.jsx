import React from "react";
import Signup from "./Signup";
import logo from "../logo192.png";

function Loginpage(props) {
  return (
    
    <div
      className="App d-flex justify-content-around align-items-center"
      style={{ height: "100vh"}}
    >
     <header className="App-header">
      <div style={{ width: 'calc(6vw + 6vh + 10px)', height: 'auto', display: 'flex', alignItems: 'center' }}>
        <img src={logo} className="App-logo img-fluid" alt="logo" />
      </div>
      <div>
        Doodler
      </div>
    </header>
     {/* Signup Component Container */}
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          width: "25vw",
          minHeight:'fit-content',
          backgroundColor: "#d9d9d9",
          borderRadius: "40px",
          padding:'2vh 0'
        }}
      >
      {/* Render Signup Component */}
        <Signup />
      </div>
    </div>
  );
}

export default Loginpage;
