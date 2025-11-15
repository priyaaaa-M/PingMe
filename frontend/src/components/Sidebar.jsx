import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/", icon: HomeIcon, label: "Home" },
    { path: "/friends", icon: UsersIcon, label: "Friends" },
    { path: "/notifications", icon: BellIcon, label: "Notifications" },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-emerald-950 to-stone-900 backdrop-blur-lg border-r border-emerald-800/40 hidden lg:flex flex-col h-screen sticky top-0 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-emerald-800/30 bg-gradient-to-r from-emerald-900/80 to-stone-900/80 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl group-hover:from-emerald-500 group-hover:to-emerald-600 transition-all duration-300 shadow-lg shadow-emerald-900/50 group-hover:scale-105">
            <ShipWheelIcon className="size-5 text-emerald-50" />
          </div>
          <span className="text-xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-emerald-200 to-stone-300 tracking-wider drop-shadow-lg">
            PingMe
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-3 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all duration-300 group border ${
                isActive
                  ? "bg-gradient-to-r from-emerald-800/60 to-emerald-900/60 border-emerald-600/50 shadow-lg shadow-emerald-900/30 transform scale-105"
                  : "border-emerald-800/30 hover:bg-gradient-to-r hover:from-stone-800/40 hover:to-emerald-900/40 hover:border-emerald-600/40 hover:transform hover:scale-105"
              }`}
            >
              <div className={`p-2.5 rounded-lg transition-all duration-300 ${
                isActive 
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md" 
                  : "bg-stone-800/60 group-hover:bg-gradient-to-br group-hover:from-emerald-600 group-hover:to-emerald-700"
              }`}>
                <Icon className={`size-5 transition-colors duration-300 ${
                  isActive ? "text-white" : "text-stone-300 group-hover:text-white"
                }`} />
              </div>
              <span className={`font-medium text-lg transition-colors duration-300 ${
                isActive ? "text-emerald-100 font-semibold" : "text-stone-300 group-hover:text-emerald-100"
              }`}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-emerald-800/30 mt-auto bg-gradient-to-b from-stone-900/50 to-emerald-950/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-stone-900/60 to-emerald-950/60 border border-emerald-800/30 shadow-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-stone-800/60 hover:to-emerald-900/60 hover:border-emerald-600/40 hover:scale-105 group">
          <div className="avatar group">
            <div className="w-12 rounded-full ring-2 ring-emerald-500 ring-offset-2 ring-offset-stone-900 shadow-lg group-hover:ring-emerald-400 transition-all duration-300">
              <img 
                src={authUser?.profilePic} 
                alt="User Avatar" 
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-emerald-100 text-sm truncate transition-colors duration-300 group-hover:text-white">
              {authUser?.fullName}
            </p>
            <p className="text-xs text-emerald-300 flex items-center gap-2 transition-colors duration-300 group-hover:text-emerald-200">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;