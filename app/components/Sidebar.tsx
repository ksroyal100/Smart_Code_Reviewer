"use client";

import { useState } from "react";
import { ReviewSession } from "@/app/main/page";

interface Props {
  history: ReviewSession[];
  onSelect: (item: ReviewSession) => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({ history, onSelect, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

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
              <div
                key={item.id}
                className="relative group flex items-center justify-between rounded-lg hover:bg-blue-500/10"
              >
                {/* MAIN CLICK */}
                <button
                  onClick={() => onSelect(item)}
                  className="flex-1 text-left p-2"
                >
                  <p className="text-xs text-blue-300 truncate">
                    {item.title || "Code Review"}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </button>

                {/* THREE DOTS */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(
                      menuOpenId === item.id ? null : item.id
                    );
                  }}
                  className="px-2 text-gray-400 hover:text-white cursor-pointer"
                >
                  ⋮
                </button>

                {/* DROPDOWN */}
                {menuOpenId === item.id && (
                  <div className="absolute right-2 top-10 z-50 bg-[#111] border border-gray-800 rounded-md shadow-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(null);
                        onDelete(item.id);
                      }}
                      className="block w-full text-left px-4 py-2 text-xs text-red-400 cursor-pointer hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
