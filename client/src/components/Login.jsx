import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Update email state on input change
  const handleEmailChange = (event) => {
    setFormData({ ...formData, email: event.target.value });
  };

  
  // Update password state on input change
  const handlePassChange = (event) => {
    setFormData({ ...formData, password: event.target.value });
  };

   // Handle form submission
  const submitForm = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/user/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(formData)
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem('user', JSON.stringify(json.user));
      navigate("/home");
    } else {
      alert("Invalid credentials");
    }
  };
// render UI of form
  return (
    <form>
      <div className="my-3" style={{ fontSize: 'calc(1vw + 1vh + 10px)', textDecoration: 'underline', textAlign: 'center' }}>LOGIN</div>
      <div className="form-group" style={{ marginBottom: '2%' }}>
        <label htmlFor="exampleInputEmail1">Email address</label>
        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          value={formData.email}
          aria-describedby="emailHelp"
          placeholder="Enter email"
          onChange={handleEmailChange}
        />
        <small id="emailHelp" className="form-text text-muted"></small>
      </div>
      <div className="form-group" style={{ marginBottom: '2%' }}>
        <label htmlFor="exampleInputPassword1">Password</label>
        <input
          type="password"
          className="form-control"
          id="exampleInputPassword1"
          value={formData.password}
          placeholder="Password"
          onChange={handlePassChange} />
      </div>
      <div className="container my-2" style={{ textAlign: 'center', width: '100%' }}>
        <Link to="/forgotpassword">Forgot password?</Link>
      </div>
      <button type="submit" onClick={submitForm} className="btn btn-primary" style={{ width: '100%' }}>
        Submit
      </button>
      <div className="container my-3" style={{ textAlign: 'center', width: '100%' }}>
        <Link to="/signup" style={{ fontSize: 'calc(0.5vw + 0.5vh + 10px)', textAlign: 'center' }}>Create Account</Link>
      </div>
    </form>
  );
}
