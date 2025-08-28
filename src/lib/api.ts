import axios from "axios";

// API base
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Flag برای جلوگیری از لوپ بی‌نهایت
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


// Response interceptor (برای هندل کردن 401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // فقط وقتی 401 بود
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 👇 درخواست refresh با فرستادن refresh_token در body
        const res = await axios.post("/api/refresh"); // بدون body
        const newToken = res.data.access_token;
        

        processQueue(null, newToken);
        isRefreshing = false;

        // آپدیت توکن در هدر axios
        api.defaults.headers.common["Authorization"] = "Bearer " + newToken;

        // دوباره درخواست اصلی رو اجرا کن
        originalRequest.headers["Authorization"] = "Bearer " + newToken;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
