import React, { useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useMyApplications,
  useWithdrawApplication,
} from "../../api/hooks/useApplications";
import PublicHeader from "../../components/PublicHeader";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";

export default function MyApplicationsPage() {
  const { data, isLoading, isError } = useMyApplications();
  const withdrawMutation = useWithdrawApplication();
  const toast = useRef<Toast>(null);
  const toastShown = useRef(false);
  const location = useLocation();

  useEffect(() => {
    document.title = "My Applications | NexHire";

    // Show success toast if coming from apply page
    if (location.state?.applied && !toastShown.current) {
      toastShown.current = true;
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Application submitted successfully!",
        life: 5000,
      });
      // Clear state so it doesn't re-trigger on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleWithdraw = (id: string) => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      withdrawMutation.mutate(id, {
        onSuccess: () => {
          toast.current?.show({
            severity: "success",
            summary: "Withdrawn",
            detail: "Application has been withdrawn.",
            life: 3000,
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          const msg =
            err.response?.data?.error?.message ||
            "Failed to withdraw application";
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: msg,
            life: 5000,
          });
        },
      });
    }
  };

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case "Applied":
      case "Shortlisted":
      case "Interview":
        return "info";
      case "Hired":
        return "success";
      case "Rejected":
      case "Withdrawn":
        return "danger";
      default:
        return "info";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans pb-32">
      <Toast ref={toast} />
      <PublicHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            My Applications
          </h1>
          <p className="text-slate-600">
            Track and manage your submitted job applications.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton width="100%" height="8rem" className="rounded-2xl" />
            <Skeleton width="100%" height="8rem" className="rounded-2xl" />
          </div>
        ) : isError ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
            Failed to load applications. Please try again later.
          </div>
        ) : data?.items.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-200/60 p-20 text-center shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-3xl mb-6">
              <i className="pi pi-send"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              No applications yet
            </h3>
            <p className="text-slate-500 max-w-md mb-8 text-lg">
              You haven&apos;t applied to any jobs yet. Start exploring
              opportunities!
            </p>
            <Link to="/">
              <Button
                label="Find Jobs"
                className="!bg-slate-900 hover:!bg-slate-800 !border-none !text-white rounded-xl font-bold px-8 py-3"
              />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {data?.items.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-slate-200/60 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center hover:border-slate-300 transition-colors"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {app.jobTitle}
                    </Link>
                  </h3>
                  <div className="text-slate-600 font-medium mb-4">
                    {app.companyName}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <Tag
                      value={app.status}
                      severity={getStatusSeverity(app.status)}
                      className="rounded-lg px-3 py-1 font-bold text-xs"
                    />
                    <span className="text-slate-400">
                      Applied {new Date(app.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex gap-3 w-full sm:w-auto">
                  {(app.status === "Applied" ||
                    app.status === "Shortlisted" ||
                    app.status === "Interview") && (
                    <Button
                      label="Withdraw"
                      icon="pi pi-times"
                      onClick={() => handleWithdraw(app.id)}
                      disabled={withdrawMutation.isPending}
                      className="w-full sm:w-auto !bg-red-50 !text-red-600 !border-none hover:!bg-red-100 font-bold rounded-xl px-6 py-2.5"
                    />
                  )}
                  <Link to={`/jobs/${app.jobId}`} className="w-full sm:w-auto">
                    <Button
                      label="View Job"
                      outlined
                      className="w-full sm:w-auto !border-slate-200 !text-slate-700 hover:!bg-slate-50 hover:!border-slate-300 font-bold rounded-xl px-6 py-2.5"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
