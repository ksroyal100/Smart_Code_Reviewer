export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("token_expiry");

  if (!token || !expiry) return false;

  if (Date.now() > Number(expiry)) {
    localStorage.clear();
    return false;
  }

  return true;
};

export const Logout = (router: any) => {
  localStorage.clear();
  router.replace("/"); 
};
