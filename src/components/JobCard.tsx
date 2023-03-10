import { Job } from "@/pages/test/jobs";
import React from "react";

interface JobCard
  extends Pick<Job, "jobTitle" | "companyName" | "jobDescription"> {}

const JobCard: React.FC<JobCard> = (Job) => {
  return (
    <div className="my-2">
      <div className=" bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          {Job.jobTitle}
        </h5>
        <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
          {Job.companyName}
        </p>
        <div className="p-4 border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r  flex flex-col justify-between leading-normal">
          <div dangerouslySetInnerHTML={{ __html: Job.jobDescription }} />
        </div>
      </div>
    </div>
  );
};

export default JobCard;
