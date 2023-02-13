import { GetServerSideProps } from "next/types";

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
 
  return (
    <div className="flex flex-col py-2">
      {jobs.map((job: Job) => (
        <JobCard
          key={job.jobId}
          companyName={job.companyName}
          jobDescription={job.jobDescription}
          jobTitle={job.jobTitle}
        />
      ))}
    </div>
  );
};

const JobCard: React.FC<JobCard> = (Job) => {
  return (
    <div className="w-full ">
      <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
        <div className="mb-8">
          <div className="text-gray-900 font-bold text-xl mb-2">
            {Job.jobTitle}
          </div>
          <div className="flex items-center">
            <div className="text-lg">
              <p className="text-gray-900  text-md mb-2">{Job.companyName}</p>
            </div>
          </div>
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
