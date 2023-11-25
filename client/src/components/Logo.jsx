import React from 'react'
import logo from "../logo192.png";

//logo component 
function Logo() {
  return (
      <header className="App-header" style={{fontSize: 'calc(3vw + 4vh + 10px)', width:'30vw'}}>
          <img src={logo} className="App-logo" alt="logo" style={{height:'calc(3vw + 4vh + 10px)', width:'auto'}}/>
          <div
          >
            Doodler
          </div>
        </header>
  )
}

export default Logo
