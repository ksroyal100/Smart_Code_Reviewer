"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { isAuthenticated, scheduleAutoLogout } from "@/lib/Auth";
import { API_BASE_URL } from "@/lib/Api";


export interface ReviewSession {
  id: string;
  title: string;
  code: string;
  reviewHtml: string;
  createdAt: string;
}

export default function MainPage() {
  const router = useRouter();

  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [history, setHistory] = useState<ReviewSession[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
      return;
    }

    scheduleAutoLogout();
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Failed to load history", res.status);
        setHistory([]); // safe fallback
        return;
      }

      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("History fetch error", err);
      setHistory([]);
    }
  };

  /* CLEAR */
  const handleClear = () => {
    setCode("");
    setReview("");
    setError("");
  };

  /* AI REVIEW */
  const handleReview = async () => {
    if (!code.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    setLoading(true);
    setError("");
    setReview("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const formatted = data.result
        .replace(/```([\s\S]*?)```/g, (_: any, p1: any) => {
          return `
      <pre class="bg-[#0a0a0a]/70 p-3 rounded-lg border border-gray-800 text-green-400 mb-3 overflow-x-auto max-w-full">
        <code class="whitespace-pre">${p1}</code>
      </pre>
    `;
        })
        .replace(/\n/g, "<br/>");

      setReview(formatted);

      /* SAVE SESSION */
      await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, reviewHtml: formatted }),
      });

      fetchHistory();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirmed = confirm("Delete this review?");
    if (!confirmed) return;

    await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchHistory(); // refresh sidebar
  };

  const handleHistorySelect = async (item: ReviewSession) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${item.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to load review session");
      }

      const session = await res.json();

      // Load saved data (NO AI CALL)
      setCode(session.code);
      setReview(session.reviewHtml);
    } catch (err) {
      console.error(err);
      alert("Unable to load saved review");
    }
  };

  return (
    <div className="h-screen flex bg-[#0a0a0a] text-white overflow-hidden">
      {/* SIDEBAR (navigation only) */}
      <Sidebar
        history={history}
        onSelect={handleHistorySelect}
        onDelete={handleDelete}
      />

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setCode={setCode} setReview={setReview} setError={setError} />

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* CODE EDITOR */}
          <div className="md:w-1/2 w-full p-4 border-r border-gray-800 flex flex-col">
            <h2 className="text-blue-400 mb-2 font-semibold">Code Editor</h2>
            <div className="flex-1 bg-[#111] rounded-lg p-2 overflow-auto">
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={(code) =>
                  Prism.highlight(
                    code,
                    Prism.languages.javascript,
                    "javascript"
                  )
                }
                padding={10}
                className="text-sm font-mono outline-none"
              />
            </div>
          </div>

          {/* REVIEW */}
          <div className="md:w-1/2 w-full p-4 flex flex-col">
            <h2 className="text-blue-400 mb-2 font-semibold">AI Review</h2>
            <div className="flex-1 bg-[#111] rounded-lg p-4 overflow-auto max-w-full">
              {loading ? (
                <span className="text-gray-400">Analyzing...</span>
              ) : error ? (
                <span className="text-red-400">{error}</span>
              ) : review ? (
                <div
                  dangerouslySetInnerHTML={{ __html: review }}
                  className="text-sm font-mono"
                />
              ) : (
                <span className="text-gray-600">
                  // Review will appear here
                </span>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 flex justify-center gap-4 border-t border-white/10">
          {/* REVIEW BUTTON */}
          <button
            onClick={handleReview}
            disabled={loading}
            className={`
      px-6 py-2 rounded-xl border transition-all duration-200
      ${
        loading
          ? "bg-blue-500/10 text-blue-300 cursor-not-allowed opacity-70"
          : "bg-blue-500/20 text-blue-300 border-blue-400/30 hover:bg-transparent cursor-pointer hover:scale-105"
      }
    `}
          >
            {loading ? "Reviewing…" : "Review Code"}
          </button>

          {/* CLEAR BUTTON */}
          <button
            onClick={handleClear}
            disabled={loading}
            className={`
      px-6 py-2 rounded-xl border transition-all duration-200
      ${
        loading
          ? "bg-red-500/5 text-red-300/50 cursor-not-allowed"
          : "bg-red-500/10 text-red-300 border-red-400/20 hover:bg-transparent cursor-pointer hover:scale-105"
      }
    `}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
