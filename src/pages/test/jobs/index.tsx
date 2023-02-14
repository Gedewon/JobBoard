import Header from "@/components/Header";
import JobCard from "@/components/JobCard";
import { GetServerSideProps } from "next/types";
import React, { MouseEventHandler } from "react";

export interface Job {
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

  return (
    <div className="flex flex-col p-2 m-8">
      <Header
        jobs={jobs}
        setSelectedJob={setSelectedJob}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />
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
