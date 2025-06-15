"use client"
import { useEffect, useState } from "react"
import ThreeDotsSvg from "@/app/svg/threeDotsSvg"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { useRouter } from "next/navigation"
import UpgradePlan from "@/app/svg/upgradePlan"

interface ChatData {
  question: string
  answers: string
  _id: string
}

interface Chat {
  _id: string
  title: string
  userId: string
  chatData: ChatData[]
  createdAt: string
  updatedAt: string
  __v: number
}

function PreviousChats() {
  const [allChats, setAllChats] = useState<Chat[]>([])
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) return

    const fetchPreviousChats = async () => {
      try {
        const userId = user.id
        const res = await axios.get(`/api/chat/${userId}`)
        setAllChats(res.data.chats)
      } catch (error) {
        console.error("Error fetching previous chats:", error)
      }
    }
    fetchPreviousChats()
  }, [user])

  const setChatIdOnParam = (chatId: string) => {
    router.push(`/${chatId}`)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-2 text-sm font-[12px] leading-6  text-gray-300 ">Chats</div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto space-y-1 p-2">
        {allChats.map((chat, idx) => (
          <div
            key={idx}
            onClick={() => setChatIdOnParam(chat._id)}
            className="group flex items-center justify-between px-3 py-1 hover:bg-chatBoxColor rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex-1 text-sm font-thin text-white truncate ">{chat?.title}</div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 rounded-lg">
                <ThreeDotsSvg />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Section */}
      <div className="flex-shrink-0 h-18 p-2 border-t-[0.1px] border-gray-600">
        <div className="flex items-center py-2 px-1  space-x-2 hover:bg-chatBoxColor  rounded-xl cursor-pointer transition-colors">
          <div className="flex-shrink-0 p-2 border border-gray-600 rounded-full">
            <UpgradePlan />
          </div>
          <div className="flex-1 min-w-0 ">
            <div className="text-sm font-thin text-white">Upgrade plan</div>
            <div className="text-[12px] text-gray-400">More access to the best models</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviousChats

