import ToogleIcon from "@/app/svg/toogleSvg"
import ChatGptSvg from "@/app/svg/chatGptSvg"
import NewChatSvg from "@/app/svg/newChatSvg"
import SearchSvg from "@/app/svg/searchSvg"
import LibrarySvg from "@/app/svg/librarySvg"
import Link from "next/link"
import { SideBarAnimation } from '../../(home)/page-client'
import { useContext } from "react"

function ChatFeatures() {
  const context = useContext(SideBarAnimation);
  const toggleLibrary = context?.toggleLibrary ?? (() => {});
  const revrseToggleLibrary = context?.revrseToggleLibrary ?? (() => {});
  return (
    <div className="w-full px-1 py-2 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="px-3 py-1">
          <ChatGptSvg />
        </div>
        <button className="p-2 text-gray-400 hover:bg-chatBoxColor rounded-lg transition-colors">
          <ToogleIcon />
        </button>
      </div>

      {/* Navigation Items */}
      <div className="">
        {/* New Chat */}
        
          <div onClick={revrseToggleLibrary} className="group flex items-center justify-between px-3 py-2 hover:bg-chatBoxColor rounded-xl transition-colors cursor-pointer">
            <div className="flex items-center space-x-2">
              <NewChatSvg />
              <span className="text-[14px] font-extralight text-white">New chat</span>
            </div>
            <div className="hidden group-hover:flex items-center space-x-1 text-xs text-gray-400">
              <span>⌘</span>
              <span>⇧</span>
              <span>O</span>
            </div>
          </div>
        

        {/* Search Chats */}
        <div className="group flex items-center justify-between px-3 py-2 hover:bg-chatBoxColor rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center space-x-2">
            <SearchSvg />
            <span className="text-[14px] font-extralight">Search chats</span>
          </div>
          <div className="hidden group-hover:flex items-center space-x-1 text-xs text-gray-400">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>

        {/* Library */}

        <div onClick={toggleLibrary} className="flex items-center space-x-2 px-3 py-2 hover:bg-chatBoxColor rounded-xl transition-colors cursor-pointer">
          <LibrarySvg />
          <span className="text-[14px] font-extralight">Library</span>
        </div>

      </div>
    </div>
  )
}

export default ChatFeatures

