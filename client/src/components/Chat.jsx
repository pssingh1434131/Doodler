import React, {useEffect} from 'react'
import Navbar from './Navbar'
import ChatBody from './ChatBody'
import updateStatus from '../services/setStatus';

function Chat() {
  useEffect(() => {
    updateStatus('online');

    // Set the status to 'offline' when the user leaves the page
    const handleBeforeUnload = () => {
      updateStatus('offline');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      updateStatus('offline');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div className='d-flex justify-content-center align-item-center flex-column' style={{height:'99vh'}}>
      <Navbar chat={false}/>
      <div className='d-flex justify-content-center'>
        <ChatBody user={user} />
      </div>
    </div>
  )
}

export default Chat
