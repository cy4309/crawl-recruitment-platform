import { useState } from "react";
import { getCrawledJobs, analyzeJobs } from "@/services/jobsService";

// ✅ AI 開關（只要改這行就可以完全關掉 AI 分析）
const USE_AI = import.meta.env.VITE_USE_AI === "true";

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async (platform, keyword, page) => {
    setLoading(true);
    setError(null);
    try {
      // 1. 爬蟲資料
      const crawled = await getCrawledJobs(platform, keyword, page);
      const crawledJobs = Array.isArray(crawled?.jobs) ? crawled.jobs : [];
      setSource(crawled.source);

      let combined = crawledJobs;

      // 2. AI 分析（可切換）
      if (USE_AI && crawledJobs.length > 0) {
        try {
          const analyzed = await analyzeJobs(crawledJobs);
          combined = crawledJobs.map((job, idx) => ({
            ...job,
            ...analyzed[idx],
          }));
        } catch (aiErr) {
          console.warn("⚠️ AI 分析失敗，已略過：", aiErr);
        }
      }

      setJobs(combined);
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
