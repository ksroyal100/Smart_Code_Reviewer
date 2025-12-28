"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { isAuthenticated, scheduleAutoLogout } from "@/lib/Auth";

export default function ReviewSessionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    } else {
      scheduleAutoLogout();
      loadSession();
    }
  }, []);

  const loadSession = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/reviews/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to load session");
      }

      const data = await res.json();
      setCode(data.code);
      setReview(data.reviewHtml);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* CODE */}
        <div className="w-1/2 p-4 border-r border-gray-800 overflow-auto">
          <h2 className="text-blue-400 mb-2 font-semibold">
            Code (Read Only)
          </h2>
          <pre className="bg-[#111] p-3 rounded-lg text-sm">
            {code}
          </pre>
        </div>

        {/* REVIEW */}
        <div className="w-1/2 p-4 overflow-auto">
          <h2 className="text-blue-400 mb-2 font-semibold">
            AI Review
          </h2>

          {loading ? (
            <span className="text-gray-400">Loading...</span>
          ) : error ? (
            <span className="text-red-400">{error}</span>
          ) : (
            <div
              className="text-sm font-mono"
              dangerouslySetInnerHTML={{ __html: review }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
