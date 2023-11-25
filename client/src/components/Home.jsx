import React, {useEffect} from 'react'
import Navbar from './Navbar'
import HomeBody from './HomeBody'
import updateStatus from '../services/setStatus'

function Home({socket}) {
  useEffect(() => {
    // Set the user's status to 'online' when they enter the page
    updateStatus('online');

    // Set the status to 'offline' when the user leaves the page
    const handleBeforeUnload = () => {
      updateStatus('offline');
    };

    // Listen for the 'beforeunload' event to detect when the user is leaving the page
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Clean up by setting the status to 'offline' and removing the event listener
      updateStatus('offline');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  return (
    <div className='d-flex justify-content-center align-item-center flex-column'>
      <Navbar chat={true}/>
      <div className='d-flex justify-content-center' style={{marginTop:'8vh'}}>
        <HomeBody socket={socket}/>
      </div>
    </div>
  )
}

export default Home
