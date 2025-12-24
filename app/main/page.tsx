"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { isAuthenticated, scheduleAutoLogout } from "@/lib/Auth";

export interface CodeHistoryItem {
  id: string;
  code: string;
  review: string;
  createdAt: number;
}

export default function App() {
  const router = useRouter();

  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ HISTORY STATE (THIS WAS MISSING)
  const [history, setHistory] = useState<CodeHistoryItem[]>([]);

  // 🔐 AUTH GUARD
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    } else {
      scheduleAutoLogout();
    }
  }, [router]);

  const handleHistorySelect = (item: CodeHistoryItem) => {
    setCode(item.code);
    setReview(item.review);
  };

  const handleReview = async () => {
    if (!code.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");
    setReview("");

    try {
      const res = await fetch("/api/ai/get-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setReview(data.result);

      // ✅ SAVE TO HISTORY
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          code,
          review: data.result,
          createdAt: Date.now(),
        },
        ...prev,
      ]);
    } catch (err: any) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode("");
    setReview("");
    setError("");
  };

  return (
    <div className="h-screen flex bg-[#0a0a0a] text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar history={history} onSelect={handleHistorySelect} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor */}
          <div className="w-1/2 p-4 border-r border-gray-800 flex flex-col">
            <h2 className="text-blue-400 mb-2 font-semibold">Code Editor</h2>
            <div className="flex-1 overflow-auto rounded bg-[#111]/70 p-2 border border-gray-800">
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={(c) =>
                  Prism.highlight(c, Prism.languages.javascript, "javascript")
                }
                padding={10}
                className="text-sm font-mono outline-none"
              />
            </div>
          </div>

          {/* Review */}
          <div className="w-1/2 p-4 flex flex-col bg-[#0d0d1a]/70">
            <h2 className="text-blue-400 mb-2 font-semibold">AI Review</h2>
            <div className="flex-1 overflow-auto rounded bg-[#111]/70 border border-gray-800 p-4">
              {error ? (
                <span className="text-red-400">{error}</span>
              ) : loading ? (
                <span className="text-gray-400 italic">Analyzing...</span>
              ) : review ? (
                <pre className="whitespace-pre-wrap text-sm">{review}</pre>
              ) : (
                <span className="text-gray-600">
                  // Your AI review will appear here
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-3 flex justify-center gap-4 bg-[#111]/70">
          <button
            onClick={handleReview}
            disabled={loading}
            className="px-6 py-2 border border-blue-400/40 rounded"
          >
            {loading ? "Analyzing..." : "Review Code"}
          </button>

          <button
            onClick={handleClear}
            className="px-6 py-2 border border-red-400/40 rounded"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
