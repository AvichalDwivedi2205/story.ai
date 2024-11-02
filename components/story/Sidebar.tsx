"use client"
import React from 'react'
import { useState } from 'react'


function SideBar() {
    const [isActive, setIsActive] = useState(false)
    return (
        <div>
            <button onClick={() => {setIsActive(!isActive)}} className="bg-[#06125f] fixed left-3 mt-2 flex z-30 items-center justify-center cursor-pointer h-10 w-10">
            <div className={`burger ${isActive ? 'burgerActive' : ''}`}></div>
            </button>
            {isActive && 
            <div className='pt-5 pl-3 sm:pl-5 lg:pl-7 flex flex-col background h-screen w-60 z-10'>
               <button
                className=" pl-16 text-lg font-semibold gradient-text hover:text-gray-900 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none"
                >
                New Story
                </button>
            </div>}  
        </div>
        
    )
    
}

export default SideBar
