import { obfuscateText } from "@/utils/obfuscateText";

function JobList({ jobs, obfuscate }) {
  if (!jobs.length) return <p className="text-gray-500">目前沒有資料。</p>;

  const isHighlightSalary = (salaryStr) => {
    if (!salaryStr) return false;
    if (salaryStr.includes("面議") || salaryStr.includes("依公司規定"))
      return false;

    const match = salaryStr.match(/\d{2,}/g);
    if (!match) return false;

    const minSalary = Math.min(...match.map(Number));

    if (salaryStr.includes("年")) {
      return (
        minSalary >= (salaryStr.includes(750000) || salaryStr.includes("75萬"))
      );
    } else if (salaryStr.includes("月")) {
      return (
        minSalary >= (salaryStr.includes(60000) || salaryStr.includes("6萬"))
      );
    }

    return false;
  };

  return (
    <ul className="space-y-4 w-full flex flex-col">
      {jobs.map((job, idx) => {
        const highlight = isHighlightSalary(job.salary);
        return (
          <li
            key={idx}
            className={`border-b pb-2 rounded-md ${
              highlight ? "bg-blue-600 text-white" : ""
            }`}
          >
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold ${
                highlight ? "text-white" : "text-blue-600"
              }`}
            >
              {obfuscate ? obfuscateText(job.title) : job.title}
            </a>
            <div className="text-sm">
              {obfuscate ? obfuscateText(job.company) : job.company}｜
              {obfuscate ? obfuscateText(job.location) : job.location}｜
              {obfuscate ? obfuscateText(job.salary) : job.salary}
            </div>
            {/* <p className="text-sm text-gray-600">
              {obfuscate ? obfuscateText(job.description) : job.description}
            </p> */}
          </li>
        );
      })}
    </ul>
  );
}

export default JobList;
