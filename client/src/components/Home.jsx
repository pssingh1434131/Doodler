import React from 'react'
import Navbar from './Navbar'
import HomeBody from './HomeBody'

function Home() {
  return (
    <div className='d-flex justify-content-center align-item-center flex-column'>
      <Navbar chat={true}/>
      <div className='d-flex justify-content-center' style={{marginTop:'8vh'}}>
        <HomeBody/>
      </div>
    </div>
  )
}

export default Home
