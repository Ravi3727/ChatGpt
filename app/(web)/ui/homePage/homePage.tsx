'use client'
import React, { createContext, useMemo, useState } from 'react'
import Navbar from '../navbar/navbar'
import DisplayChats from '../ChatArea/displayChats'
import ChatTextBox from '../ChatArea/chatTextBox'


export const ChatContext = createContext();

function HomePage() {
  const [chats, setChats] = useState([]);
  const chatContextValue = useMemo(() => ({ chats, setChats }), [chats]);

  const hasChats = chats.length > 0;

  return (
    <ChatContext.Provider value={chatContextValue}>
      <div className="min-h-screen flex flex-col p-2 bg-customDark">
        <div className="h-10 flex items-center justify-center text-white">
          <Navbar/>
        </div>

        <div className={`flex-1 mt-4 px-4 ${hasChats ? 'flex flex-col justify-between' : 'flex items-center justify-center flex-col gap-4'}`}>
          {hasChats ? (
            <div className="flex-1 overflow-y-auto w-full p-3 rounded-xl">
              <DisplayChats />
            </div>
          ) : (
            <div className="text-3xl leading-10 text-white mb-4 font-sans">Where should we begin?</div>
          )}
          <div className="w-full">
            <ChatTextBox />
            {hasChats && <div className='text-white text-[12px] text-center'>
              ChatGPT can make mistakes. Check important info. <span className='underline'>See Cookie Preferences.</span>
            </div>}
          </div>
        </div>
      </div>
    </ChatContext.Provider>
  );
}

export default HomePage;