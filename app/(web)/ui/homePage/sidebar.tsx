import React from 'react'
import ChatFeatures from '../sidebar/chatFeatures'
import PreviousChats from '../sidebar/previousChats'

function Sidebar() {
  return (
    <div className='text-white flex flex-col '>
      <div>
        <ChatFeatures/>
      </div>

      <div>
        <PreviousChats/>
      </div>
    </div>
  )
}

export default Sidebar