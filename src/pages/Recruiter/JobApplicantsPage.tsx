import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { TabView, TabPanel } from "primereact/tabview";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useJobApplicantsQuery, useJobQuery } from "../../api/hooks/useJobs";
import { useUpdateApplicationStatus } from "../../api/hooks/useApplications";
import { ApplicantDto } from "../../api/endpoints/jobs";
import {
  PIPELINE_STATUS_OPTIONS,
  APPLICATION_STATUSES,
  APPLICATION_STATUS_SEVERITY,
  ApplicationStatus,
} from "../../constants/applicationStatus";
import PublicHeader from "../../components/PublicHeader";

export default function JobApplicantsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: jobData, isLoading: jobLoading } = useJobQuery(id!);
  const { data: applicantsData, isLoading: applicantsLoading } =
    useJobApplicantsQuery(id!);
  const { mutate: updateStatus } = useUpdateApplicationStatus();

  const applicants = applicantsData?.items || [];
  const isLoading = jobLoading || applicantsLoading;

  // Map questionId → label from the job's screening questions
  const questionLabelMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    jobData?.screeningQuestions?.forEach((q) => {
      map[q.id] = q.label;
    });
    return map;
  }, [jobData]);

  useEffect(() => {
    if (jobData?.title) {
      document.title = `Applicants: ${jobData.title} | NexHire`;
    } else {
      document.title = `Applicants | NexHire`;
    }
  }, [jobData]);

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    updateStatus({ id: applicationId, status: newStatus });
  };

  const statusBodyTemplate = (row: ApplicantDto) => {
    if (row.status === "Withdrawn") {
      return (
        <Tag
          value="Withdrawn"
          severity="secondary"
          className="px-3 py-1 font-bold text-xs"
        />
      );
    }

    return (
      <Dropdown
        value={row.status}
        options={PIPELINE_STATUS_OPTIONS}
        onChange={(e) => handleStatusChange(row.applicationId, e.value)}
        className="w-full md:w-[12rem] !border-slate-200 !rounded-xl !shadow-none focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100"
      />
    );
  };

  const answersBodyTemplate = (row: ApplicantDto) => {
    if (!row.answers || row.answers.length === 0)
      return <span className="text-slate-400 italic text-sm">No answers</span>;
    return (
      <div className="flex flex-col gap-2 py-2">
        {row.answers.map((ans, idx) => {
          const label =
            questionLabelMap[ans.questionId] || `Question ${idx + 1}`;
          return (
            <div
              key={ans.questionId || idx}
              className="flex flex-col gap-0.5 text-sm"
            >
              <span className="font-semibold text-slate-600 text-xs">
                {label}
              </span>
              <span className="text-slate-800">
                {ans.value || <em className="text-slate-400">No answer</em>}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const resumeBodyTemplate = (row: ApplicantDto) => {
    if (!row.resumeUrl) return <span className="text-slate-400">N/A</span>;
    return (
      <a
        href={row.resumeUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 text-blue-600 font-medium hover:underline p-2 rounded-lg hover:bg-blue-50 transition-colors inline-flex"
      >
        <i className="pi pi-file-pdf"></i>
        <span>View</span>
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans pb-32">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Link
              to="/recruiter"
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <i className="pi pi-arrow-left text-xs"></i> Dashboard
            </Link>
            <i className="pi pi-angle-right text-xs"></i>
            <span className="text-slate-800">Applicants</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
                Applicant Pipeline
                {!isLoading && (
                  <span className="bg-blue-100 text-blue-700 text-sm py-1 px-3 rounded-full">
                    {applicants.length} Total
                  </span>
                )}
              </h1>
              <p className="text-slate-500 font-medium">
                {jobLoading
                  ? "Loading job details..."
                  : `Managing candidates for ${
                      jobData?.title || "Unknown Job"
                    }`}
              </p>
            </div>

            <Link to={`/jobs/${id}`}>
              <Button
                label="View Public Posting"
                icon="pi pi-external-link"
                outlined
                className="!border-slate-300 !text-slate-700 hover:!bg-slate-50 !rounded-xl px-6 py-2.5 font-bold"
              />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm flex flex-col gap-4">
            <Skeleton width="200px" height="2rem" className="mb-4" />
            <Skeleton width="100%" height="4rem" />
            <Skeleton width="100%" height="4rem" />
            <Skeleton width="100%" height="4rem" />
          </div>
        ) : (
          <div className="bg-white border border-slate-200/60 rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] overflow-hidden">
            <TabView className="pt-2 px-2">
              <TabPanel header="Table View" leftIcon="pi pi-list mr-2">
                <div className="p-4">
                  <DataTable
                    value={applicants}
                    responsiveLayout="scroll"
                    emptyMessage="No applicants found for this job."
                    className="p-datatable-sm"
                    rowHover
                  >
                    <Column
                      field="applicantName"
                      header="Name"
                      sortable
                      className="font-bold text-slate-900"
                      style={{ minWidth: "150px" }}
                    ></Column>
                    <Column
                      field="profileSummary"
                      header="Profile Summary"
                      body={(r) => (
                        <div className="text-sm text-slate-500 line-clamp-2 max-w-xs">
                          {r.profileSummary || "No summary provided"}
                        </div>
                      )}
                    ></Column>
                    <Column
                      header="Screening Answers"
                      body={answersBodyTemplate}
                    ></Column>
                    <Column
                      field="resumeUrl"
                      header="Resume"
                      body={resumeBodyTemplate}
                      align="center"
                    ></Column>
                    <Column
                      header="Pipeline Stage"
                      body={statusBodyTemplate}
                      style={{ minWidth: "200px" }}
                    ></Column>
                  </DataTable>
                </div>
              </TabPanel>

              <TabPanel
                header="Kanban Board"
                leftIcon="pi pi-objects-column mr-2"
              >
                <div className="p-4 m-4 flex flex-col gap-4">
                  {/* Active pipeline stages — vertical flex list */}
                  {APPLICATION_STATUSES.map((status) => {
                    const statusObj = {
                      label: status,
                      value: status,
                      severity:
                        APPLICATION_STATUS_SEVERITY[
                          status as ApplicationStatus
                        ],
                    };
                    const columnApplicants = applicants.filter(
                      (a) => a.status === statusObj.value
                    );
                    const isWithdrawn = statusObj.value === "Withdrawn";
                    return (
                      <div
                        key={statusObj.value}
                        className={`rounded-2xl border p-5 ${
                          isWithdrawn
                            ? "border-slate-200/60 bg-slate-50/30 opacity-70"
                            : "border-slate-200/60 bg-slate-50/50"
                        }`}
                      >
                        {/* Stage header */}
                        <div className="flex items-center gap-3 mb-4">
                          <h3
                            className={`font-bold text-sm uppercase tracking-wider ${
                              isWithdrawn ? "text-slate-400" : "text-slate-700"
                            }`}
                          >
                            {statusObj.label}
                          </h3>
                          <span className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            {columnApplicants.length}
                          </span>
                        </div>

                        {/* Candidate cards — horizontal flex wrap */}
                        {columnApplicants.length === 0 ? (
                          <div className="text-sm text-slate-400 italic pl-1">
                            No candidates at this stage.
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-4">
                            {columnApplicants.map((app) => (
                              <div
                                key={app.applicationId}
                                className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-2 w-full sm:w-72 group ${
                                  isWithdrawn
                                    ? "grayscale opacity-60"
                                    : "hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                                }`}
                              >
                                <div
                                  className={`font-bold ${
                                    isWithdrawn
                                      ? "text-slate-500 line-through"
                                      : "text-slate-900 group-hover:text-blue-600 transition-colors"
                                  }`}
                                >
                                  {app.applicantName}
                                </div>
                                <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                  {app.profileSummary ||
                                    "No summary available."}
                                </div>
                                {app.resumeUrl && !isWithdrawn && (
                                  <a
                                    href={app.resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold bg-blue-50 w-max px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                                  >
                                    <i className="pi pi-file-pdf"></i> Resume
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </TabPanel>
            </TabView>
          </div>
        )}
      </main>
    </div>
  );
}
