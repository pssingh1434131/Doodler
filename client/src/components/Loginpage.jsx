import React from "react";
import Login from "./Login";
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
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          width: "25vw",
          minHeight:'fit-content',
          backgroundColor: "#d9d9d9",
          borderRadius: "40px",
          padding:'4vh 0'
        }}
      >
        <Login />
      </div>
    </div>
  );
}

export default Loginpage;
