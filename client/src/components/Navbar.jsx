import React from 'react'
import Logo from './Logo'
import avatar from '../avatar/Binx_Bond0.png'

function Navbar() {
  return (
    <div className='d-flex flex-row align-items-start' style={{height:'28vh', width:'100vw', justifyContent:'space-evenly'}}>
        <div className='d-flex flex-column justify-content-center align-items-center' style={{height:'20vh'}}>
            <img src={avatar} alt='Avatar' style={{height:'10vh', width:'10vh', cursor:'pointer'}}></img>
            <strong style={{textAlign:'center',cursor:'pointer'}}>@pssinjgugolholhgh</strong>
        </div>
      <Logo/>
      <div className='d-flex flex-column justify-content-center' style={{height:'20vh'}}>
      <button type="button" className="btn btn-primary btn-lg">LOGOUT</button>
        </div>
      
    </div>
  )
}

export default Navbar
