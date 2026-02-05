import React, { useContext, useState } from 'react'
import { Link } from "react-router-dom"
import { EventAppContext } from '../../../Context/EventContext'
import { Calendar, User, Menu,X } from 'lucide-react';
import { FaHome } from "react-icons/fa";

const E_Navbar = () => {
  const { details,profileOptions, setprofileOptions } = useContext(EventAppContext)
  const [dashboard, setdashboard] = useState(false)
  const toggleProfileOption=()=>{
    setprofileOptions(true)
  }
  

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
            <button
              onClick={toggleProfileOption}
              className="relative p-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-400/30 hover:from-cyan-500/30 hover:to-blue-600/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-110 group"
            >
              <div className="relative w-6 h-6">
                <Menu className={`absolute in set-0 w-6 h-6 text-cyan-400 transition-all duration-300 ${profileOptions ? 'opacity-0 rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
                <X className={`absolute inset w-6 h-6 text-cyan-400 transition-all duration-300 ${profileOptions ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-75'}`} />
              </div>
            </button>
            
          </div>
          

        </nav>
      </header>

    </div>
  )
}

export default E_Navbar
