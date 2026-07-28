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
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans pb-32">
      <Toast ref={toast} />
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              My{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Applications
              </span>
            </h1>
            <p className="mt-2 text-base text-slate-500 font-medium">
              Track and manage your submitted job applications.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/">
              <Button
                label="Explore Jobs"
                icon="pi pi-search"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-none shadow-lg hover:shadow-indigo-500/30 transition-all text-white font-bold text-base"
              />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-6">
            <Skeleton
              width="100%"
              height="10rem"
              className="rounded-3xl shadow-sm"
            />
            <Skeleton
              width="100%"
              height="10rem"
              className="rounded-3xl shadow-sm"
            />
          </div>
        ) : isError ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 text-center font-semibold">
            Failed to load applications. Please try again later.
          </div>
        ) : data?.items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-4xl mb-6 shadow-sm">
              <i className="pi pi-send"></i>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-4">
              No applications yet
            </h3>
            <p className="text-slate-500 max-w-md mb-8 text-lg font-medium">
              You haven&apos;t applied to any jobs yet. Start exploring
              opportunities to find your dream career!
            </p>
            <Link to="/">
              <Button
                label="Find Jobs"
                className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border-none shadow-md hover:shadow-lg transition-all text-white font-bold text-base"
              />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.items.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-extrabold text-slate-900 line-clamp-2">
                      <Link
                        to={`/jobs/${app.jobId}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {app.jobTitle}
                      </Link>
                    </h3>
                    <Tag
                      value={app.status}
                      severity={getStatusSeverity(app.status)}
                      className="rounded-lg px-4 py-1.5 font-bold text-sm shadow-sm ml-4 shrink-0"
                    />
                  </div>
                  <div className="text-slate-500 font-semibold mb-6 text-lg flex items-center gap-2">
                    <i className="pi pi-building text-slate-400"></i>
                    {app.companyName}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-slate-100">
                  <div className="text-sm text-slate-400 font-medium flex items-center gap-2">
                    <i className="pi pi-calendar"></i>
                    Applied {new Date(app.submittedAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto">
                    {(app.status === "Applied" ||
                      app.status === "Shortlisted" ||
                      app.status === "Interview") && (
                      <Button
                        label="Withdraw"
                        icon="pi pi-times"
                        onClick={() => handleWithdraw(app.id)}
                        disabled={withdrawMutation.isPending}
                        className="w-full sm:w-auto !bg-red-50 !text-red-600 !border-none hover:!bg-red-100 font-bold rounded-xl px-6 py-2.5 transition-colors"
                      />
                    )}
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        label="View Job"
                        className="w-full sm:w-auto !bg-slate-100 !text-slate-700 !border-none hover:!bg-slate-200 font-bold rounded-xl px-6 py-2.5 transition-colors"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
