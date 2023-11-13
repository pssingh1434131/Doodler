import React from 'react'
import Navbar from './Navbar'
import ChatBody from './ChatBody'

function Chat() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div className='d-flex justify-content-center align-item-center flex-column'>
      <Navbar/>
      <div className='d-flex justify-content-center'>
        <ChatBody user={user} />
      </div>
    </div>
  )
}

export default Chat
