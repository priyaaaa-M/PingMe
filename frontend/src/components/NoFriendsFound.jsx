const NoFriendsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-gradient-to-br from-emerald-900/20 to-stone-900/20 backdrop-blur-sm border border-emerald-500/30 shadow-2xl">
      {/* Animated Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
          <svg 
            className="w-10 h-10 text-emerald-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
        </div>
        
        {/* Floating animation dots */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-emerald-300 rounded-full animate-pulse"></div>
      </div>

      {/* Text Content */}
      <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-200 to-emerald-400 bg-clip-text text-transparent">
        No Friends Yet
      </h3>
      
      <p className="text-emerald-100/80 text-lg max-w-md mb-6 leading-relaxed">
        Your journey to meaningful language connections starts here. 
        Discover amazing partners and grow together!
      </p>

      {/* Animated Dots */}
      <div className="flex space-x-2 mb-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="w-2 h-2 bg-emerald-400 rounded-full opacity-60 animate-bounce"
            style={{ animationDelay: `${item * 0.2}s` }}
          ></div>
        ))}
      </div>

      {/* Call to Action Box */}
      <div className="bg-gradient-to-r from-emerald-900/40 to-stone-900/40 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/20 w-full max-w-sm">
        <div className="flex items-center justify-center gap-3">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <p className="text-emerald-200 text-sm font-medium">
            Find language partners below to start practicing together!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoFriendsFound;