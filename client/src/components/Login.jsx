import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setformData] = useState({email:"", password:""});

  const handleemailchange=(event)=>{
    setformData({...formData, email: event.target.value})
  }

  const handlepasschange = (event)=>{
    setformData({...formData, password: event.target.value})
  }

  const submitForm = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/user/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(formData)
    });
    const json = await response.json();
    if (json.success) {
        localStorage.setItem('user', JSON.stringify(json.user));
        navigate("/home");
    } else {
        alert("Invalid credentials");
    }
}


  return (
      <form style={{width:'50%'}}>
        <div className="my-3" style={{fontSize:'3rem', textDecoration:'underline', textAlign:'center'}}>LOGIN</div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control "
            id="exampleInputEmail1"
            value={formData.email}
            aria-describedby="emailHelp"
            placeholder="Enter email"
            onChange={handleemailchange}
          />
          <small id="emailHelp" className="form-text text-muted">
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            value={formData.password}
            placeholder="Password"
            onChange={handlepasschange}/>
        </div>
        <div className="container my-2" style={{textAlign:'center'}}>
          <Link to="/forgotpassword" >Forgot password?</Link></div>
        <button type="submit" onClick={submitForm} className="btn btn-primary" style={{width:'100%'}}>
          Submit
        </button>
        <div className="container my-3 " style={{textAlign:'center'}}>
          <Link to="/signup" style={{fontSize:'1.5rem',textAlign:'center'}}>Create Account</Link></div>
      </form>
  );
}
