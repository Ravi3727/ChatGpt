import React from 'react'
import ToogleIcon from "@/app/svg/toogleSvg"
import ChatGptSvg from '@/app/svg/chatGptSvg'
import NewChatSvg from '@/app/svg/newChatSvg'
import SearchSvg from '@/app/svg/searchSvg'
import LibrarySvg from '@/app/svg/librarySvg'
import Link from 'next/link'
function ChatFeatures() {

  return (
    <div className='w-full flex flex-col justify-between min-h-48'>
      <div className='flex justify-between w-full px-2 py-2'>
        <div className='p-2'>
          <ChatGptSvg />
        </div>
        <div className='py-2'>
          <ToogleIcon />
        </div>
      </div>
      <div className='p-1'>
        {/* New chat icon */}
        <div className='hover:cursor-pointer  flex justify-between py-2  hover:bg-chatBoxColor rounded-xl px-3 items-center w-full group relative'>
          <Link href="/">
            <div className='flex justify-start gap-3 items-center'>
              <div>
                <NewChatSvg />
              </div>
              <div className='text-sm font-light'>
                New Chat
              </div>
            </div>
          </Link>

          <div className=' flex justify-evenly items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
            <div className='text-xs font-thin'>
              ⇧
            </div>
            <div className='text-xs font-thin'>
              ⌘
            </div>
            <div className='text-xs font-thin'>
              0
            </div>
          </div>
        </div>


        {/* Search Chats */}
        <div className=' hover:cursor-pointer  flex justify-between py-2  hover:bg-chatBoxColor rounded-xl px-3 items-center w-full group relative '>
          <div className='flex justify-start gap-3 items-center '>


            <div>
              <SearchSvg />
            </div>
            <div className='text-sm font-light'>
              Search Chats
            </div>
          </div>

          <div className='flex justify-evenly items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
            <div className='text-xs font-thin'>
              ⌘
            </div>
            <div className='text-xs font-thin'>
              K
            </div>
          </div>
        </div>

        {/* Library */}
        <Link href="/library">
          <div className='hover:cursor-pointer flex justify-start gap-3 py-2 hover:bg-chatBoxColor rounded-xl px-3 items-center w-full'>
            <div>
              <LibrarySvg />
            </div>
            <div className='text-sm font-light'>
              Library
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default ChatFeatures
