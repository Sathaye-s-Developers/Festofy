import React, { useContext, useEffect, useRef } from 'react'
import { EventAppContext } from '../Context/EventContext';
import { Link } from "react-router-dom"
import { Calendar, User, Menu, X } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/all';
import gsap from 'gsap';

const Navbar = () => {
  const { api, setRegister, setoptions, options, setprogress, setotp, isAuthenticated, setdetails, setisAuthenticated, details } = useContext(EventAppContext)
  const toggleoption = () => {
    setoptions((prev) => !prev)
  }

  const hasAnimated = useRef(false);

  const logout = async (e) => {
    try {
      e.preventDefault();
      await api.post("/Festofy/user/logout", { withCredentials: true }); // backend clears the cookie
      setdetails({ username: "", email: "" }); // clear context user
      document.cookie = "hasVisited=; max-age=0; path=/";
      setisAuthenticated(false)
      localStorage.removeItem("ULRKGDAPS")
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const letterref = useRef()
  const navbarref = useRef()

  useEffect(() => {
    if (hasAnimated.current) return; // prevent re-running
    hasAnimated.current = true;

    const lettersplit = new SplitText(letterref.current, { type: 'chars,words' });

    gsap.fromTo(
      lettersplit.chars,
      { x: 10, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
        stagger: 0.1,
        onComplete: () => {
          lettersplit.revert();
        }
      }
    );

    gsap.from(navbarref.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, []);
  return (
    <div>
      {/* <header className="relative z-10 px-6 py-6"> */}
      <header className="fixed top-0 left-0 w-full z-20 bg-black px-6 py-6 shadow-lg" ref={navbarref}>
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-400/40 group-hover:bg-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300 group-hover:scale-110">
              <Calendar className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
            </div>
            <span
              className="text-3xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300"
              ref={letterref}
            >
              Festofy
            </span>
          </div>

          {/* Navigation Menu */}
          <ul className="hidden md:flex items-center space-x-8">
            <li className="text-white hover:text-cyan-400 transition-all duration-300 font-medium relative group">
              <Link to="/Home">Home</Link>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </li>
            {isAuthenticated ? (
              <li
                className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium relative group"
                onClick={() => setprogress(100)}
              >
                <Link to="/Event">Events</Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </li>
            ) : null}

            <a href="#Gallary" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium relative group">
              Gallery
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#About" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            {!isAuthenticated && (
              <a href="#Enquiry" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium relative group">
                Enquiry
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleoption}
              className="relative p-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-400/30 hover:from-cyan-500/30 hover:to-blue-600/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-110 group"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute inset-0 w-6 h-6 text-cyan-400 transition-all duration-300 ${options ? 'opacity-0 rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'
                    }`}
                />
                <X
                  className={`absolute inset w-6 h-6 text-cyan-400 transition-all duration-300 ${options ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-75'
                    }`}
                />
              </div>
            </button>
          </div>

          {/* Login / Logout Button */}
          {isAuthenticated ? (
            <div className="hidden md:block">
              <button
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 font-medium shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 hover:-translate-y-0.5 w-[140px]"
                onClick={logout}
              >
                <User className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:block">
              <button
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 font-medium shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 hover:-translate-y-0.5 w-[140px]"
                onClick={() => {
                  setRegister(true)
                  setotp(false)
                }}
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
            </div>
          )}
        </nav>
      </header>
    </div>
  )
}

export default Navbar
