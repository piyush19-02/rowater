const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/$/, "");

export async function api(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.status === false) throw new Error(payload.message || "Request failed");
  return payload;
}
