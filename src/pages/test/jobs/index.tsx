import { GetServerSideProps } from "next/types";
import React, { MouseEventHandler } from "react";

interface Job {
  jobId: string;
  source: string;
  jobTitle: string;
  location: string;
  estimatedSalary: string;
  unifiedZippiaSalary: number;
  companyName: string;
  companyInitial: string;
  companyID: number;
  companyLogo: string;
  companyCategories: string[];
  jobDescription: string;
  showNewJobBedge: boolean;
  jobURL: string;
  url: string;
  partnerName: string;
  iconSVG: string;
  iconClass: string;
  templateName: string;
  titleID: string;
  socode: string;
  socCodeName: false;
  listingHash: string;
  postedDate: string;
  postingDate: string;
  actionDateSince: string;
  benefits: string[];
  jobTags: string[];
  jobLevels: string[];
  cpc: number;
  sponsorFlag: boolean;
  contactEmailsFlag: boolean;
  sponsoredDlp: boolean;
  easyApplyFlag: boolean;
  contactEmails: unknown[];
  bestCompaniesPageURLAtJobLocation: string;
  careerMainPageURL: string;
  skillsets: string[];
  OBJcountry: string;
  OBJcity: string;
  OBJstateCode: string;
  OBJstate: string;
  OBJcompanyID: number;
  OBJcompanyDisplay: string;
  OBJindustry: string;
  OBJpostingDate: string;
  OBJtitle: string;
  OBJtitleDisplay: string;
  OBJurl: string;
  OBJzipcode: string;
  OBJjobTags: string[];
  OBJdesc: string;
  jobMajor: boolean;
  requiredDegree: unknown;
  preferredDegrees: string[];
  formattedOriginalCompanyName: string;
  originalCPC: string;
  companyZippiaOverallScore: number;
  isSpammyCompany: boolean;
  nearbyTo0: unknown[];
  snippets: string[];
}

interface JobCard
  extends Pick<Job, "jobTitle" | "companyName" | "jobDescription"> {}

const JobPage: React.FC<{ jobs: Job[] }> = ({ jobs }) => {
  const [selectedJob, setSelectedJob] = React.useState<Job[]>(jobs);
  const [selectedCompany, setSelectedCompany] = React.useState<
    Job["companyName"] | "all"
  >("all");

  React.useEffect(() => {
    let isDisposed = false;
    const getJobByCompanyName = (companyName: string): Job[] => {
      if (companyName === "all") return jobs;
      return jobs.filter((job: Job) => job.companyName === companyName);
    };
    if (!isDisposed) setSelectedJob(getJobByCompanyName(selectedCompany));

    return () => {
      isDisposed = true;
    };
  }, [selectedCompany, jobs]);

  const handleFilterByDate = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
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
  };

  return (
    <div className="flex flex-col p-2 m-8">
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

      <section className="w-full">
        {selectedJob.map((job: Job) => (
          <JobCard
            key={job.jobId}
            companyName={job.companyName}
            jobDescription={job.jobDescription}
            jobTitle={job.jobTitle}
          />
        ))}
      </section>
    </div>
  );
};

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

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`https://www.zippia.com/api/jobs/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      companySkills: true,
      dismissedListingHashes: [],
      fetchJobDesc: true,
      jobTitle: "Business Analyst",
      locations: [],
      numJobs: 10,
      previousListingHashes: [],
    }),
  });

  const data = await res.json();

  const { jobs } = data;

  return { props: { jobs } as unknown as Job[] };
};

export default JobPage;
