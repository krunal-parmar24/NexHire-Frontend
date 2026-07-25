import React, { useState } from "react";
import RoleSelectionCards from "./RoleSelectionCards";
import api from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";

export default function LoginRegisterModal() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<"JobSeeker" | "Recruiter">(
    "JobSeeker"
  );
  const { setTokens } = useAuth();

  const handleQuickDemo = async (role: "JobSeeker" | "Recruiter") => {
    const email =
      role === "JobSeeker"
        ? "demo.seeker@example.com"
        : "demo.recruiter@example.com";
    const res = await api.post("/api/auth/login", {
      email,
      password: "Password123!",
    });
    const data = res.data;
    setTokens(
      data.accessToken,
      data.refreshToken,
      data.role,
      data.onboardingCompleted
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // minimal register flow for Day 1
    const form = new FormData(e.target as HTMLFormElement);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    await api.post("/api/auth/register", {
      email,
      password,
      role: selectedRole,
      acceptedTerms: true,
    });
    // after register, attempt login
    const res = await api.post("/api/auth/login", { email, password });
    const data = res.data;
    setTokens(
      data.accessToken,
      data.refreshToken,
      data.role,
      data.onboardingCompleted
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <div>
        <button onClick={() => setTab("login")}>Login</button>
        <button onClick={() => setTab("register")}>Register</button>
      </div>

      {tab === "register" && (
        <form onSubmit={handleRegister}>
          <RoleSelectionCards onSelect={(r) => setSelectedRole(r)} />
          <div>
            <label>
              Email
              <input name="email" type="email" required />
            </label>
          </div>
          <div>
            <label>
              Password
              <input name="password" type="password" required />
            </label>
          </div>
          <div>
            <label>
              <input name="acceptedTerms" type="checkbox" required /> I accept
              Terms &amp; Privacy
            </label>
          </div>
          <button type="submit">Register</button>
        </form>
      )}

      {tab === "login" && (
        <div>
          <button onClick={() => handleQuickDemo("JobSeeker")}>
            Quick Demo Login (Seeker)
          </button>
          <button onClick={() => handleQuickDemo("Recruiter")}>
            Quick Demo Login (Recruiter)
          </button>
        </div>
      )}
    </div>
  );
}
