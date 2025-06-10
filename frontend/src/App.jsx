import { useState } from "react";
import axios from "axios";
import BaseButton from "@/components/BaseButton";

function App() {
  const [jobs, setJobs] = useState([]);
  console.log(jobs);
  const [source, setSource] = useState("");
  const apiBaseUrl =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_DEV_API_URL
      : import.meta.env.VITE_PROD_API_URL;

  const fetch104 = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/crawl-104`);
      setJobs(res.data.jobs);
      setSource(res.data.source);
    } catch (err) {
      console.error("爬蟲失敗", err);
    }
  };

  const fetchCake = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/crawl-cake`);
      setJobs(res.data.jobs);
      setSource(res.data.source);
    } catch (err) {
      console.error("爬蟲失敗", err);
    }
  };

  return (
    <div className="p-4 w-full h-[100dvh]">
      <header className="space-x-4 w-full flex justify-end items-center">
        {/* <h1>爬蟲 Demo</h1> */}
        <BaseButton onClick={fetch104}>1</BaseButton>
        <BaseButton onClick={fetchCake}>C</BaseButton>
      </header>

      {source === "104" && (
        <ul className="space-y-4 w-full flex flex-col">
          {jobs.map((job, idx) => (
            <li key={idx}>
              <a href={job.link}>
                <strong>{job.title}</strong>
              </a>
              <br />
              {job.company}
              <br />
              {job.location}
              <br />
              {job.salary}
              <br />
              {job.description}
            </li>
          ))}
        </ul>
      )}
      {source === "cake" && (
        <ul className="space-y-4 w-full flex flex-col">
          {jobs.map((job, idx) => (
            <li key={idx}>
              <a href={job.link}>
                <strong>{job.title}</strong>
              </a>
              <br />
              {job.company}
              <br />
              {job.location}
              <br />
              {job.salary}
              <br />
              {job.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
