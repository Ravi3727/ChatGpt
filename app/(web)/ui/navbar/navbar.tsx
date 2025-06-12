'use client'
import React, { useState, useRef, useEffect } from 'react'
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'
import { Upload, CircleAlert } from 'lucide-react'
import sparkle from '@/public/star.png'
import concept from '@/public/conceptWhite.svg'
import Image from 'next/image'
import DownArrowSvg from '@/app/svg/downArrowSvg'

function Navbar() {
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className='relative w-full justify-between flex items-center'>
            {/* Dropdown Trigger */}
            <div
                className='flex justify-between items-center hover:bg-navbarChatGptText rounded-lg px-2 py-1 hover:cursor-pointer relative'
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <div className='text-lg text-white'>ChatGPT</div>
                <div className='text-md mt-1 text-white ml-2'>
                    <DownArrowSvg />
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                    <div
                        ref={dropdownRef}
                        className='absolute top-full h-34 left-0 mt-2 w-[22rem] bg-chatBoxColor text-white rounded-xl shadow-xl p-2 z-50 flex flex-col justify-evenly'
                    >
                        <div className='px-2 py-2 text-sm text-gray-300 items-center hover:bg-navbarChatGptText rounded-xl  border-gray-600 flex justify-between '>
                            <div className='flex gap-4 w-9/12 items-center'>
                                <div className=''>
                                    <Image src={sparkle} alt="sparkle" />
                                </div>
                                <div>
                                    <div>ChatGPT Plus</div>
                                    <div className='text-xs text-gray-400'>Our smartest model & more</div>
                                </div>

                            </div>

                            <div className='w-2/12 '>
                                <button className='hover:cursor-pointer float-right bg-customDark text-white px-3 py-1 border-[0.5px] border-gray-300 text-md rounded-2xl'>
                                    Upgrade
                                </button>
                            </div>
                        </div>
                        <div className='px-2 py-2 mt-1 text-sm text-white hover:bg-navbarChatGptText rounded-xl flex justify-between items-center'>
                            <div className='flex gap-4 w-9/12 items-center'>
                                <div className=''>
                                    <Image src={concept} alt="concept" width={32} />
                                </div>
                                <div className=''>
                                    <div>
                                        ChatGPT
                                    </div>
                                    <div className='text-xs text-gray-400'>
                                        Great for everyday
                                    </div>
                                </div>
                            </div>
                            <div className=' text-xl font-thin'>✓</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Placeholder */}
            <div className='text-sm text-white flex gap-2 justify-center items-center'>
                <div className='text-gray-400'>
                    saved memory fill
                </div>
                <div className="relative group w-fit flex flex-col ">
                    <div className='text-gray-400'>
                        <CircleAlert size={15} />
                    </div>

                    <div className=" top-5 -right-36 w-[19rem] absolute hidden group-hover:block bg-black text-white text-[12px] px-4 py-2 rounded shadow-md">
                        <div className='flex flex-col justify-center items-center'>
                            <div>
                                ChatGpt's out of space for saved memories.
                            </div>
                            <div>
                                <span className='underline'> Manage saved memories</span> to create more space.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Auth Buttons */}
            <div className='flex w-44 justify-between py-2 px-1 items-center'>
                <div className='flex justify-between items-center rounded-3xl hover:cursor-pointer px-3 py-2 w-22 hover:bg-chatBoxColor'>
                    <div className='text-white font-thin text-sm'>
                        <Upload size={20} />
                    </div>
                    <div className='text-white text-sm'>
                        Share
                    </div>
                </div>
                <div >
                    <SignedOut>
                        <div className=' '>
                            <SignInButton >
                                <button className='bg-white text-black rounded-2xl px-2 py-1 hover:cursor-pointer'>
                                    Log In
                                </button>
                                </SignInButton>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <div className='rounded-full hover:cursor-pointer mt-2'>
                            <UserButton />
                        </div>
                    </SignedIn>
                </div>
            </div>
        </div>
    )
}

export default Navbar
