import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../logo192.png";

function Forgotpassword() {
  // Initializing state variables
  const navigate = useNavigate();
  const [email, setemail] = useState('');
  const [otp, setotp] = useState('');
  const [otpsent, setOtpsent] = useState(false);
  const [curotp, setCurotp] = useState('');
  const [reset, setreset] = useState(false);
  const [password, setPassword] = useState('');
  const [confpass, setConfpass] = useState('');

// Event handlers for input changes
  const handleEmailChange = (event) => {
    setemail(event.target.value);
  };

  const handleOtpChange = (event) => {
    setCurotp(event.target.value);
  };

  const handlepasschange = (event) => {
    setPassword(event.target.value);
  };

  const handleconfpasschange = (event) => {
    setConfpass(event.target.value);
  };

  // Function to submit email for password reset
  const submitForm = async (e) => {
    e.preventDefault();
    let data = { email: email };
    setemail('');
    const response = await fetch("http://localhost:3001/user/forgotpassword", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    const json = await response.json();
    if (json.success) {
      setotp(json.otp);
      setOtpsent(true);
    }
    else {
      alert(json.msg);
    }
  };

  // Function to submit OTP verification
  const submitForm2 = async (e) => {
    e.preventDefault();
    if (otp == curotp) {
      setreset(true);
      setCurotp('');
    }
    else {
      alert('enter otp again');
      setCurotp('');
    }
  };

  // Function to submit new password
  const submitForm3 = async (e) => {
    e.preventDefault();
    if (password === confpass) {
      const response = await fetch("http://localhost:3001/user/resetpass", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: email, password: password })
      });
      const json = await response.json();
      if (json.success) {
        navigate('/home');
      } else {
        alert("error in reseting password");
        navigate('/forgotpassword');
      }
    }
    else alert('both passwords are not equal');
  };

 // JSX rendering of the forgot password form
  return (
    <div
      className="App d-flex justify-content-around align-items-center"
      style={{ height: "100vh" }}
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
          minHeight: 'fit-content',
          backgroundColor: "#d9d9d9",
          borderRadius: "40px",
          padding: '4vh 0'
        }}
      >
        {!otpsent && <form>
          <div className="my-3" style={{ fontSize: 'calc(1vw + 1vh + 10px)', textDecoration: 'underline', textAlign: 'center' }}>Forgot Password</div>
          <div className="form-group" style={{ marginBottom: '2%' }}>
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              value={email}
              aria-describedby="emailHelp"
              placeholder="Enter email"
              onChange={handleEmailChange}
            />
            <small id="emailHelp" className="form-text text-muted"></small>
          </div>
          <button type="submit" onClick={submitForm} className="btn btn-primary" style={{ width: '100%' ,marginBottom:'5vh', marginTop:'1vh' }}>
            Submit
          </button>
        </form>}
        {(otpsent && !reset) && <form>
          <div className="my-3" style={{ fontSize: 'calc(1vw + 1vh + 10px)', textDecoration: 'underline', textAlign: 'center' }}>Enter Otp</div>
          <div className="form-group" style={{ marginBottom: '2%' }}>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              value={curotp}
              aria-describedby="emailHelp"
              placeholder="Enter Otp"
              onChange={handleOtpChange}
            />
            <small id="emailHelp" className="form-text text-muted"></small>
          </div>
          <button type="submit" onClick={submitForm2} className="btn btn-primary" style={{ width: '100%',marginBottom:'5vh', marginTop:'1vh' }}>
            Submit
          </button>
        </form>}
        {reset && <form>
          <div className="my-3" style={{ fontSize: 'calc(1vw + 1vh + 10px)', textDecoration: 'underline', textAlign: 'center' }}>Reset Password</div>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              type="email"
              className="form-control "
              id="exampleInputEmail1"
              value={email}
              aria-describedby="emailHelp"
              placeholder="Enter Email"
              onChange={handleEmailChange}
            />
            <small id="emailHelp" className="form-text text-muted"></small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              value={password}
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
              style={confpass !== password ? { backgroundColor: '#ffd966' } : {}}
            />
          </div>
          <button type="submit" onClick={submitForm3} className="btn btn-primary" style={{ width: '100%',marginBottom:'5vh', marginTop:'1vh' }}>
            Submit
          </button>
        </form>}
      </div>
    </div>
  );
}

export default Forgotpassword
