import { Job } from "@/pages/test/jobs";
import React from "react";

interface HeaderProps {
  jobs: Job[];
  setSelectedJob: React.Dispatch<React.SetStateAction<Job[]>>;
  selectedCompany: Job["companyName"];
  setSelectedCompany: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({
  jobs,
  setSelectedJob,
  selectedCompany,
  setSelectedCompany,
}) => {
  const handleFilterByDate = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();

      const jobPublishedInLast7days = jobs.filter((job) => {
        /**
         *  format of the "postedDate" is like "12h ago" or "12d ago"
         *  we will split and check the first part.
         */
        const [days] = job.postedDate.split(" ");

        /**
         * if it's in months or year return early
         * assumption: m only refers months not minutes.
         */
        if (["m", "y"].includes(days.charAt(days.length - 1))) return false;

        /**
         * if it's been more that 7 days return early.
         */
        if (parseInt(days.slice(0, days.length - 1)) > 7) return false;

        return true;
      });

      if (jobPublishedInLast7days.length === 0) return;

      setSelectedJob(jobPublishedInLast7days);

    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [jobs.toString(), setSelectedJob]
  );
  return (
    <section className="flex justify-between">
      <section className="flex items-center gap-2">
        <label
          htmlFor="countries"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select by Company
        </label>
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          id="countries"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option key={`selectCompany-all`} value={"all"}>
            all
          </option>
          {jobs.map((jobs) => {
            return (
              <option
                key={`selectCompany-${jobs.jobId}`}
                value={jobs.companyName}
              >
                {jobs.companyName}
              </option>
            );
          })}
        </select>
      </section>

      <button
        type="button"
        onClick={handleFilterByDate}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Jobs in the last 7 days
      </button>
    </section>
  );
};

export default Header;
