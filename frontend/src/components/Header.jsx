import BaseButton from "@/components/BaseButton";
import { obfuscateText } from "@/utils/obfuscateText";

const Header = ({ controls }) => {
  const {
    hideMode,
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
  } = controls;

  return (
    <>
      <header className="w-full flex justify-start items-center">
        <div className="w-full md:w-1/2 flex justify-center items-center">
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

            {/* <select
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
              className="p-2 w-full border rounded-lg"
            >
              <option value="entry_level">
                {hideMode ? obfuscateText("entry_level") : "entry_level"}
              </option>
              <option value="mid_senior_level">
                {hideMode
                  ? obfuscateText("mid_senior_level")
                  : "mid_senior_level"}
              </option>
            </select> */}

            <BaseButton onClick={handleFetch}>→</BaseButton>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
