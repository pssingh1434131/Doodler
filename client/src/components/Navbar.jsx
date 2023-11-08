import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

function Navbar() {
  const [user, setUser] = useState(null);
  const [showprofile, changeoption] = useState(true);
  const [namechange, changenameoption] = useState(false);
  const [passchange, changepassoption] = useState(false);
  const [imageselect, changeimage] = useState("");
  const [formdata, changeformdata] = useState({ name: "", oldpass: "", pass: "", confpass: "" });
  const ref = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    let userString = localStorage.getItem("user");
    let userData = JSON.parse(userString);
    setUser(userData);
    changeformdata((formdata) => ({ ...formdata, name: userData.name }));
  }, [changeformdata, setUser]);

  const profileModal = () => {
    ref.current.click();
  };

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
  const array = Array(10).fill(null);
  
  const changeImage = (imagename)=>{
    if(imagename!==imageselect)
    changeimage(imagename)
  }

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
  return (
    <div
      className="d-flex flex-row align-items-start"
      style={{ height: "28vh", width: "100vw", justifyContent: "space-evenly" }}
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
            <div className="modal-header justify-content-center">
              <h2
                className="modal-title"
                id="exampleModalLabel"
                style={{ color: "white" }}
              >
                <strong>PROFILE</strong>
              </h2>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={()=>{changeImage("");changeoption(true);changenameoption(false);changepassoption(false);}} style={{ margin: '0px', position: 'absolute', right: '10px' }}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body d-flex" style={{ padding: '0px' }}>
              <div style={{ flex: '0.35', height: '100%', borderRight: "1px solid white", padding: '2vh 0px' }}>
                <h3 style={{ textAlign: 'center' }}>{user.name.toUpperCase()}</h3>
                <h4 style={{ margin: "0px 6%", color: 'black', marginBottom: '1%' }}>username: {user.username}</h4>
                <h4 style={{ margin: "0px 6%", color: 'black' }}>email: {user.email}</h4>
                <div className="d-flex align-items-center justify-content-center flex-column">
                  <button className='playbtn' style={{ backgroundColor: 'orange', margin: '1vh 0px' }} onClick={updatenameoption}>Update Name</button>
                  <button className='playbtn' style={{ backgroundColor: 'orange', margin: '1vh 0px 2vh 0px' }} onClick={updatepassoption}>Update Password</button>
                  {showprofile && <img
                    src={require(`../avatar/${user.image}`)}
                    alt="Avatar"
                    style={{ height: "30vh", width: "30vh" }}
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
                <h2 style={{ textAlign: 'center', margin: '10px' }}>EDIT AVATAR</h2>
                <div className="d-flex align-items-center justify-content-center flex-row flex-wrap" style={{ width: '95%', height: '78%', margin:'auto', padding:'5%' }}>
                {array.map((_, index) => (
                  <img key={index} src={require(`../avatar/Binx_Bond${index}.png`)} alt={`Avatar${index}`} style={{ height: "13vh", width: "13vh", cursor: imageselect !== `Binx_Bond${index}.png` ? "pointer" : 'default', margin:'0.5vh 0.5vw', opacity: imageselect === `Binx_Bond${index}.png` ? 0.7 : 1}} onClick={() => changeImage(`Binx_Bond${index}.png`)}/>
                ))}
                </div>
                <button className='btn btn-primary inputbtn' style={{display:'block', width:'40%', margin:'auto' }} onClick={changeimageserver} disabled={imageselect===""?true:false}>SUBMIT</button>
              </div>
            </div>
          </div>
        </div>
      </div>}
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "20vh" }}
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
        className="d-flex flex-column justify-content-center"
        style={{ height: "20vh" }}
      >
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={logout}
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
}

export default Navbar;
