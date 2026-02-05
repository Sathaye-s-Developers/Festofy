import React from 'react'
import { Calendar, User, Menu } from 'lucide-react';


const NewHomepg = () => {
    return (
        <div>
            <div className="min-h-screen relative overflow-hidden" style={{
                background: `linear-gradient(135deg, 
        #121E31 0%, 
        #164064 35%, 
        #3D2E52 70%, 
        #1D4547 100%)`
            }}>
                {/* Geometric Grid Overlay - Matching image opacity */}
                <div className="absolute inset-0 opacity-25">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)`,
                        backgroundSize: '80px 80px'
                    }}></div>
                </div>
                {/* Floating Orbs - Exact positions and colors from image */}
                <div className="absolute top-32 left-16 w-4 h-4 bg-cyan-400 rounded-full blur-sm animate-pulse opacity-90"></div>
                <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-emerald-400 rounded-full blur-sm animate-pulse opacity-80"></div>
                <div className="absolute bottom-1/3 left-1/4 w-5 h-5 bg-pink-500 rounded-full blur-md animate-bounce opacity-70"></div>
                <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-pink-400 rounded-full blur-sm animate-bounce opacity-75"></div>
                <div className="absolute top-1/2 left-1/5 w-2 h-2 bg-cyan-300 rounded-full blur-sm animate-ping opacity-60"></div>
                <div className="absolute top-3/4 right-1/5 w-3 h-3 bg-green-400 rounded-full blur-sm animate-pulse opacity-85"></div>

                {/* Header */}
                <header className="relative z-10 px-6 py-6">
                    <nav className="flex items-center justify-between max-w-7xl mx-auto">
                        {/* Logo */}
                        <div className="flex items-center space-x-3 group cursor-pointer">
                            <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-400/40 group-hover:bg-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300 group-hover:scale-110">
                                <Calendar className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                            </div>
                            <span className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">Festofy</span>
                        </div>

                        {/* Navigation Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#" className="text-white hover:text-cyan-400 transition-all duration-300 font-medium relative group">
                                Home
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                            </a>
                            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium relative group">
                                Pricing
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                            </a>
                            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium relative group">
                                Gallery
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                            </a>
                            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium relative group">
                                About
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button className="text-white hover:text-cyan-400 transition-colors duration-300">
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Login Button */}
                        <div className="hidden md:block">
                            <button className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 font-medium shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 hover:-translate-y-0.5">
                                <User className="w-4 h-4" />
                                <span>Login</span>
                            </button>
                        </div>
                    </nav>
                </header>

                {/* Main Content */}
                <main className="relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center">
                    <div className="max-w-6xl mx-auto">
                        {/* Main Heading - Exact gradient text from image */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-white bg-clip-text text-transparent">
                                All-In-One
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                                College Event Hub
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed hover:text-gray-200 transition-colors duration-300">
                            All-in-one platform to effortlessly plan, promote, and manage your college events.
                            Simplify the chaos, amplify the experience!
                        </p>

                        {/* CTA Button - Exact styling from image */}
                        <button className="group px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl font-semibold rounded-full hover:from-cyan-400 hover:to-blue-500 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/40 relative overflow-hidden">
                            <span className="relative z-10">Get Started</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>
                </main>

                {/* Floating Lines - Exact positions from image */}
                <div className="absolute top-1/4 right-10 w-px h-32 bg-gradient-to-b from-cyan-400/60 to-transparent"></div>
                <div className="absolute bottom-1/4 left-10 w-px h-24 bg-gradient-to-t from-pink-400/60 to-transparent"></div>
                <div className="absolute top-1/2 right-1/4 w-24 h-px bg-gradient-to-r from-emerald-400/60 to-transparent"></div>
                <div className="absolute bottom-1/3 left-1/3 w-16 h-px bg-gradient-to-l from-purple-400/60 to-transparent"></div>

                {/* Additional animated elements matching image */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-40"></div>
                    <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-pulse opacity-60"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping opacity-50"></div>
                </div>

                {/* Hover animations for interactive elements */}
                <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
            </div>
        </div>
    )
}

export default NewHomepg
