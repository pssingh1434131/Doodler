import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "./Logo";

function Navbar(props) {
   // State initialization
  const [user, setUser] = useState(null);
  const [showprofile, changeoption] = useState(true);
  const [namechange, changenameoption] = useState(false);
  const [passchange, changepassoption] = useState(false);
  const [imageselect, changeimage] = useState("");
  const [formdata, changeformdata] = useState({ name: "", oldpass: "", pass: "", confpass: "" });

  // Reference initialization
  const ref = useRef(null);

   // Navigate function initialization
  const navigate = useNavigate();

  // Fetching user data from localStorage
  useEffect(() => {
    let userString = localStorage.getItem("user");
    let userData = JSON.parse(userString);
    setUser(userData);
    changeformdata((formdata) => ({ ...formdata, name: userData.name }));
  }, [changeformdata, setUser]);

  // Function to open the profile modal
  const profileModal = () => {
    ref.current.click();
  };

  // Function to handle showing/hiding options for updating name
  const updatenameoption = () => {
    if (showprofile === true) {
      if (namechange === false) {
        changeoption(false);
        changenameoption(true);
      }
    }
    else {
      if (namechange === true) {
        changeoption(true);
        changenameoption(false);
      }
      else {
        changepassoption(false);
        changenameoption(true);
      }
    }
  }

  // Function to handle showing/hiding options for updating password
  const updatepassoption = () => {
    if (showprofile === true) {
      if (passchange === false) {
        changeoption(false);
        changepassoption(true);
      }
    }
    else {
      if (passchange === true) {
        changeoption(true);
        changepassoption(false);
      }
      else {
        changepassoption(true);
        changenameoption(false);
      }
    }
  }

  // Function to handle logout
  const logout = async () => {
    const response = await fetch("http://localhost:3001/user/logout", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const json = await response.json();
    if (json.success) {
      localStorage.removeItem("user");
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

   // Function to update user's name on the server
  const updatenameserver = async () => {
    setUser({ ...user, name: formdata.name });
    const response = await fetch("http://localhost:3001/user/updatename", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name: formdata.name })
    });
    const json = await response.json();
    if (json.success) {
      let tempuser = JSON.parse(localStorage.getItem("user"));
      tempuser.name = formdata.name;
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(tempuser));
    } else {
      alert("Invalid credentials");
    }
    changeoption(true);
    changenameoption(false);
    changepassoption(false);
  }

  // Function to update user's password on the server
  const updatepassserver = async () => {
    const response = await fetch("http://localhost:3001/user/updatepass", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ oldpassword: formdata.oldpass, newpassword: formdata.pass })
    });
    const json = await response.json();
    if (json.success) {
      changeoption(true);
      changenameoption(false);
      changepassoption(false);
      changeformdata({ ...formdata, pass: "", confpass: "", oldpass: "" });
    } else {
      alert("Invalid credentials");
    }
  }
  const array = Array(10).fill(null);   // Generating an array of elements
  
  // Function to handle image selection
  const changeImage = (imagename)=>{
    if(imagename!==imageselect)
    changeimage(imagename)
  }

  // Function to update user's avatar on the server
  const changeimageserver = async ()=>{
    setUser({ ...user, image: imageselect });
    const response = await fetch("http://localhost:3001/user/updateavatar", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ avatar: imageselect })
    });
    const json = await response.json();
    if (json.success) {
      let tempuser = JSON.parse(localStorage.getItem("user"));
      tempuser.image = imageselect;
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(tempuser));
    } else {
      alert("Invalid credentials");
    }
    changeimage("");
  }

   // JSX elements representing the Navbar
  return (
    <div
      className="d-flex flex-row align-items-start"
      style={{ height: "20vh", width: "100vw", justifyContent: "space-evenly" }}
    >
      <button
        type="button"
        ref={ref}
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModal"
        style={{ display: "none" }}
      ></button>

      {user && <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document" style={{ maxWidth: "70vw", width: "80%", maxHeight: '94vh', height: '100%', display: 'flex', alignItems: 'center', color: 'white' }}>
          <div
            className="modal-content"
            style={{ backgroundColor: "#d9ac9e", height: '70vh', borderRadius: '40px' }}
          >
            <div className="modal-header justify-content-center" style={{minHeight:'fit-content'}}>
              <h2
                className="modal-title"
                id="exampleModalLabel"
                style={{ color: "white", fontSize:'3vh' }}
              >
                <strong>PROFILE</strong>
              </h2>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={()=>{changeImage("");changeoption(true);changenameoption(false);changepassoption(false);}} style={{ margin: '0px', position: 'absolute', right: '10px' }}>
                <span aria-hidden="true" style={{ fontSize:'2.5vh' }}>&times;</span>
              </button>
            </div>
            <div className="modal-body d-flex" style={{ padding: '0px' }}>
              <div className="d-flex justify-content-center flex-column" style={{ flex: '0.35', height: '100%', borderRight: "1px solid white"}}>
                <div style={{ textAlign: 'center', fontSize: 'calc(1vw + 1vh + 10px)' }}>{user.name.toUpperCase()}</div>
                <div style={{ margin: "0px 6%",fontSize: 'calc(0.4vw + 0.4vh + 10px)', color: 'black', marginBottom: '1%' }}>username: {user.username}</div>
                <div style={{ margin: "0px 6%",fontSize: 'calc(0.4vw + 0.4vh + 10px)', color: 'black'}}>email: {user.email}</div>
                <div className="d-flex align-items-center justify-content-around flex-column">
                  <div className='d-flex flex-column align-items-center justify-content-around' style={{width:'100%'}}>
                  <button className='updbtn' style={{ backgroundColor: 'orange'}} onClick={updatenameoption}>Update Name</button>
                  <button className='updbtn' style={{ backgroundColor: 'orange'}} onClick={updatepassoption}>Update Password</button>
                  </div>
                  {showprofile && <img
                    src={require(`../avatar/${user.image}`)}
                    alt="Avatar"
                    style={{ width: 'calc(6vw + 12vh + 10px)'}}
                  />}
                  {namechange && <div className="d-flex align-items-center justify-content-center flex-column" style={{ width: '80%', height: "28vh" }}>
                    <input className='inputbtn' type="text" value={formdata.name} placeholder="Enter Name" onChange={(event) => { changeformdata({ ...formdata, name: event.target.value }) }} />
                    <button className='inputbtn' style={{ backgroundColor: 'blue', cursor: 'pointer', color: 'white' }} onClick={updatenameserver}>SUBMIT</button>
                  </div>}
                  {passchange && <div className="d-flex align-items-center justify-content-center flex-column" style={{ width: '80%' }}>
                    <input className='inputbtn' type="password" value={formdata.oldpass} placeholder="Old Password" onChange={(event) => { changeformdata({ ...formdata, oldpass: event.target.value }) }} />
                    <input className='inputbtn' type="password" value={formdata.pass} placeholder="Password" onChange={(event) => { changeformdata({ ...formdata, pass: event.target.value }) }} />
                    <input className='inputbtn' type="password" value={formdata.confpass} style={formdata.pass !== formdata.confpass ? { backgroundColor: '#ffd966' } : {}} placeholder="Confirm Password" onChange={(event) => { changeformdata({ ...formdata, confpass: event.target.value }) }} />
                    <button className='btn btn-primary inputbtn' style={{ backgroundColor: 'blue', color: 'white' }} onClick={updatepassserver} disabled={formdata.pass !== formdata.confpass}>SUBMIT</button>
                  </div>}
                </div>
              </div>
              <div style={{ flex: '0.65', height: '100%', padding:'auto' }}>
                <h2 style={{ textAlign: 'center', margin: '1vh' }}>EDIT AVATAR</h2>
                <div className="d-flex align-items-center justify-content-center flex-row flex-wrap" style={{ width: '40vw', height: '45vh', margin:'auto', padding:'5vh' }}>
                {array.map((_, index) => (
                  <img key={index} src={require(`../avatar/Binx_Bond${index}.png`)} alt={`Avatar${index}`} style={{ height: 'calc(2.5vw + 5vh + 10px)', cursor: imageselect !== `Binx_Bond${index}.png` ? "pointer" : 'default', margin:'0.5vh 0.5vw', opacity: imageselect === `Binx_Bond${index}.png` ? 0.7 : 1}} onClick={() => changeImage(`Binx_Bond${index}.png`)}/>
                ))}
                </div>
                <button className='btn btn-primary inputbtn' style={{display:'block', width:'20vw', height:'6vh', margin:'auto' }} onClick={changeimageserver} disabled={imageselect===""?true:false}>SUBMIT</button>
              </div>
            </div>
          </div>
        </div>
      </div>}
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "20vh", width:'10vw' }}
      >
        {user && user.image && (
          <img
            src={require(`../avatar/${user.image}`)}
            alt="Avatar"
            style={{ height: "10vh", width: "10vh", cursor: "pointer" }}
            onClick={profileModal}
          />
        )}
        {user && user.username && (
          <strong
            style={{ textAlign: "center", cursor: "pointer" }}
            onClick={profileModal}
          >
            @{user.username}
          </strong>
        )}
      </div>
      <Logo />
      <div
        className="d-flex flex-row justify-content-around align-items-center"
        style={{ marginTop:'8vh', width:'10vw'}}
      >
       {props.chat&&<Link to="/chat"><img src={require("../chat.png")} alt="chat" style={{width:'50px'}} onMouseOver={(e)=>{e.target.style.opacity = '0.7';}} onMouseLeave={(e)=>{e.target.style.opacity='1'}} /></Link>}

        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={logout}
          style={{minWidth:'fit-content', fontSize:'calc(0.5vw + 1vh)'}}
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
}

// Default prop for chat option
Navbar.defaultProps = {
  char: true
};

export default Navbar;
