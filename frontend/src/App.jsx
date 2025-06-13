import { useState, useEffect } from "react";
import { useJobs } from "@/hooks/useJobs";
import JobList from "@/components/JobList";
import { obfuscateText } from "@/utils/obfuscateText";
import HeaderControls from "@/components/HeaderControls";
import BaseButton from "@/components/BaseButton";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [openMenu, setOpenMenu] = useState(false);
  const [hideMode, setHideMode] = useState(true);
  const [platform, setPlatform] = useState("cake");
  const [keyword, setKeyword] = useState("frontend");
  const [customKeyword, setCustomKeyword] = useState("");
  const [isCustomKeyword, setIsCustomKeyword] = useState(false);
  // const [seniority, setSeniority] = useState("mid_senior_level");
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
    <div className="w-full h-[100dvh]">
      <header className="p-4 w-full">
        <div className="mb-2 w-full flex justify-between items-center">
          <a href="/" className="block w-fit">
            <h1 className="text-sm font-bold text-blue-600 cursor-pointer active:scale-90">
              {hideMode ? obfuscateText("上班不要看職缺") : "上班不要看職缺"}
            </h1>
          </a>
          <div className="flex space-x-2">
            <BaseButton onClick={() => setHideMode(!hideMode)}>
              {hideMode ? "..." : "***"}
            </BaseButton>
            <BaseButton onClick={() => setOpenMenu((prev) => !prev)}>
              ≡
            </BaseButton>
          </div>
        </div>
        {openMenu && (
          <AnimatePresence>
            <motion.div
              key="header-controls"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden w-full"
            >
              <HeaderControls
                controls={{
                  hideMode,
                  setHideMode,
                  platform,
                  setPlatform,
                  keyword,
                  setKeyword,
                  customKeyword,
                  setCustomKeyword,
                  isCustomKeyword,
                  setIsCustomKeyword,
                  // seniority,
                  // setSeniority,
                  page,
                  setPage,
                  handleFetch,
                }}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </header>

      <main className="p-4 mt-4">
        {loading && <p className="text-blue-600">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && jobs.length > 0 && (
          <div className="w-full flex flex-col">
            <small className="mb-2 flex justify-end">
              {hideMode
                ? obfuscateText(`| sources from ${source} |`)
                : `| sources from ${source} |`}
            </small>
            <JobList jobs={jobs} obfuscate={hideMode} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
