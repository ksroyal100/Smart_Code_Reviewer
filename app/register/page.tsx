"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Registration failed");
      }

      const data = await res.json();

      // ✅ STORE TOKEN FOR 1 WEEK
      const oneWeek = 7 * 24 * 60 * 60 * 1000;

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem(
        "token_expiry",
        (Date.now() + oneWeek).toString()
      );

      // ✅ GO DIRECTLY TO MAIN (NO BACK)
      router.replace("/main");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm bg-[#111]/70 p-6 rounded-xl border border-gray-800"
      >
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">
          Create Account
        </h2>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 rounded bg-black border border-gray-700"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-4 p-2 rounded bg-black border border-gray-700"
        />

        <button
          disabled={loading}
          className="w-full py-2 rounded bg-blue-500/20 text-blue-300
            hover:bg-blue-500/30 transition"
        >
          {loading ? "Registering..." : "Register"}
         
        </button>
         <p className="text-xs text-center text-gray-500 mt-2">
          Already have account? {" "}
          <span
            onClick={() => router.push("/login")}
            className="text-green-400 cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
