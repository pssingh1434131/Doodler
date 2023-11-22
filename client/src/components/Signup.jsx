import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [confpass, setconfpass] = useState("");

  const handleemailchange = (event) => {
    setformData({ ...formData, email: event.target.value });
  };

  const handlepasschange = (event) => {
    setformData({ ...formData, password: event.target.value });
  };

  const handleconfpasschange = (event) => {
    setconfpass(event.target.value);
  };

  const handlenamechange = (event) => {
    setformData({ ...formData, name: event.target.value });
  };

  const handleunamechange = (event) => {
    setformData({ ...formData, username: event.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/user/signup", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials:"include"
    });
    const json = await response.json();
    if (json.success){
      navigate("/");
    }
    else{
        alert("Invalid credentials");
    }
  }
  return (
    <form style={{ width: "50%" }}>
      <div
        className="my-3"
        style={{
          fontSize: "3rem",
          textDecoration: "underline",
          textAlign: "center",
        }}
      >
        SIGNUP
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputText1">Full name</label>
        <input
          type="text"
          className="form-control"
          id="exampleInputText1"
          value={formData.name}
          aria-describedby="basic-addon1"
          placeholder="Enter full name"
          onChange={handlenamechange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputUname1">Username</label>
        <input
          type="text"
          className="form-control"
          id="exampleInputUname1"
          value={formData.username}
          aria-describedby="basic-addon1"
          placeholder="Enter Username"
          onChange={handleunamechange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">Email address</label>
        <input
          type="email"
          className="form-control "
          id="exampleInputEmail1"
          value={formData.email}
          aria-describedby="emailHelp"
          placeholder="Enter Email"
          onChange={handleemailchange}
        />
        <small id="emailHelp" className="form-text text-muted"></small>
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputPassword1">Password</label>
        <input
          type="password"
          className="form-control"
          id="exampleInputPassword1"
          value={formData.password}
          placeholder="Password"
          onChange={handlepasschange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputPassword2">Confirm Password</label>
        <input
          type="password"
          className="form-control"
          id="exampleInputPassword2"
          value={confpass}
          placeholder="Confirm Password"
          onChange={handleconfpasschange}
          style={confpass !== formData.password?{backgroundColor:'#ffd966'}:{}}
        />
      </div>
      <button
        disabled={confpass !== formData.password}
        type="submit"
        onClick={submitForm}
        className="btn btn-primary"
        style={{ width: "100%" }}
      >
        Submit
      </button>
      <div className="container my-3 " style={{ textAlign: "center" }}>
        <Link to="/" style={{ fontSize: "1rem", textAlign: "center" }}>
          Already have an account?
        </Link>
      </div>
    </form>
  );
}

export default Signup;
