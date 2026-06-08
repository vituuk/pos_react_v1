import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-16 h-9 rounded-full bg-muted animate-pulse" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-9 w-[68px] cursor-pointer items-center rounded-full bg-[#E2E8F0] dark:bg-[#2C3E50] p-1 transition-colors duration-500 focus:outline-none shadow-inner border border-slate-300 dark:border-slate-800"
      aria-label="Toggle Theme"
    >
      {/* Background elements - stars/clouds */}
      <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden pointer-events-none">
        {/* Clouds for light mode */}
        <div className={`absolute left-2 top-2 w-2 h-2 rounded-full bg-white opacity-80 transition-transform duration-500 ${isDark ? '-translate-y-8' : 'translate-y-0'}`} />
        <div className={`absolute left-5 top-4 w-3 h-1.5 rounded-full bg-white opacity-80 transition-transform duration-500 delay-75 ${isDark ? '-translate-y-8' : 'translate-y-0'}`} />
        
        {/* Stars for dark mode */}
        <div className={`absolute right-6 top-2.5 w-1 h-1 rounded-full bg-white transition-all duration-500 ${isDark ? 'opacity-80 scale-100' : 'opacity-0 scale-0'}`} />
        <div className={`absolute right-10 top-4.5 w-0.5 h-0.5 rounded-full bg-white transition-all duration-500 delay-100 ${isDark ? 'opacity-80 scale-100' : 'opacity-0 scale-0'}`} />
        <div className={`absolute right-4 top-5 w-1 h-1 rounded-full bg-white transition-all duration-500 delay-150 ${isDark ? 'opacity-80 scale-100' : 'opacity-0 scale-0'}`} />
      </div>

      {/* Toggle Thumb */}
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${
          isDark 
            ? "translate-x-8 bg-[#F59E0B] shadow-[0_0_12px_#F59E0B]" 
            : "translate-x-0 bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.5)]"
        }`}
      >
        {isDark ? (
          <div className="relative flex flex-col items-center justify-center w-full h-full text-[#2C3E50]">
            {/* Custom styled Moon to resemble the user's reference image */}
            <svg
              className="w-4.5 h-4.5 transition-transform duration-500 rotate-[-15deg]"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            {/* Mini waves/lines at the bottom of the moon like user image */}
            <div className="absolute bottom-1.5 flex flex-col gap-[1px] items-center">
              <span className="w-2.5 h-[1.5px] bg-[#2C3E50] rounded-full opacity-80" />
              <span className="w-1.5 h-[1.2px] bg-[#2C3E50] rounded-full opacity-80" />
            </div>
            {/* Tiny dots next to the moon */}
            <span className="absolute left-1.5 top-2.5 w-0.5 h-0.5 rounded-full bg-[#2C3E50] opacity-60" />
            <span className="absolute right-1.5 top-2 w-0.5 h-0.5 rounded-full bg-[#2C3E50] opacity-60" />
          </div>
        ) : (
          <Sun className="h-4.5 w-4.5 text-white transition-transform duration-500 rotate-0" />
        )}
      </div>
    </button>
  );
}
