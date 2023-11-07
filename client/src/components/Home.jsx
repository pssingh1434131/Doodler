import React from 'react'
import Navbar from './Navbar'
import HomeBody from './HomeBody'

function Home() {
  return (
    <div className='d-flex justify-content-center align-item-center flex-column'>
      <Navbar/ >
      <div className='d-flex justify-content-center'>
        <HomeBody/>
      </div>
    </div>
  )
}

export default Home
