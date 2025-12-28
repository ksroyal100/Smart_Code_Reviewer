"use client";

import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="h-screen bg-linear-to-br from-black via-[#050505] to-black text-white flex flex-col">

      {/* HEADER */}
      <div className="h-14 flex items-center gap-4 px-6 border-b border-white/10 bg-black/50 backdrop-blur sticky top-0 z-10">
        <button
          onClick={() => router.push("/main")}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm"
        >
          ←
        </button>
        <h1 className="text-lg ml-7 font-semibold">Settings</h1>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">

          <ProfileSection />
          <NotificationSection />
          <ThemeSection />
          <AccountSection />

          {/* Bottom spacing */}
          <div className="h-10" />
        </div>
      </div>
    </div>
  );
}

/* ================= SECTIONS ================= */

function ProfileSection() {
  return (
    <section className="rounded-2xl border border-white/10 p-6 space-y-4 bg-black/40">
      <h2 className="text-lg font-medium">Profile</h2>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-blue-500/30 flex items-center justify-center text-xl">
          K
        </div>

        <div>
          <p className="font-medium">Username</p>
          <p className="text-sm text-white/50">user@email.com</p>
        </div>
      </div>

      <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
        Edit Profile
      </button>
    </section>
  );
}

function NotificationSection() {
  return (
    <section className="rounded-2xl border border-white/10 p-6 space-y-4 bg-black/40">
      <h2 className="text-lg font-medium">Notifications</h2>

      <Toggle label="Email Notifications" />
      <Toggle label="In-app Notifications" />
    </section>
  );
}

function Toggle({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/80">{label}</span>
      <button className="w-11 h-6 rounded-full bg-blue-500/40 relative hover:bg-blue-500/60 transition">
        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
      </button>
    </div>
  );
}

function ThemeSection() {
  return (
    <section className="rounded-2xl border border-white/10 p-6 space-y-4 bg-black/40">
      <h2 className="text-lg font-medium">Appearance</h2>

      <div className="flex gap-4">
        <ThemeButton label="Dark" active />
        <ThemeButton label="Light" />
        <ThemeButton label="System" />
      </div>
    </section>
  );
}

function ThemeButton({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg border transition ${
        active
          ? "bg-blue-500/30 border-blue-400/40"
          : "bg-white/5 border-white/10 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function AccountSection() {
  return (
    <section className="rounded-2xl border border-red-500/20 p-6 space-y-4 bg-black/40">
      <h2 className="text-lg font-medium text-red-400">Danger Zone</h2>

      <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition">
        Delete Account
      </button>
    </section>
  );
}
