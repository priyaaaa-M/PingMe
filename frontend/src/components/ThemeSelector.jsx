import { PaletteIcon } from "lucide-react";
import { useThemeStore } from "../store/themeStore";
import { THEMES } from "../constants";
import { useState, useRef, useEffect } from "react";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-700/30 hover:bg-emerald-800/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-110 group"
      >
        <PaletteIcon className="h-5 w-5 text-emerald-300 group-hover:text-emerald-200 transition-colors" />
      </button>

      {/* DROPDOWN MENU WITH SCROLL */}
      {open && (
        <div className="absolute right-0 top-12 z-50">
          <div className="p-3 rounded-xl shadow-2xl bg-gradient-to-br from-stone-900 to-emerald-950 border border-emerald-700/40 w-64 backdrop-blur-lg">
            <h3 className="text-emerald-200 text-sm font-semibold mb-2 px-1 sticky top-0 bg-stone-900/80 backdrop-blur-sm py-1 rounded">
              Select Theme
            </h3>
            
            {/* Scrollable container */}
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-stone-800 scrollbar-thumb-rounded-full">
              <div className="space-y-2 pr-1">
                {THEMES.map((themeOption) => (
                  <button
                    key={themeOption.name}
                    onClick={() => {
                      setTheme(themeOption.name);
                      setOpen(false);
                    }}
                    className={`
                      w-full px-3 py-3 rounded-lg flex items-center gap-3
                      transition-all duration-200 border
                      ${
                        theme === themeOption.name
                          ? "bg-emerald-800/40 border-emerald-500/50 shadow-lg scale-105"
                          : "border-emerald-800/30 hover:bg-stone-800/40 hover:border-emerald-600/40 hover:scale-105"
                      }
                    `}
                  >
                    <div className={`p-1.5 rounded-lg ${
                      theme === themeOption.name 
                        ? "bg-emerald-500" 
                        : "bg-stone-700"
                    }`}>
                      <PaletteIcon className={`size-3.5 ${
                        theme === themeOption.name ? "text-white" : "text-stone-300"
                      }`} />
                    </div>
                    
                    <span className={`text-sm font-medium ${
                      theme === themeOption.name ? "text-emerald-100" : "text-stone-300"
                    }`}>
                      {themeOption.label}
                    </span>

                    <div className="ml-auto flex gap-1">
                      {themeOption.colors.map((color, i) => (
                        <span
                          key={i}
                          className="size-2 rounded-full border border-white/20"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;