import React, { useContext, useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import {FaHome } from "react-icons/fa";
import { Calendar } from 'lucide-react';
import { MdArrowBackIosNew } from "react-icons/md";
const E_Nav_Back = () => {
    const Navigate=useNavigate()
  

  return (

    <div>
      <header className="relative z-10 px-6 py-6">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">

          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-400/40 group-hover:bg-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300 group-hover:scale-110">
              <Calendar className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">Festofy</span>
          </div>
          <div className='flex items-center gap-5'>
            <Link to="/Home"><FaHome className={` w-8 h-8 text-cyan-300 hover:text-cyan-400 hover:scale-110 transition-all duration-300`}/></Link>
            <button onClick={()=>{Navigate("/Event")}} className='border-cyan-300 border p-2 text-white rounded-[20px] w-20 flex items-center hover:scale-105'><MdArrowBackIosNew/>Back</button>
            
          </div> 
          

        </nav>
      </header>

    </div>
  )
}

export default E_Nav_Back
