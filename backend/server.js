import express from "express";
import axios from "axios";
import { load } from "cheerio";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 3000;

// CakeResume爬蟲路由
app.get("/api/crawl-cake", async (req, res) => {
  const keyword = req.query.keyword?.toString() || "frontend";
  const page = req.query.page || 1;
  const url = `https://www.cakeresume.com/jobs?query=${encodeURIComponent(keyword)}&page=${page}`;

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "text/html",
      },
    });

    const $ = load(html); // ✅ 使用正確的 cheerio 載入方式
    const jobs = [];

    const safeText = (el, fallback = "") => el.text()?.trim() || fallback;
    const safeAttr = (el, attr, fallback = "") => el.attr(attr)?.trim() || fallback;

    $("div[class*=JobSearchItem_container]").each((_, el) => {
      const element = $(el);

      const titleEl = element.find("a[class*='JobSearchItem_jobTitle']");
      const title = safeText(titleEl, "未知職稱");
      const jobHref = safeAttr(titleEl, "href");
      const company = safeText(element.find("a[class*='JobSearchItem_companyName']"), "未知公司");
      const location = safeText(element.find("i.fa-map-marker-alt").closest(".InlineMessage_inlineMessage____Ulc").find(".JobSearchItem_featureSegments__ywEPs"), "未知地點");
      const salary = safeText(element.find("i.fa-dollar-sign").closest(".InlineMessage_inlineMessage____Ulc").find(".InlineMessage_label__LJGjW"), "未提供");
      const description = safeText(element.find(".JobSearchItem_description__si5zg"), "無描述");
      // const experience = element.find("i.fa-business-time").closest("div[class*='InlineMessage_label']").text()?.trim();
      // const management = element.find("i.fa-sitemap").closest("div[class*='InlineMessage_label']").text()?.trim();
      // const activeTime = element.find("i.fa-signal-strong").closest("div[class*='InlineMessage_label']").text()?.trim();
      // const views = element.find("i.fa-eye").closest("div[class*='InlineMessage_label']").text()?.trim();
      // const reviewingStatus = element.find("i.fa-file-check").closest("div[class*='InlineMessage_label']").text()?.trim();
      const jobType = safeText(element.find("a[href*='job_type']"), "未知類型");
      const seniority = safeText(element.find("a[href*='seniority_level']"), "未知資歷");

      if (title && company) {
        jobs.push({
          title,
          company,
          location,
          salary,
          description,
          // experience,
          // management,
          // activeTime,
          // views,
          // reviewingStatus,
          jobType,
          seniority,
          link: `https://www.cakeresume.com${jobHref}`,
        });
      }
    });

    // console.log(jobs);

    res.json({ source: "cake", keyword, jobs });
  } catch (error) {
    res.status(500).json({ error: "爬蟲失敗", message: error.message });
  }
});

// 104爬蟲路由
app.get("/api/crawl-104", async (req, res) => {
  const keyword = req.query.keyword || "前端";
  const page = req.query.page || 1;
  const url = `https://www.104.com.tw/jobs/search/list?ro=0&keyword=${encodeURIComponent(keyword)}&page=${page}}`;

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
    // console.log("🧪 單筆職缺內容:", JSON.stringify(data.data.list[1], null, 2));

    const jobs =
      data.data.list?.map((job) => ({
        title: job.jobName || "未知職稱",
        company: job.custName || "未知公司",
        location: job.jobAddrNoDesc + job.jobAddress || "未知地點",
        salary: job.salaryDesc || "未提供",
        // salaryLow: job.salaryLow || "0000000",
        // salaryHigh: job.salaryHigh || "0000000",
        // seniority: job.periodDesc || "1年以上",
        description: job.description || "無描述",
        link: job.link.job || "未知連結",
      })) || [];

    // console.log(jobs);

    res.json({ source: "104", keyword, jobs });
  } catch (error) {
    res.status(500).json({ error: "爬蟲失敗", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
