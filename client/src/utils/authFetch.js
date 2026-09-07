import API_URL from "../api";

export async function authFetch(endpoint, options = {}) {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
    return;
  }

  return res;
}