import React from 'react'

function HomeBody() {
  return (
    <div className='d-flex' style={{width:'100vw', padding:'0 18vw'}}>
      <div className="d-flex justify-content-center align-item-center flex-column" style={{height: '60vh',flex:'0.3',backgroundColor:'rgba(68, 68, 193, 0.8)', borderRadius:'50px 0 0 50px'}}>
        <strong style={{textAlign:'center', color:'white', fontSize:'40px', textDecoration:'underline'}}>PLAY NOW</strong>
        <button className='playbtn' style={{backgroundColor:'red'}}>PLAY ONLINE</button>
        <button className='playbtn' style={{backgroundColor:'green'}}>PLAY WITH FRIENDS</button>
        <button className='playbtn' style={{backgroundColor:'blue'}}>PLAY WITH COMPUTER</button>
      </div>
      <div style={{height: '60vh',flex:'0.7',backgroundColor:'rgba(68, 68, 193, 0.8)', borderRadius:' 0 50px 50px 0',borderLeft:"3px solid white"}}>
      
      </div>
    </div>
    
  )
}

export default HomeBody
