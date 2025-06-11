import { useState } from "react";
import axios from "axios";

const apiBaseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_API_URL
    : import.meta.env.VITE_PROD_API_URL;

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async (platform, keyword, page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${apiBaseUrl}/crawl-${platform}?keyword=${keyword}&page=${page}`
      );
      setJobs(res.data.jobs);
      setSource(res.data.source);
    } catch (err) {
      console.error("❌ API 請求失敗:", err);
      setError("API 請求失敗");
    } finally {
      setLoading(false);
    }
  };

  return {
    jobs,
    source,
    loading,
    error,
    fetchJobs,
  };
}
