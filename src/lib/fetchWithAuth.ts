export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const tokenRes = await fetch("/api/token", { cache: "no-store" });
    if (!tokenRes.ok) {
      throw new Error("No token found");
    }
    const { token } = await tokenRes.json();
  
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Request failed");
    }
  
    // 👇 اگر 204 بود (بدون بدنه) همونجا return کن
    if (response.status === 204) {
      return;
    }
  
    return response.json();
  };
  