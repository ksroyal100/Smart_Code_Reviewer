"use client";

import { useState } from "react";
import { ReviewSession } from "@/app/main/page";

interface Props {
  history: ReviewSession[];
  onSelect: (item: ReviewSession) => void;
}

export default function Sidebar({ history, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <aside
      className={`${
        open ? "w-64" : "w-14"
      } transition-all duration-300 bg-[#0b0b12] border-r border-gray-800 flex flex-col`}
    >
      {/* TOGGLE */}
      <button
        onClick={() => setOpen(!open)}
        className="h-12 border-b border-gray-800 text-gray-400 hover:text-white"
      >
        {open ? "⟨" : "⟩"}
      </button>

      {/* HISTORY */}
      <div className="flex-1 overflow-y-auto">
        {open && (
          <div className="p-2 space-y-2">
            {history.length === 0 && (
              <p className="text-xs text-gray-500 text-center mt-4">
                No history yet
              </p>
            )}

            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full text-left p-2 rounded-lg hover:bg-blue-500/10"
              >
                <p className="text-xs text-blue-300 truncate">
                  {item.title || "Code Review"}
                </p>
                <p className="text-[10px] text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
