"use client"
import { useState, useRef, useEffect } from "react"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Upload, CircleAlert } from "lucide-react"
import sparkle from "@/public/star.png"
import concept from "@/public/conceptWhite.svg"
import Image from "next/image"
import DownArrowSvg from "@/app/svg/downArrowSvg"

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (isMobile) {
    return (null)
  }

  return (
    <div className="w-full max-w-full  flex items-center justify-between">
      {/* Model Selector */}
      <div className="relative">
        <button
          className="flex items-center space-x-2 hover:bg-navbarChatGptText rounded-lg px-2 py-1 transition-colors"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className="text-lg text-white font-extralight">ChatGPT</span>
          <div className="text-gray-400">
            <DownArrowSvg />
          </div>
        </button>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 mt-2 w-80 md:h-36 bg-chatBoxColor text-white rounded-xl shadow-xl p-2 z-50"
          >
            {/* ChatGPT Plus Option */}
            <div className="flex items-center justify-between p-2 hover:bg-navbarChatGptText rounded-xl transition-colors">
              <div className="flex items-center space-x-2">
                <Image src={sparkle || "/placeholder.svg"} alt="sparkle" width={20} height={20} />
                <div>
                  <div className="font-xs">ChatGPT Plus</div>
                  <div className="text-[12px] text-gray-400">Our smartest model & more</div>
                </div>
              </div>
              <button className="bg-customDark text-white px-3 py-1 border-[0.5px] border-gray-300  text-xs rounded-full transition-colors">
                Upgrade
              </button>
            </div>

            {/* ChatGPT Free Option */}
            <div className="flex items-center justify-between p-3 hover:bg-navbarChatGptText rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <Image src={concept || "/placeholder.svg"} alt="concept" width={20} height={20} />
                <div>
                  <div className="font-xs">ChatGPT</div>
                  <div className="text-[12px] text-gray-400">Great for everyday tasks</div>
                </div>
              </div>
              <div className="text-white text-xl">✓</div>
            </div>
          </div>
        )}
      </div>

      {/* Center Info */}
      <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-400">
        <span>Memory full</span>
        <div className="relative group">
          <CircleAlert size={16} />
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs px-3 py-2 rounded shadow-lg w-78 text-center">
            ChatGPT&apos;s out of space for saved memories.{" "}
            <span className="underline cursor-pointer">Manage saved memories</span> to create more space.
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        <button className="text-white hidden sm:flex items-center space-x-2 hover:cursor-pointer hover:bg-navbarChatGptText rounded-full px-3 py-2 transition-colors">
          <Upload size={20} />
          <span className="text-sm text-white">Share</span>
        </button>

        <SignedOut>
          <SignInButton>
            <button className="bg-white text-black rounded-full px-4 py-1.5 text-sm hover:cursor-pointer font-medium hover:bg-gray-100 transition-colors">
              Log in
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
          />
        </SignedIn>
      </div>
    </div>
  )
}

export default Navbar
