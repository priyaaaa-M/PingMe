import { useState, useEffect } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loginStatus, setLoginStatus] = useState('neutral'); // 'neutral', 'success', 'error'

  const { isPending, error, loginMutation } = useLogin();

  // Update mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update login status based on error state
  useEffect(() => {
    if (error) {
      setLoginStatus('error');
    } else if (isPending) {
      setLoginStatus('neutral');
    }
  }, [error, isPending]);

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData, {
      onSuccess: () => {
        setLoginStatus('success');
      },
      onError: () => {
        setLoginStatus('error');
      }
    });
  };

  // Calculate eye direction based on mouse position
  const calculateEyePosition = (characterX, characterY) => {
    const dx = mousePos.x - characterX;
    const dy = mousePos.y - characterY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy) / 100, 3);
    
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };
  };

  // Check if cursor is on the left side (login form area)
  const isHappySide = mousePos.x < window.innerWidth / 2;

  const getCharacterMood = () => {
    if (loginStatus === 'success') return 'celebrating';
    if (loginStatus === 'error') return 'sad';
    if (isHappySide) return 'happy';
    return 'neutral';
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-stone-900 flex items-center justify-center p-4 relative overflow-hidden"
      data-theme="forest"
    >
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${15 + Math.random() * 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Characters Section */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main Tree Character (Top Left) */}
        <div 
          className="absolute top-8 left-8 transition-transform duration-300"
          style={{
            transform: `rotate(${(mousePos.x - window.innerWidth / 2) / 40}deg)`
          }}
        >
          <svg width="140" height="200" viewBox="0 0 140 200">
            {/* Trunk */}
            <rect x="55" y="90" width="30" height="80" fill="#8B4513" />
            {/* Leaves */}
            <circle cx="70" cy="40" r="40" fill="#22C55E" />
            <circle cx="45" cy="65" r="30" fill="#16A34A" />
            <circle cx="95" cy="65" r="30" fill="#16A34A" />
            <circle cx="70" cy="75" r="35" fill="#15803D" />
            
            {/* Eyes */}
            <circle cx="55" cy="45" r="5" fill="white" />
            <circle cx="85" cy="45" r="5" fill="white" />
            {/* Pupils */}
            <circle 
              cx={55 + calculateEyePosition(100, 100).x} 
              cy={45 + calculateEyePosition(100, 100).y} 
              r="2.5" 
              fill="#1F2937" 
            />
            <circle 
              cx={85 + calculateEyePosition(100, 100).x} 
              cy={45 + calculateEyePosition(100, 100).y} 
              r="2.5" 
              fill="#1F2937" 
            />
            
            {/* Mouth based on mood */}
            {getCharacterMood() === 'sad' ? (
              <>
                <path d="M 50 75 Q 70 65 90 75" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Tears */}
                <circle cx="52" cy="82" r="1.5" fill="#60A5FA" opacity="0.8">
                  <animate attributeName="cy" values="82;90;82" dur="1s" repeatCount="indefinite"/>
                </circle>
                <circle cx="88" cy="82" r="1.5" fill="#60A5FA" opacity="0.8">
                  <animate attributeName="cy" values="82;90;82" dur="1s" repeatCount="indefinite" animationDelay="0.3s"/>
                </circle>
              </>
            ) : getCharacterMood() === 'happy' || getCharacterMood() === 'celebrating' ? (
              <>
                <path d="M 50 80 Q 70 90 90 80" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Cheeks */}
                <circle cx="45" cy="75" r="4" fill="#FECACA" opacity="0.6" />
                <circle cx="95" cy="75" r="4" fill="#FECACA" opacity="0.6" />
              </>
            ) : (
              <line x1="50" y1="75" x2="90" y2="75" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
            )}
          </svg>
        </div>

        {/* Second Tree (Top Right) */}
        <div 
          className="absolute top-12 right-20 transition-transform duration-300"
          style={{
            transform: `rotate(${-(mousePos.x - window.innerWidth / 2) / 50}deg)`
          }}
        >
          <svg width="120" height="180" viewBox="0 0 120 180">
            {/* Trunk */}
            <rect x="45" y="80" width="20" height="70" fill="#A0522D" />
            {/* Leaves */}
            <circle cx="55" cy="45" r="30" fill="#16A34A" />
            <circle cx="35" cy="60" r="22" fill="#15803D" />
            <circle cx="75" cy="60" r="22" fill="#15803D" />
            
            {/* Eyes */}
            <circle cx="48" cy="50" r="4" fill="white" />
            <circle cx="62" cy="50" r="4" fill="white" />
            {/* Pupils */}
            <circle 
              cx={48 + calculateEyePosition(window.innerWidth - 150, 120).x} 
              cy={50 + calculateEyePosition(window.innerWidth - 150, 120).y} 
              r="2" 
              fill="#1F2937" 
            />
            <circle 
              cx={62 + calculateEyePosition(window.innerWidth - 150, 120).x} 
              cy={50 + calculateEyePosition(window.innerWidth - 150, 120).y} 
              r="2" 
              fill="#1F2937" 
            />
            
            {/* Mouth */}
            {getCharacterMood() === 'sad' ? (
              <>
                <path d="M 42 70 Q 55 65 68 70" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="44" cy="75" r="1" fill="#60A5FA" opacity="0.8">
                  <animate attributeName="cy" values="75;80;75" dur="1.2s" repeatCount="indefinite"/>
                </circle>
              </>
            ) : getCharacterMood() === 'happy' || getCharacterMood() === 'celebrating' ? (
              <path d="M 42 72 Q 55 77 68 72" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />
            ) : (
              <line x1="42" y1="70" x2="68" y2="70" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </div>

        {/* Third Tree (Bottom Left) */}
        <div 
          className="absolute bottom-8 left-20 transition-transform duration-300"
          style={{
            transform: `rotate(${(mousePos.y - window.innerHeight / 2) / 40}deg)`
          }}
        >
          <svg width="130" height="160" viewBox="0 0 130 160">
            {/* Trunk */}
            <rect x="50" y="70" width="25" height="60" fill="#8B4513" />
            {/* Leaves */}
            <circle cx="62" cy="35" r="35" fill="#22C55E" />
            <circle cx="40" cy="55" r="25" fill="#16A34A" />
            <circle cx="85" cy="55" r="25" fill="#16A34A" />
            
            {/* Big friendly eyes */}
            <circle cx="50" cy="40" r="6" fill="white" />
            <circle cx="75" cy="40" r="6" fill="white" />
            {/* Pupils */}
            <circle 
              cx={50 + calculateEyePosition(150, window.innerHeight - 100).x * 1.2} 
              cy={40 + calculateEyePosition(150, window.innerHeight - 100).y * 1.2} 
              r="3" 
              fill="#1F2937" 
            />
            <circle 
              cx={75 + calculateEyePosition(150, window.innerHeight - 100).x * 1.2} 
              cy={40 + calculateEyePosition(150, window.innerHeight - 100).y * 1.2} 
              r="3" 
              fill="#1F2937" 
            />
            
            {/* Expressive mouth */}
            {getCharacterMood() === 'sad' ? (
              <>
                <path d="M 45 65 Q 62 60 80 65" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
                <circle cx="48" cy="70" r="2" fill="#60A5FA" opacity="0.8">
                  <animate attributeName="cy" values="70;78;70" dur="1.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="77" cy="70" r="2" fill="#60A5FA" opacity="0.8">
                  <animate attributeName="cy" values="70;78;70" dur="1.5s" repeatCount="indefinite" animationDelay="0.5s"/>
                </circle>
              </>
            ) : getCharacterMood() === 'happy' || getCharacterMood() === 'celebrating' ? (
              <>
                <path d="M 45 68 Q 62 75 80 68" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
                <circle cx="42" cy="65" r="3" fill="#FECACA" opacity="0.6" />
                <circle cx="82" cy="65" r="3" fill="#FECACA" opacity="0.6" />
              </>
            ) : (
              <line x1="45" y1="65" x2="80" y2="65" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
            )}
          </svg>
        </div>

        {/* Rock/Stone Character (Bottom Center) */}
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 transition-transform duration-200"
          style={{
            transform: `translate(-50%, ${-mousePos.y / 80}px)`
          }}
        >
          <svg width="180" height="120" viewBox="0 0 180 120">
            {/* Rock body */}
            <path d="M 20 70 Q 0 40 50 25 Q 90 15 130 25 Q 180 40 160 70 Q 140 95 90 105 Q 40 95 20 70 Z" fill="#6B7280" />
            
            {/* Three eyes */}
            <circle cx="60" cy="45" r="7" fill="white" />
            <circle cx="90" cy="40" r="7" fill="white" />
            <circle cx="120" cy="45" r="7" fill="white" />
            
            {/* Pupils */}
            <circle 
              cx={60 + calculateEyePosition(window.innerWidth / 2, window.innerHeight - 50).x * 1.5} 
              cy={45 + calculateEyePosition(window.innerWidth / 2, window.innerHeight - 50).y * 1.5} 
              r="3.5" 
              fill="#1F2937" 
            />
            <circle 
              cx={90 + calculateEyePosition(window.innerWidth / 2, window.innerHeight - 50).x * 1.5} 
              cy={40 + calculateEyePosition(window.innerWidth / 2, window.innerHeight - 50).y * 1.5} 
              r="3.5" 
              fill="#1F2937" 
            />
            <circle 
              cx={120 + calculateEyePosition(window.innerWidth / 2, window.innerHeight - 50).x * 1.5} 
              cy={45 + calculateEyePosition(window.innerWidth / 2, window.innerHeight - 50).y * 1.5} 
              r="3.5" 
              fill="#1F2937" 
            />
            
            {/* Mouth */}
            {getCharacterMood() === 'sad' ? (
              <>
                <path d="M 50 75 Q 90 70 130 75" stroke="#1F2937" strokeWidth="4" fill="none" strokeLinecap="round" />
                <circle cx="55" cy="80" r="2" fill="#60A5FA" opacity="0.8">
                  <animate attributeName="cy" values="80;85;80" dur="1s" repeatCount="indefinite"/>
                </circle>
                <circle cx="125" cy="80" r="2" fill="#60A5FA" opacity="0.8">
                  <animate attributeName="cy" values="80;85;80" dur="1s" repeatCount="indefinite" animationDelay="0.4s"/>
                </circle>
              </>
            ) : getCharacterMood() === 'happy' || getCharacterMood() === 'celebrating' ? (
              <>
                <path d="M 50 80 Q 90 90 130 80" stroke="#1F2937" strokeWidth="4" fill="none" strokeLinecap="round" />
                <circle cx="45" cy="75" r="5" fill="#FECACA" opacity="0.6" />
                <circle cx="135" cy="75" r="5" fill="#FECACA" opacity="0.6" />
              </>
            ) : (
              <line x1="50" y1="75" x2="130" y2="75" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
            )}
          </svg>
        </div>

        {/* Leaf/Plant Character (Center Right) */}
        <div 
          className="absolute top-1/2 right-16 transform -translate-y-1/2 transition-transform duration-200"
          style={{
            transform: `translateY(-50%) translateX(${mousePos.x / 100}px) rotate(${5 + (mousePos.y - window.innerHeight / 2) / 80}deg)`
          }}
        >
          <svg width="110" height="150" viewBox="0 0 110 150">
            {/* Stem */}
            <rect x="48" y="70" width="12" height="70" fill="#22C55E" />
            {/* Leaf head */}
            <ellipse cx="54" cy="45" rx="35" ry="30" fill="#16A34A" />
            
            {/* Single big eye */}
            <circle cx="54" cy="40" r="10" fill="white" />
            <circle 
              cx={54 + calculateEyePosition(window.innerWidth - 120, window.innerHeight / 2).x * 2.5} 
              cy={40 + calculateEyePosition(window.innerWidth - 120, window.innerHeight / 2).y * 2.5} 
              r="5" 
              fill="#1F2937" 
            />
            
            {/* Mouth */}
            {getCharacterMood() === 'sad' ? (
              <>
                <path d="M 35 60 Q 54 55 73 60" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
                <circle cx="38" cy="65" r="1.5" fill="#60A5FA" opacity="0.8">
                  <animate attributeName="cy" values="65;70;65" dur="1.3s" repeatCount="indefinite"/>
                </circle>
              </>
            ) : getCharacterMood() === 'happy' || getCharacterMood() === 'celebrating' ? (
              <>
                <path d="M 35 65 Q 54 72 73 65" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
                <circle cx="30" cy="60" r="4" fill="#FECACA" opacity="0.6" />
              </>
            ) : (
              <line x1="35" y1="60" x2="73" y2="60" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
            )}
          </svg>
        </div>

        {/* Celebration Effects */}
        {loginStatus === 'success' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-yellow-300 rounded-full animate-ping"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${15 + Math.random() * 70}%`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
            {/* Sparkles */}
            <div className="absolute top-1/4 left-1/4 text-3xl animate-bounce">✨</div>
            <div className="absolute top-1/3 right-1/3 text-2xl animate-bounce" style={{animationDelay: '0.2s'}}>⭐</div>
            <div className="absolute bottom-1/3 left-1/3 text-2xl animate-bounce" style={{animationDelay: '0.4s'}}>🎉</div>
          </div>
        )}
      </div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-br from-stone-800/90 to-emerald-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-emerald-700/50 p-8">
          {/* LOGO */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <ShipWheelIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-200 to-green-100 bg-clip-text text-transparent tracking-wider">
              Streamify
            </span>
          </div>

          {/* ERROR MESSAGE DISPLAY */}
        {error && (
  <div className="mb-6 p-4 bg-gradient-to-r from-red-900/80 to-rose-900/80 border-l-4 border-red-400 rounded-lg shadow-lg backdrop-blur-sm animate-pulse">
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-red-100 font-medium text-sm">
          {error.response?.data?.message || "Login failed. Please check your credentials and try again."}
        </p>
      </div>
    </div>
  </div>
)}

          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-emerald-100">Welcome Back</h2>
                  <p className="text-emerald-200/70 mt-2">
                    Sign in to continue your language journey
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-emerald-200">Email</label>
                    <input
                      type="email"
                      placeholder="hello@example.com"
                      className="w-full px-4 py-3 bg-stone-700/50 border border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-emerald-300 backdrop-blur-sm transition-all duration-200"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-emerald-200">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-stone-700/50 border border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-emerald-300 backdrop-blur-sm transition-all duration-200"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg border border-emerald-500 flex items-center justify-center gap-2"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-emerald-200/70 text-sm">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-emerald-300 hover:text-emerald-200 underline transition-colors">
                        Create one
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Text Overlay */}
        <div className="text-center mt-6">
          <p className="text-emerald-300/60 text-sm">
            Join the forest of language learners
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;