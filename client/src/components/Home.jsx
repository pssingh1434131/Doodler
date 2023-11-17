import React, {useEffect} from 'react'
import Navbar from './Navbar'
import HomeBody from './HomeBody'
import updateStatus from '../services/setStatus'

function Home() {
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
