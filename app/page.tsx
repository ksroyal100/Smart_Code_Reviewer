"use client";

import { useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";

export default function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [review, setReview] = useState("");
  const [codeBlocks, setCodeBlocks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🧠 Handle Review
  const handleReview = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setReview("");
    setCodeBlocks([]);

    try {
      const res = await fetch("/api/ai/get-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      const codeMatches = [...data.result.matchAll(/```([\s\S]*?)```/g)];
      const blocks = codeMatches.map((m) => m[1].trim());
      setCodeBlocks(blocks);

      const formatted = data.result
        .replace(/```([\s\S]*?)```/g, (match:any, p1:any) => {
          return `<pre class='bg-[#0a0a0a]/70 p-3 rounded-lg border border-gray-800 text-sm text-green-400 overflow-auto mb-3'><code>${p1}</code></pre>`;
        })
        .replace(/^❌/gm, "<span class='text-red-400 font-bold'>❌</span>")
        .replace(/^✅/gm, "<span class='text-green-400 font-bold'>✅</span>")
        .replace(/^💡/gm, "<span class='text-yellow-400 font-bold'>💡</span>")
        .replace(/^🔍/gm, "<span class='text-blue-400 font-bold'>🔍</span>")
        .replace(/\n/g, "<br/>");

      setReview(formatted);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  // 🧹 Clear All
  const handleClear = () => {
    setCode("");
    setReview("");
    setError("");
    setCodeBlocks([]);
  };

  // 📋 Copy
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    const btn = document.getElementById("copy-btn");
    if (btn) {
      btn.innerText = "Copied!";
      setTimeout(() => (btn.innerText = "Copy"), 1500);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden md:overflow-hidden overflow-y-auto md:overflow-y-hidden">
      {/* Main Section */}
      <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden overflow-visible">
        {/* Left: Code Editor */}
        <div className="md:w-1/2 w-full p-4 border-b md:border-b-0 md:border-r border-gray-800 flex flex-col">
          <h2 className="text-blue-400 mb-2 font-semibold">Code Editor</h2>
          <div className="flex-1 overflow-auto rounded-lg bg-[#111]/70 p-2 border border-gray-800">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) =>
                Prism.highlight(code, Prism.languages.javascript, "javascript")
              }
              padding={10}
              className="text-sm font-mono outline-none"
              style={{
                backgroundColor: "transparent",
                color: "#fff",
                minHeight: "100%",
              }}
            />
          </div>
        </div>

        {/* Right: AI Review */}
        <div className="md:w-1/2 w-full p-4 flex flex-col bg-[#0d0d1a]/70 backdrop-blur-lg border-t md:border-t-0 md:border-l border-gray-800/50">
          <h2 className="text-blue-400 mb-2 font-semibold">AI Review</h2>

          <div className="flex-1 overflow-auto rounded-lg bg-[#111]/70 border border-gray-800 p-4">
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : loading ? (
              <span className="text-gray-400 italic">
                Analyzing your code...
              </span>
            ) : review ? (
              <>
                <div
                  className="text-sm font-mono leading-relaxed text-[#cdd6f4] whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: review }}
                />

                {codeBlocks.length > 0 && (
                  <div className="flex justify-end mt-3">
                    <button
                      id="copy-btn"
                      onClick={() =>
                        handleCopy(codeBlocks[codeBlocks.length - 1])
                      }
                      className="text-xs px-3 py-1 rounded-md border border-blue-400/40 
                        bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 
                        hover:shadow-[0_0_10px_#00bfff55] active:scale-95 transition-all duration-300"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </>
            ) : (
              <span className="text-gray-600">
                // Your AI code review will appear here...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="bg-[#111]/50 border-t border-gray-800 p-3 flex justify-center gap-4 backdrop-blur-md md:sticky md:bottom-0">
        <button
          onClick={handleReview}
          disabled={loading || !code.trim()}
          className={`px-6 py-2 rounded-lg font-medium tracking-wide transition-all duration-300 border
            ${
              loading
                ? "border-gray-600 text-gray-400 cursor-not-allowed bg-transparent"
                : "border-blue-400/40 bg-linear-to-r from-transparent via-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 text-white hover:shadow-[0_0_15px_#00bfff55] active:scale-95"
            }`}
        >
          {loading ? "Analyzing..." : "Review Code"}
        </button>

        <button
          onClick={handleClear}
          className="px-6 py-2 rounded-lg font-medium tracking-wide transition-all duration-300 border border-red-400/40
          bg-linear-to-r from-transparent via-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 
          text-white hover:shadow-[0_0_15px_#ff004455] active:scale-95"
        >
          Clear All
        </button>
        
      </div>
    </div>
  );
}
