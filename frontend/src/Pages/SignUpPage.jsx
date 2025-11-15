import { ShipWheel } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useSignUp from "../hooks/useSignup";
import { useState } from "react";


const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

 
  const { signupMutation, isPending, error } = useSignUp({
    onSuccess: () => {
      // This will run after successful signup and auth state update
      navigate("/onboarding");
    }
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };


  return (
 <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 flex items-center justify-center p-4 sm:p-3">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-700">
        
        {/* LEFT SIDE - FORM */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6 flex items-center justify-start gap-3">
            <div className="p-2 bg-emerald-700 rounded-lg shadow">
              <ShipWheel className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600">
              PingMe
            </span>
          </div>

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

          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">Join PingMe</h2>
            <p className="text-slate-600 text-sm mt-1">
              Start your language journey
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* FULL NAME */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 outline-none"
                value={signupData.fullName}
                onChange={(e) =>
                  setSignupData({ ...signupData, fullName: e.target.value })
                }
                required
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Email</label>
              <input
                type="email"
                placeholder="john@gmail.com"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 outline-none"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Password</label>
              <input
                type="password"
                placeholder="********"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 outline-none"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                required
              />
              <p className="text-xs text-slate-500">
                6+ characters
              </p>
            </div>

            {/* CHECKBOX */}
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="w-3 h-3 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                required 
              />
              <span className="text-xs text-slate-600">
                Accept <span className="text-emerald-600 font-medium">terms</span>
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow shadow-emerald-500/25"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* LOGIN LINK */}
            <p className="text-center text-slate-600 text-xs pt-3">
              Have an account?{" "}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT SIDE - ILLUSTRATION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-900 items-center justify-center p-8">
          <div className="max-w-sm text-center text-white">
            {/* Illustration */}
            <div className="relative aspect-square max-w-xs mx-auto mb-6">
              <div className="absolute inset-0 bg-white/5 rounded-xl backdrop-blur-sm"></div>
              <img 
                src="/Video_Call.svg" 
                alt="Language connection" 
                className="w-full h-full object-contain relative z-10" 
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold">
                Connect globally
              </h2>
              <p className="text-emerald-100 text-sm">
                Practice languages with native speakers
              </p>
            </div>

            {/* Features List */}
            <div className="mt-6 space-y-2 text-left">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
                <span className="text-emerald-100 text-sm">Live conversations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
                <span className="text-emerald-100 text-sm">Native speakers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
                <span className="text-emerald-100 text-sm">Personalized learning</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;