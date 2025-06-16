"use client"
import React, { createContext, useState, useEffect } from "react"
import HomePage from "../ui/homePage/homePage"
import Sidebar from "../ui/homePage/sidebar"
import ToogleIcon from "../../svg/toogleSvg"
import NewChatSvg from "../../svg/newChatSvg"
import Link from "next/link"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Library from "../library/page"

type SideBarContextType = {
  isOpen: boolean;
  toggleSidebar: () => void;
  toggleLibrary: () => void;
  revrseToggleLibrary?: () => void;
};

export const SideBarAnimation = createContext<SideBarContextType | undefined>(undefined);


function HomePageClient() {  
  const [isOpen, setIsOpen] = useState(false)
  const [showFullSidebar, setShowFullSidebar] = useState(false)
  const [showIconView, setShowIconView] = useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const [isTablet, setIsTablet] = React.useState(false)
  const [showLibrary, setShowLibrary] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)

      // Auto-open sidebar on desktop
      if (width >= 1024) {
        setIsOpen(true)
        setShowFullSidebar(true)
        setShowIconView(false)
      } else {
        setIsOpen(false)
        setShowFullSidebar(false)
        setShowIconView(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    if (isMobile || isTablet) {
      // Mobile/tablet: toggle overlay
      setIsOpen(!isOpen)
      setShowFullSidebar(!isOpen)
    } else {
      // Desktop: toggle between full and icon view
      if (isOpen) {
        setShowFullSidebar(false)
        setTimeout(() => setShowIconView(true), 200)
      } else {
        setShowIconView(false)
        setTimeout(() => setShowFullSidebar(true), 200)
      }
      setIsOpen(!isOpen)
    }
  }


  const toggleLibrary = () => {
    setShowLibrary(true);
    // console.log("Library toggled:", !showLibrary)
  }

  const revrseToggleLibrary = () => {
    setShowLibrary(false);
  }

  const value = { isOpen, toggleSidebar, toggleLibrary, showLibrary, revrseToggleLibrary }

  return (
    <div className="w-full h-screen overflow-hidden flex relative">
      <SideBarAnimation.Provider value={value}>
        {/* Mobile Header */}
        {isMobile && (
          <div className="fixed top-0 left-0 right-0 z-40 h-12 bg-customDark flex items-center justify-between px-4 ">
            <button onClick={toggleSidebar} className="p-1 text-gray-400">
              <ToogleIcon />
            </button>
            {/* <Link href="/" className="p-1">
              <NewChatSvg />
            </Link> */}
            <div className="left-0 flex justify-end  w-full">
              <SignedOut>
                <SignInButton>
                  <button className="bg-white  text-black rounded-full px-4 py-1.5 text-sm font-medium hover:bg-gray-100 transition-colors">
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
        )}

        {/* Sidebar */}
        {isMobile || isTablet ? (
          <>
            {/* Mobile/Tablet Overlay */}
            {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar} />}
            <div
              className={`fixed top-0 left-0 h-full w-64 bg-customDark transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
              <Sidebar />
            </div>
          </>
        ) : (
          /* Desktop Sidebar */
          <div
            className="transition-all duration-300 px-2  ease-in-out relative overflow-hidden flex-shrink-0"
            style={{
              width: isOpen ? "16rem" : "4.5rem",
              backgroundColor: isOpen ? "var(--sidebar-bg-color, #1a1a1a)" : "var(--background-bg-color, #212121)",
            }}
          >
            {/* Full Sidebar */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${showFullSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
              <Sidebar />
            </div>

            {/* Icon View */}
            <div
              className={`absolute flex items-center py-3 space-y-4 md:space-y-0 transition-opacity duration-300 ease-in-out ${showIconView ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
              <button onClick={toggleSidebar} className="text-white p-2">
                <ToogleIcon />
              </button>
              <Link href="/" className="text-white p-1">
                <NewChatSvg />
              </Link>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 flex flex-col bg-customDark ${isMobile ? "pt-12" : ""}`}>
          {
            showLibrary ? <div className="flex-1 overflow-y-auto">
              <Library />
            </div>:
            <HomePage />
            }
        </div>
      </SideBarAnimation.Provider>
    </div>
  )
}

export default HomePageClient
