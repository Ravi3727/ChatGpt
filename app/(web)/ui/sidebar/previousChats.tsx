import React from 'react';
import ThreeDotsSvg from '@/app/svg/threeDotsSvg';
function PreviousChats() {
  const demoChats: string[] = [
    'Hello Jee!',
    'What is life',
    'How do we survive',
    'Classic DSA',
    'Todays Weather',
  ];

  return (
    <div className='p-2'>
      <div className='px-2 py-2 text-sideBarChat'>
        Chats
      </div>

      <div>
        {demoChats.map((chat, idx) => (
          <div key={idx} className='px-2 py-2 text-sm rounded-xl hover:bg-chatBoxColor flex justify-between items-center group relative'>
            <div>
             {chat}
            </div>
            <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex text-3xl  items-center justify-center '>
              <ThreeDotsSvg/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreviousChats;
