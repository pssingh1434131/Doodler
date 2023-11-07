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
          <img src={logo} className="App-logo" alt="logo" />
          <div
          >
            Doodler
          </div>
        </header>
      <div
        className="d-flex flex-column align-items-center justify-content-center flex-wrap"
        style={{
          width: "30%",
          height: "75%",
          backgroundColor: "#d9d9d9",
          borderRadius: "40px",
        }}
      >
        <Signup />
      </div>
    </div>
  );
}

export default Loginpage;
