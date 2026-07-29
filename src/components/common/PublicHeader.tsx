import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "primereact/button";
import LoginRegisterModal from "../auth/LoginRegisterModal";

export default function PublicHeader() {
  const { accessToken, role, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (role === "JobSeeker") {
      navigate("/seeker/applications");
    } else {
      navigate("/recruiter");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 flex items-center justify-between shadow-sm relative overflow-hidden">
      {/* Left: Logo */}
      <Link
        to="/"
        className="flex items-center no-underline group h-10 translate-y-1 md:translate-y-1.5"
      >
        <img
          src="/logo.png"
          alt="NexHire Logo"
          className="h-10 object-contain scale-[3] origin-left group-hover:scale-[3.05] transition-transform"
        />
      </Link>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 z-10">
        {accessToken ? (
          <>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              {role === "JobSeeker" ? "Job Seeker" : "Recruiter"}
            </span>

            {role === "Recruiter" && (
              <Button
                onClick={() => navigate("/recruiter/jobs/new")}
                label="Post a Job"
                icon="pi pi-plus"
                className="p-button-sm !bg-indigo-600 hover:!bg-indigo-700 !border-none text-white rounded-xl font-bold shadow-md shadow-indigo-600/20"
              />
            )}

            <Button
              onClick={handleDashboardRedirect}
              label="Dashboard"
              icon="pi pi-th-large"
              className="p-button-sm !bg-blue-600 hover:!bg-blue-700 !border-none text-white rounded-xl font-bold shadow-md shadow-blue-600/20"
            />

            <Button
              onClick={logout}
              label="Logout"
              icon="pi pi-sign-out"
              outlined
              className="p-button-sm !border-slate-200 hover:!bg-slate-50 !text-slate-700 rounded-xl font-bold"
            />
          </>
        ) : (
          <>
            <Button
              onClick={() => setTabAndShow()}
              label="Sign In"
              text
              className="p-button-sm !text-slate-700 hover:!bg-slate-100 font-bold rounded-xl px-4"
            />
            <Button
              onClick={() => setTabAndShow()}
              label="Register"
              className="p-button-sm !bg-blue-600 hover:!bg-blue-700 !border-none text-white rounded-xl font-bold shadow-md shadow-blue-600/20 px-5"
            />
          </>
        )}
      </div>

      <LoginRegisterModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
      />
    </header>
  );

  function setTabAndShow() {
    setModalVisible(true);
    // Note: Tab choice is handled inside the modal state, but we can pass props or let user toggle inside
  }
}
