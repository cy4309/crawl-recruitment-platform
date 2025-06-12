import axios from "axios";
import { rateLimiter } from "../src/utils/rateLimiter.js"; //Node.js 無法自動補上副檔名（在 ESM 模式下），因此要自己加後綴字，Vite 的 alias也會失效。

export default async function handler(req, res) {
  if (!rateLimiter(req, res)) return;

  const keyword = req.query.keyword || "前端";
  const page = req.query.page || 1;
  const url = `https://www.104.com.tw/jobs/search/list?ro=0&keyword=${encodeURIComponent(
    keyword
  )}&page=${page}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://www.104.com.tw/jobs/search/",
        Accept: "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
    // console.log("🧪 單筆職缺內容:", JSON.stringify(data.data.list[0], null, 2));

    const jobs =
      data.data.list?.map((job) => ({
        title: job.jobName || "未知職稱",
        company: job.custName || "未知公司",
        location: job.jobAddrNoDesc + job.jobAddress || "未知地點",
        salary: job.salaryDesc || "未提供",
        description: job.description || "無描述",
        link: job.link.job || "未知連結",
      })) || [];
    // console.log(jobs);

    res.status(200).json({ source: "104", keyword, jobs });
  } catch (error) {
    res.status(500).json({ error: "爬蟲失敗", message: error.message });
  }
}
