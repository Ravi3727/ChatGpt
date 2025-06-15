"use client"
import React, { createContext, useEffect, useMemo, useState } from "react"
import Navbar from "../navbar/navbar"
import DisplayChats from "../ChatArea/displayChats"
import ChatTextBox from "../ChatArea/chatTextBox"
import { useParams } from "next/navigation"

export type ChatType = {
  _id: string
  question: string
  answer: string
  fileUrls?: string
}

export type ChatContextType = {
  chats: ChatType[]
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>
}
export const ChatContext = createContext<ChatContextType>({
  chats: [],
  setChats: () => {},
})

function HomePage() {
  const [chats, setChats] = useState<ChatType[]>([])
  const params = useParams()
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    let id = params.chatId || "random"
    if (Array.isArray(id)) id = id[0]
    localStorage.setItem("chatId", id)
  }, [params.chatId])

  const chatContextValue = useMemo(() => ({ chats, setChats }), [chats])
  const hasChats = chats.length > 0

  return (
    <ChatContext.Provider value={chatContextValue}>
      <div className="h-full flex flex-col">
        {/* Navbar */}
        <div className="flex-shrink-0 h-12 sm:h-14 flex items-center justify-center px-3 sm:px-4">
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {params.chatId !== undefined ? (
            <>
              {/* Chat Display Area */}
              <div className="flex-1 overflow-y-auto px-2 sm:px-4">
                <DisplayChats />
              </div>

              {/* Chat Input */}
              <div className="flex-shrink-0 px-2 sm:px-4 pb-2 sm:pb-4">
                <ChatTextBox />
                <div className="text-white text-xs text-center mt-2 px-4">
                  ChatGPT can make mistakes. Check important info.{" "}
                  <span className="underline cursor-pointer">See Cookie Preferences.</span>
                </div>
              </div>
            </>
          ) : (
            /* Welcome Screen */
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20 ">
              <div className="text-2xl sm:text-3xl lg:text-3xl leading-20 text-center text-white mb-8 font-light max-w-2xl">
                {isMobile ? "What can I help with?" : "What are you working on?"}
              </div>
              <div className="w-full max-w-3xl">
                <ChatTextBox />
              </div>
            </div>
          )}
        </div>
      </div>
    </ChatContext.Provider>
  )
}

export default HomePage
