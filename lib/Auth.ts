"use client";

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("token_expiry");

  if (!token || !expiry) return false;

  if (Date.now() > Number(expiry)) {
    localStorage.clear();
    return false;
  }

  return token.length > 20;
};

export const scheduleAutoLogout = () => {
  const expiry = localStorage.getItem("token_expiry");
  if (!expiry) return;

  const timeout = Number(expiry) - Date.now();
  if (timeout <= 0) return;

  setTimeout(() => {
    localStorage.clear();
    window.location.href = "/";
  }, timeout);
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};

