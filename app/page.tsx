"use client";

import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold text-blue-400">
          SmartBuddy AI 🚀
        </h1>

        <p className="text-gray-400 text-sm">
          AI-powered code review to level up your development workflow.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 rounded-lg border border-blue-400/40
              bg-blue-500/10 hover:bg-blue-500/20
              text-blue-300 hover:shadow-[0_0_15px_#00bfff55]
              transition-all"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="px-6 py-2 rounded-lg border border-green-400/40
              bg-green-500/10 hover:bg-green-500/20
              text-green-300 hover:shadow-[0_0_15px_#00ff8855]
              transition-all"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
