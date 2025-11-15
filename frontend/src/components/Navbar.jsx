import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 backdrop-blur-lg border-b border-emerald-800/40 sticky top-0 z-40 h-16 flex items-center shadow-2xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* Logo for Chat Pages */}
          {isChatPage && (
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="p-2 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl group-hover:from-emerald-500 group-hover:to-emerald-600 transition-all duration-300 shadow-lg shadow-emerald-900/50 group-hover:scale-105">
                  <ShipWheelIcon className="size-5 text-emerald-50" />
                </div>
                <span className="text-xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-emerald-200 to-stone-300 tracking-wider drop-shadow-lg">
                  PingMe
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto">
            {/* Notifications */}
            <Link to="/notifications">
              <button className="relative p-2 rounded-lg bg-emerald-900/30 border border-emerald-700/30 hover:bg-emerald-800/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-110 group">
                <BellIcon className="h-5 w-5 text-emerald-300 group-hover:text-emerald-200 transition-colors" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-emerald-950 animate-pulse"></span>
              </button>
            </Link>

            {/* Theme Selector - FIXED POSITIONING */}
            <div className="relative">
              <ThemeSelector />
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-3 pl-3 border-l border-emerald-800/50">
              <div className="avatar group cursor-pointer">
                <div className="w-9 rounded-full ring-2 ring-emerald-500 ring-offset-2 ring-offset-stone-900 shadow-lg group-hover:ring-emerald-400 group-hover:scale-110 transition-all duration-300">
                  <img 
                    src={authUser?.profilePic} 
                    alt="User Avatar" 
                    className="group-hover:scale-110 transition-transform duration-300"
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;