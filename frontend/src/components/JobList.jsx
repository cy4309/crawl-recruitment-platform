import { obfuscateText } from "@/utils/obfuscateText";

function JobList({ jobs, obfuscate }) {
  if (!jobs.length) return <p className="text-gray-500">目前沒有資料。</p>;

  return (
    <ul className="space-y-4 w-full flex flex-col">
      {jobs.map((job, idx) => (
        <li key={idx} className="pb-2 border-b">
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
            {obfuscate ? obfuscateText(job.description) : job.description}
          </p> */}
        </li>
      ))}
    </ul>
  );
}

export default JobList;
