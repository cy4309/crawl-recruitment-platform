import axios from "axios";
import { load } from "cheerio";

export default async function handler(req, res) {
  const keyword = req.query.keyword?.toString() || "frontend";
  const url = `https://www.cakeresume.com/jobs?query=${encodeURIComponent(keyword)}&page=1`;

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

    res.status(200).json({ source: "cake", keyword, jobs });
  } catch (error) {
    res.status(500).json({ error: "爬蟲失敗", message: error.message });
  }
}
