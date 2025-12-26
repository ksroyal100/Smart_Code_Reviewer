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

  /* 🔐 AUTH GUARD */
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    } else {
      scheduleAutoLogout();
    }
  }, []);

  /* 📚 LOAD HISTORY ON PAGE LOAD */
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/api/reviews", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setHistory(data);
  };

  /* 🧠 AI REVIEW */
  const handleReview = async () => {
    if (!code.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

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
      if (!res.ok) throw new Error(data.error);

      const formatted = data.result
        .replace(/```([\s\S]*?)```/g, (_, p1) => {
          return `<pre class='bg-[#0a0a0a]/70 p-3 rounded-lg border border-gray-800 text-green-400 mb-3'><code>${p1}</code></pre>`;
        })
        .replace(/\n/g, "<br/>");

      setReview(formatted);

      /* 💾 SAVE SESSION TO DB */
      await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code,
          reviewHtml: formatted,
        }),
      });

      fetchHistory(); // refresh sidebar
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* 📂 CLICK HISTORY ITEM */
  const handleHistorySelect = async (item: ReviewSession) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/reviews/${item.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const session = await res.json();
    setCode(session.code);
    setReview(session.reviewHtml);
  };

  return (
    <div className="h-screen flex bg-[#0a0a0a] text-white overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar history={history} onSelect={handleHistorySelect} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <Header />

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

          {/* CODE EDITOR */}
          <div className="md:w-1/2 w-full p-4 border-r border-gray-800 flex flex-col">
            <h2 className="text-blue-400 mb-2 font-semibold">Code Editor</h2>
            <div className="flex-1 bg-[#111] rounded-lg p-2 overflow-auto">
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={(code) =>
                  Prism.highlight(code, Prism.languages.javascript, "javascript")
                }
                padding={10}
                className="text-sm font-mono outline-none"
              />
            </div>
          </div>

          {/* REVIEW */}
          <div className="md:w-1/2 w-full p-4 flex flex-col">
            <h2 className="text-blue-400 mb-2 font-semibold">AI Review</h2>
            <div className="flex-1 bg-[#111] rounded-lg p-4 overflow-auto">
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
        <div className="border-t border-gray-800 p-3 flex justify-center gap-4">
          <button
            onClick={handleReview}
            className="px-6 py-2 border border-blue-400/40 rounded-lg"
          >
            Review Code
          </button>
        </div>
      </div>
    </div>
  );
}
