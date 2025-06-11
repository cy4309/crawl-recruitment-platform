import { useState, useEffect } from "react";
import { useJobs } from "@/hooks/useJobs";
import BaseButton from "@/components/BaseButton";
import JobList from "@/components/JobList";
import { obfuscateText } from "@/utils/obfuscateText";

function App() {
  const [hideMode, setHideMode] = useState(true);
  const [platform, setPlatform] = useState("cake");
  const [keyword, setKeyword] = useState("frontend");
  const [customKeyword, setCustomKeyword] = useState("");
  const [isCustomKeyword, setIsCustomKeyword] = useState(false);
  const [page, setPage] = useState(1);
  const { jobs, source, loading, error, fetchJobs } = useJobs();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setHideMode(true);
      } else if (e.key === "Enter") {
        setHideMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleFetch = () => {
    const finalKeyword = isCustomKeyword ? customKeyword : keyword;
    fetchJobs(platform, finalKeyword, page);
  };

  return (
    <div className="p-4 w-full h-[100dvh]">
      <header className="w-full flex justify-end items-center">
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <BaseButton onClick={() => setHideMode(!hideMode)}>
            {hideMode ? "..." : "***"}
          </BaseButton>

          <div className="p-2 space-x-2 w-full rounded-xl flex justify-center items-center">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="p-2 w-full border rounded-lg"
            >
              <option value="cake">
                {hideMode ? obfuscateText("cake") : "cake"}
              </option>
              <option value="104">
                {hideMode ? obfuscateText("104") : "104"}
              </option>
            </select>

            <select
              value={isCustomKeyword ? "custom" : keyword}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "custom") {
                  setIsCustomKeyword(true);
                } else {
                  setKeyword(val);
                  setIsCustomKeyword(false);
                  setCustomKeyword(""); // 重設 custom 輸入
                }
              }}
              className="p-2 w-full border rounded-lg"
            >
              <option value="frontend">
                {hideMode ? obfuscateText("frontend") : "frontend"}
              </option>
              <option value="前端">
                {hideMode ? obfuscateText("前端") : "前端"}
              </option>
              <option value="custom">
                {hideMode ? obfuscateText("其他") : "其他"}
              </option>
            </select>

            {isCustomKeyword && (
              <input
                type="text"
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                className="p-2 w-full border rounded-lg"
                placeholder="關鍵字"
              />
            )}

            <div className="gap-2 w-full flex justify-center items-center">
              <BaseButton
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="p-2 w-full border rounded-lg"
              >
                -
              </BaseButton>
              <span>{hideMode ? obfuscateText(page.toString()) : page}</span>
              <BaseButton
                onClick={() => setPage((prev) => prev + 1)}
                className="p-2 w-full border rounded-lg"
              >
                +
              </BaseButton>
            </div>

            <BaseButton onClick={handleFetch}>→</BaseButton>
          </div>
        </div>
      </header>

      <main className="mt-4">
        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && jobs.length > 0 && (
          <div className="w-full flex flex-col">
            <small className="mb-2 flex justify-end">
              {hideMode
                ? obfuscateText(`source from ${source}`)
                : `source from ${source}`}
            </small>
            <JobList jobs={jobs} obfuscate={hideMode} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
