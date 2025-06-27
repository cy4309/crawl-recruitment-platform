import { obfuscateText } from "@/utils/obfuscateText";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

function JobList({ jobs, obfuscate }) {
  if (!jobs.length) return <p className="text-gray-500">目前沒有資料。</p>;

  return (
    <motion.ul className="gap-4 w-full flex flex-col">
      <AnimatePresence>
        {jobs.map((job, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border p-4 mb-2"
          >
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold"
            >
              {obfuscate ? obfuscateText(job.title) : job.title}
            </a>
            <div className="text-sm text-gray-700">
              <span className="bg-yellow-200 font-bold">
                {obfuscate ? obfuscateText(job.salary) : job.salary}
              </span>
              ｜{obfuscate ? obfuscateText(job.company) : job.company}｜
              {obfuscate ? obfuscateText(job.location) : job.location}
            </div>
            {/* <p className="text-sm text-gray-600">
            {obfuscate ? obfus
            cateText(job.description) : job.description}
          </p> */}

            {/* ✅ 加上 AI 推薦區塊（若有分析資料） */}
            {job.summary && (
              <div className="text-sm text-gray-700 bg-gray-100 rounded p-2 mt-2 space-y-1">
                <p className="font-medium">
                  {obfuscate
                    ? obfuscateText("🔎 AI 推薦摘要：")
                    : "🔎 AI 推薦摘要："}
                </p>
                <p>{obfuscate ? obfuscateText(job.summary) : job.summary}</p>

                <div className="text-xs text-gray-600 flex flex-wrap gap-2 mt-1 items-center">
                  <span>
                    {obfuscate
                      ? obfuscateText(
                          `⭐ 推薦分數：${job.recommendScore || "N/A"}/10`
                        )
                      : `⭐ 推薦分數：${job.recommendScore || "N/A"}/10`}
                  </span>
                  {Array.isArray(job.tags) && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {job.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs"
                        >
                          {obfuscate ? obfuscateText(`#${tag}`) : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}

export default JobList;
