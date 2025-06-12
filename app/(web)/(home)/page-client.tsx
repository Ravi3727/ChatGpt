'use client'
import React, { createContext, useState, useEffect } from 'react';
import HomePage from '../ui/homePage/homePage'
import Sidebar from '../ui/homePage/sidebar'
import ToogleIcon from '../../svg/toogleSvg'
import NewChatSvg from '../../svg/newChatSvg'

export const SideBarAnimation = createContext();

function HomePageClient() {
  const [isOpen, setIsOpen] = useState(true);
  const [showFullSidebar, setShowFullSidebar] = useState(true);
  const [showIconView, setShowIconView] = useState(false);

  const toggleSidebar = () => {
    if (isOpen) {
      setShowFullSidebar(false); 
      setTimeout(() => setShowIconView(true), 300); 
    } else {
      setShowIconView(false); 
      setTimeout(() => setShowFullSidebar(true), 300); 
    }
    setIsOpen(!isOpen);
  };

  const value = { isOpen, toggleSidebar };

  return (
    <div className='w-full min-h-screen overflow-hidden flex transition-all duration-300 ease-in-out'>
      <SideBarAnimation.Provider value={value}>

        {/* Sidebar Container */}
        <div
          className='transition-all duration-300 ease-in-out  relative overflow-hidden'
          style={{
            width: isOpen ? '16rem' : '4.5rem', 
            backgroundColor: isOpen ? 'var(--sidebar-bg-color, #1a1a1a)' : 'var(--background-bg-color, #212121)', // Use a CSS variable or fallback color
          }}
        >
          {/* Full Sidebar */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
              showFullSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Sidebar />
          </div>

          {/* Icon View */}
          <div
            className={`absolute inset-0  flex items-start justify-between py-5 ml-3 mt-1 text-white transition-opacity duration-300 ease-in-out ${
              showIconView ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ToogleIcon />
            <NewChatSvg />
          </div>
        </div>

        {/* HomePage Component */}
        <div
          className='transition-all duration-300 ease-in-out bg-customDark'
          style={{
            width: isOpen ? 'calc(100% - 16rem)' : 'calc(100% - 4.5rem)',
          }}
        >
          <HomePage />
        </div>

      </SideBarAnimation.Provider>
    </div>
  );
}

export default HomePageClient;
