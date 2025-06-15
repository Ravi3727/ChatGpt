'use client'
import React, { createContext, useState, useEffect } from 'react';
import HomePage from '../ui/homePage/homePage'
import Sidebar from '../ui/homePage/sidebar'
import ToogleIcon from '../../svg/toogleSvg'
import NewChatSvg from '../../svg/newChatSvg'

export const SideBarAnimation = createContext<{ isOpen: boolean; toggleSidebar: () => void } | undefined>(undefined);

function HomePageClient() {
  const [isOpen, setIsOpen] = useState(true);
  const [showFullSidebar, setShowFullSidebar] = useState(true);
  const [showIconView, setShowIconView] = useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);

    };
    handleResize();
  }, []);

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
    <div className='w-full max-h-[100vh] md:min-h-screen  overflow-hidden flex transition-all duration-300 ease-in-out'>
      <SideBarAnimation.Provider value={value}>



        {/* Sidebar Container */}

        {
          isMobile ? (
            <>
              <div className='fixed top-0 left-0 z-50 md:w-12 md:h-12 py-4 md:py-0 bg-customDark flex items-center justify-between px-4'>
                <ToogleIcon /> 
              </div>

              <div
                className={`absolute inset-0 z-50 w-56 bg-customDark transition-opacity duration-300 ease-in-out ${showFullSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
              >
                <Sidebar />
              </div>
            </>

          ) : (
            <div
              className='transition-all duration-300 ease-in-out  relative overflow-hidden'
              style={{
                width: isOpen ? '16rem' : '4.5rem',
                backgroundColor: isOpen ? 'var(--sidebar-bg-color, #1a1a1a)' : 'var(--background-bg-color, #212121)', // Use a CSS variable or fallback color
              }}
            >
              {/* Full Sidebar */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${(showFullSidebar && !isMobile) ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
              >
                <Sidebar />
              </div>

              {/* Icon View */}
              <div
                className={`absolute inset-0  flex items-start justify-between py-5 md:py-3 ml-3 mt-1 text-white transition-opacity duration-300 ease-in-out ${showIconView ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
              >
                <ToogleIcon />
                <NewChatSvg />
              </div>
            </div>
          
        )}


        {/* HomePage Component */}

        {!isMobile  ? <div
          className='transition-all  duration-300 ease-in-out bg-customDark'
          style={{
            width: isOpen ? 'calc(100% - 16rem)' : 'calc(100% - 4.5rem)',
          }}
        >
          <HomePage />
        </div>
        : (
          <div>
            <div
              className='max-w-screen max-h-screen overflow-y-hidden bg-customDark'
            >
              <HomePage />
            </div>
          </div>
        )  


        
      }
        

      </SideBarAnimation.Provider>
      
    </div>
  );
}

export default HomePageClient;
