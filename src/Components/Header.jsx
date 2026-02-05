import React, { useContext, useEffect, useRef } from 'react'
import { EventAppContext } from '../Context/EventContext'
import { Play } from 'lucide-react';
import { useGSAP } from "@gsap/react"
import gsap from 'gsap';
import { useNavigate,Link } from 'react-router';


const Header = () => {
    const { setRegister, isAuthenticated } = useContext(EventAppContext)
    const headerRef = useRef([]);
    const { contextSafe } = useGSAP();
    const Navigate = useNavigate()
    useGSAP(
        (ctx) => {
            const anim = gsap.fromTo(
                headerRef.current,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    stagger: 0.25,
                    scrollTrigger: {
                        trigger: headerRef.current[0],
                        start: "top 85%",
                        toggleActions: "play none none none", // only play once
                        once: true,
                        onLeave: (self) => {
                            self.kill(true);
                        },
                    },
                }
            );
            return () => ctx.kill();
        },
        { scope: headerRef } // ✅ scope for automatic cleanup
    );


    return (
        <div className='mt-15'>
            {/* Main Heading - Exact gradient text from image */}
            <h1 className="text-center text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight  max-w-4xl mx-auto" ref={(el) => (headerRef.current[0] = el)}>
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-white bg-clip-text text-transparent">
                    All-In-One
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    College Event Hub
                </span>
            </h1>

            {/* Subtitle */}
            <p className="text-center text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed hover:text-gray-200 transition-colors duration-300" ref={(el) => (headerRef.current[1] = el)} style={{ animationDelay: '200ms' }}>
                Simplify the chaos, Amplify the experience!
            </p>

            {/* CTA Button - Exact styling from image */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20" ref={(el) => (headerRef.current[2] = el)} style={{ animationDelay: '400ms' }}>
                <button className="group px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl font-semibold rounded-full hover:from-cyan-400 hover:to-blue-500 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/40 relative overflow-hidden" onClick={() => {
                    if (!isAuthenticated) {
                        setRegister(true)
                    } else {
                        Navigate("/Event")
                    }
                }}>
                    <span className="relative z-10" >Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <Link to="/Docs">
                    <button className="group flex items-center space-x-3 px-8 py-4 bg-transparent border-2 border-cyan-400/50 text-cyan-400 text-lg font-medium rounded-full hover:bg-cyan-400/10 hover:border-cyan-400 transform hover:scale-105 transition-all duration-300">
                        <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        <span>See Docs</span>
                    </button>
                </Link>
            </div>
        </div>

    )
}

export default Header