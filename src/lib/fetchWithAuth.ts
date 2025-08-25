// lib/fetchWithAuth.ts
import api from "./api";

export const fetchWithAuth = async (url: string, options: any = {}) => {
  const method = (options.method || "GET").toLowerCase();
  const isFormData = options.body instanceof FormData;

  const config = {
    headers: {
      ...(options.headers || {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  };

  switch (method) {
    case "post":
      return api.post(url, options.body, config).then(res => res.data);
    case "put":
      return api.put(url, options.body, config).then(res => res.data);
    case "delete":
      return api.delete(url, config).then(res => res.data);
    default:
      return api.get(url, config).then(res => res.data);
  }
};
