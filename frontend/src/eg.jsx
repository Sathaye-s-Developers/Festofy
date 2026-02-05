{/* Mobile Menu Overlay */}
{isMobileMenuOpen && (
  <div 
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-500"
    onClick={toggleMobileMenu}
  />
)}

{/* Enhanced Mobile Navigation Menu */}
<div className={`md:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 transition-all duration-500 ease-out transform ${
  isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
}`}>
  {/* Mobile Menu Background with Glassmorphism */}
  <div className="h-full bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-r border-cyan-400/20 shadow-2xl">
    {/* Mobile Menu Header */}
    <div className="p-6 border-b border-cyan-400/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-400/40">
            <Calendar className="w-6 h-6 text-cyan-400" />
          </div>
          <span className="text-xl font-bold text-white">Festofy</span>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors duration-200 active:scale-95"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
        </button>
      </div>
    </div>

    {/* Mobile Menu Items */}
    <div className="px-6 py-8 space-y-2">
      {menuItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <a
            key={item.name}
            href={item.href}
            className={`group flex items-center space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-600/10 border border-transparent hover:border-cyan-400/20 transition-all duration-300 transform hover:translate-x-2 hover:scale-105 active:scale-95 ${
              isMobileMenuOpen ? 'animate-slideInRight' : ''
            }`}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
            onClick={toggleMobileMenu}
          >
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg border border-cyan-400/30 group-hover:border-cyan-400/50 group-hover:scale-110 group-active:scale-95 transition-all duration-300">
              <IconComponent className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
            </div>
            <span className="text-gray-300 group-hover:text-white font-medium transition-colors duration-300">
              {item.name}
            </span>
            <div className="ml-auto w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-8 transition-all duration-300"></div>
          </a>
        );
      })}
    </div>

    {/* Mobile Login Button */}
    <div className="absolute bottom-8 left-6 right-6">
      <button 
        className={`w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 font-semibold shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 hover:-translate-y-1 active:scale-95 ${
          isMobileMenuOpen ? 'animate-slideInUp' : ''
        }`}
        style={{
          animationDelay: '400ms',
          animationFillMode: 'both'
        }}
        onClick={toggleMobileMenu}
      >
        <div className="p-1 bg-white/20 rounded-lg">
          <User className="w-5 h-5" />
        </div>
        <span>Get Started</span>
      </button>
    </div>

    {/* Decorative Elements */}
    <div className="absolute top-1/4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
    <div className="absolute top-1/2 right-8 w-1 h-1 bg-pink-400 rounded-full animate-pulse opacity-80"></div>
    <div className="absolute bottom-1/3 right-6 w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce opacity-70"></div>
  </div>
</div>
