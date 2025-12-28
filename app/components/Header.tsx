"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/Auth";
// import { logout } from "@/lib/Auth";

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [firstLetter, setFirstLetter] = useState("U");

  // ✅ SAFE localStorage access
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setFirstLetter(username.charAt(0).toUpperCase());
    }
  }, []);

  const handleLogoClick = () => {
    router.push("/main"); // ALWAYS main when logged in
  };

  return (
    <header className="relative z-50 h-14 w-full flex items-center justify-between px-6
      bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800">

      {/* Logo */}
      <div
        onClick={handleLogoClick}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center
          text-blue-400 font-bold shadow-[0_0_10px_#00bfff55]">
          🚀
        </div>
        <span className="font-semibold tracking-wide text-blue-300">
          SmartBuddy
        </span>
      </div>

      {/* Profile */}
      <div className="relative">
        <div
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full bg-blue-500/20 
            flex items-center justify-center text-blue-300 font-semibold cursor-pointer"
        >
          {firstLetter}
        </div>

        {open && (
          <div className="absolute right-0 top-12 z-50 w-40 rounded-lg
            bg-[#0f0f1a] border border-gray-800 shadow-xl">
            
            <button
              onClick={() =>router.push("/settings")}
              className="w-full px-4 py-2 text-left text-gray-500 hover:bg-gray-800"
            >
              Settings
            </button>
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
