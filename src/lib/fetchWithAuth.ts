export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const tokenRes = await fetch("/api/token", { cache: "no-store" });
  if (!tokenRes.ok) throw new Error("No token found");

  const { token } = await tokenRes.json();
  const isFormData = options.body instanceof FormData;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }

  if (response.status === 204) return;
  return response.json();
};
