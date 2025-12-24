"use client";

import { CodeHistoryItem } from "@/types/codeHistory";

const KEY = "code_history";

export const getHistory = (): CodeHistoryItem[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY) || "[]");
};

export const saveHistory = (item: CodeHistoryItem) => {
  const history = getHistory();
  localStorage.setItem(KEY, JSON.stringify([item, ...history]));
};

export const clearHistory = () => {
  localStorage.removeItem(KEY);
};
