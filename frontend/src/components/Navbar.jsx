import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon, MenuIcon, XIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useState } from "react";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 backdrop-blur-lg border-b border-emerald-800/40 sticky top-0 z-50 h-16 flex items-center shadow-2xl">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between w-full">
          {/* Logo for Chat Pages */}
          {isChatPage && (
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg sm:rounded-xl group-hover:from-emerald-500 group-hover:to-emerald-600 transition-all duration-300 shadow-lg shadow-emerald-900/50 group-hover:scale-105">
                  <ShipWheelIcon className="size-4 sm:size-5 text-emerald-50" />
                </div>
                <span className="text-lg sm:text-xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-emerald-200 to-stone-300 tracking-wider drop-shadow-lg">
                  PingMe
                </span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg bg-emerald-900/30 border border-emerald-700/30 hover:bg-emerald-800/50 transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XIcon className="h-5 w-5 text-emerald-300" />
            ) : (
              <MenuIcon className="h-5 w-5 text-emerald-300" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            {/* Notifications */}
            <Link to="/notifications">
              <button className="relative p-2 rounded-lg bg-emerald-900/30 border border-emerald-700/30 hover:bg-emerald-800/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-110 group">
                <BellIcon className="h-5 w-5 text-emerald-300 group-hover:text-emerald-200 transition-colors" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-emerald-950 animate-pulse"></span>
              </button>
            </Link>

            {/* Theme Selector */}
            <div className="relative">
              <ThemeSelector />
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-3 pl-3 border-l border-emerald-800/50">
              <div className="avatar group cursor-pointer">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-emerald-500 ring-offset-2 ring-offset-stone-900 shadow-lg group-hover:ring-emerald-400 group-hover:scale-110 transition-all duration-300">
                  <img 
                    src={authUser?.profilePic} 
                    alt="User Avatar" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="hidden sm:block">
                <p className="font-medium text-emerald-100 text-sm">
                  {authUser?.fullName}
                </p>
                <p className="text-xs text-emerald-300">
                  Online
                </p>
              </div>

              {/* Logout Button */}
              <button 
                className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-700/30 hover:bg-red-900/50 hover:border-red-500/50 transition-all duration-300 hover:scale-110 group"
                onClick={logoutMutation}
                title="Logout"
              >
                <LogOutIcon className="h-5 w-5 text-emerald-300 group-hover:text-red-300 transition-colors" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-16 left-0 right-0 bg-gradient-to-b from-emerald-950 to-stone-900 border-b border-emerald-800/40 backdrop-blur-lg shadow-2xl">
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-4">
                  
                  {/* Notifications Mobile */}
                  <Link 
                    to="/notifications" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-emerald-900/30 border border-emerald-700/30 hover:bg-emerald-800/50 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BellIcon className="h-5 w-5 text-emerald-300" />
                    <span className="text-emerald-100 font-medium">Notifications</span>
                    <span className="ml-auto w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  </Link>

                  {/* Theme Selector Mobile */}
                  <div className="p-3">
                    <ThemeSelector />
                  </div>

                  {/* User Info Mobile */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-900/30 border border-emerald-700/30">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full ring-2 ring-emerald-500 ring-offset-2 ring-offset-stone-900">
                        <img 
                          src={authUser?.profilePic} 
                          alt="User Avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-emerald-100 text-sm">
                        {authUser?.fullName}
                      </p>
                      <p className="text-xs text-emerald-300">
                        Online
                      </p>
                    </div>
                  </div>

                  {/* Logout Mobile */}
                  <button 
                    className="flex items-center gap-3 p-3 rounded-lg bg-emerald-900/30 border border-emerald-700/30 hover:bg-red-900/50 hover:border-red-500/50 transition-all duration-300 group"
                    onClick={() => {
                      logoutMutation();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOutIcon className="h-5 w-5 text-emerald-300 group-hover:text-red-300 transition-colors" />
                    <span className="text-emerald-100 font-medium group-hover:text-red-300">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Icons Only (for tablets) */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Notifications Icon */}
            <Link to="/notifications">
              <button className="relative p-2 rounded-lg bg-emerald-900/30 border border-emerald-700/30 hover:bg-emerald-800/50 transition-all duration-300">
                <BellIcon className="h-5 w-5 text-emerald-300" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-emerald-950 animate-pulse"></span>
              </button>
            </Link>

            {/* Theme Selector Mobile */}
            <div className="relative">
              <ThemeSelector />
            </div>

            {/* User Avatar Only */}
            <div className="avatar">
              <div className="w-8 h-8 rounded-full ring-2 ring-emerald-500 ring-offset-2 ring-offset-stone-900">
                <img 
                  src={authUser?.profilePic} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;