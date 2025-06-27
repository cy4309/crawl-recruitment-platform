import axios from "axios";

const apiCrawlUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_CRAWL_API
    : import.meta.env.VITE_PROD_CRAWL_API;

const apiAiUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_AI_API
    : import.meta.env.VITE_PROD_AI_API;

/**
 * 爬蟲 API：取得職缺
 */
export async function getCrawledJobs(platform, keyword, page) {
  try {
    const res = await axios.get(
      `${apiCrawlUrl}/crawl-${platform}?keyword=${keyword}&page=${page}`
    );

    if (res.data?.jobs && Array.isArray(res.data.jobs)) {
      return res.data;
    } else {
      console.warn("⚠️ 回傳格式錯誤:", res.data);
      return { jobs: [], source: "" };
    }
  } catch (err) {
    console.error("❌ getCrawledJobs 錯誤:", err);
    return { jobs: [], source: "" };
  }
}

/**
 * GPT 分析 API：取得 summary / score / tags
 */
export async function analyzeJobs(jobs) {
  try {
    const res = await axios.post(`${apiAiUrl}/api/summary`, jobs);
    return res.data;
  } catch (err) {
    console.error("❌ analyzeJobs 錯誤:", err);
    return [];
  }
}
