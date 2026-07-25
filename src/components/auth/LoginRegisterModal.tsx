import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RoleSelectionCards from "./RoleSelectionCards";
import api from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { classNames } from "primereact/utils";

interface Props {
  visible: boolean;
  onHide: () => void;
}

export default function LoginRegisterModal({
  visible = true,
  onHide = () => {},
}: Props) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<"JobSeeker" | "Recruiter">(
    "JobSeeker"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { setTokens } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = (role: string, onboardingCompleted: boolean) => {
    onHide();
    if (!onboardingCompleted) {
      navigate("/auth/onboarding");
      return;
    }
    if (role === "JobSeeker") {
      navigate("/seeker/applications");
    } else {
      navigate("/recruiter");
    }
  };

  const handleQuickDemo = async (role: "JobSeeker" | "Recruiter") => {
    try {
      setLoading(true);
      setError(null);
      const demoEmail =
        role === "JobSeeker"
          ? "demo.seeker@example.com"
          : "demo.recruiter@example.com";
      const res = await api.post("/api/auth/login", {
        email: demoEmail,
        password: "Password123!",
      });
      const data = res.data;
      setTokens(
        data.accessToken,
        data.refreshToken,
        data.role,
        data.onboardingCompleted
      );
      handleSuccess(data.role, data.onboardingCompleted);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error?.message ||
            (typeof err.response?.data?.error === "string"
              ? err.response.data.error
              : null) ||
            err.message ||
            "Demo login failed."
        );
      } else {
        setError("Demo login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError("You must accept the terms and privacy policy.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await api.post("/api/auth/register", {
        email,
        password,
        role: selectedRole,
        acceptedTerms,
      });
      const res = await api.post("/api/auth/login", { email, password });
      const data = res.data;
      setTokens(
        data.accessToken,
        data.refreshToken,
        data.role,
        data.onboardingCompleted
      );
      handleSuccess(data.role, data.onboardingCompleted);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error?.message ||
            (typeof err.response?.data?.error === "string"
              ? err.response.data.error
              : null) ||
            err.message ||
            "Registration failed. Please check your inputs."
        );
      } else {
        setError("Registration failed. Please check your inputs.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/api/auth/login", { email, password });
      const data = res.data;
      setTokens(
        data.accessToken,
        data.refreshToken,
        data.role,
        data.onboardingCompleted
      );
      handleSuccess(data.role, data.onboardingCompleted);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error?.message ||
            (typeof err.response?.data?.error === "string"
              ? err.response.data.error
              : null) ||
            err.message ||
            "Login failed. Invalid credentials."
        );
      } else {
        setError("Login failed. Invalid credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      showHeader={false}
      style={{ width: "90vw", maxWidth: "480px" }}
      className="border-0 rounded-2xl shadow-2xl overflow-hidden"
      contentClassName="p-0 bg-white"
      maskClassName="bg-black/40 backdrop-blur-sm"
    >
      <div className="flex flex-col w-full">
        {/* Header Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button
            className={classNames(
              "flex-1 py-4 text-center font-semibold text-sm tracking-wide transition-colors outline-none",
              tab === "login"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                : "text-gray-500 hover:text-gray-700"
            )}
            onClick={() => {
              setTab("login");
              setError(null);
            }}
          >
            LOGIN
          </button>
          <button
            className={classNames(
              "flex-1 py-4 text-center font-semibold text-sm tracking-wide transition-colors outline-none",
              tab === "register"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                : "text-gray-500 hover:text-gray-700"
            )}
            onClick={() => {
              setTab("register");
              setError(null);
            }}
          >
            REGISTER
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {tab === "login" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-gray-500 mt-3 text-sm">
              {tab === "login"
                ? "Enter your details to access your dashboard."
                : "Join NexHire to find your next opportunity."}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6 flex items-start gap-3 border border-red-100">
              <i className="pi pi-exclamation-circle mt-0.5 text-red-500"></i>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {tab === "register" && (
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <RoleSelectionCards
                selectedRole={selectedRole}
                onSelect={setSelectedRole}
              />

              <div className="flex flex-col gap-2 mt-4">
                <label className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <InputText
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="w-full p-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  toggleMask
                  feedback
                  placeholder="Create a strong password"
                  inputClassName="w-full p-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                  className="w-full [&>div]:w-full"
                />
              </div>

              <div className="flex items-center gap-3 mt-3">
                <Checkbox
                  inputId="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.checked || false)}
                  className="mt-0.5"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 cursor-pointer leading-tight"
                >
                  I accept the{" "}
                  <a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  &{" "}
                  <a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                label="Create Account"
                loading={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 border-none py-3.5 text-base font-semibold mt-4 rounded-xl shadow-md transition-transform active:scale-[0.98]"
              />
            </form>
          )}

          {tab === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <InputText
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="w-full p-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  toggleMask
                  feedback={false}
                  placeholder="Enter your password"
                  inputClassName="w-full p-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                  className="w-full [&>div]:w-full"
                />
              </div>

              <Button
                type="submit"
                label="Sign In"
                loading={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 border-none py-3.5 text-base font-semibold mt-4 rounded-xl shadow-md transition-transform active:scale-[0.98]"
              />

              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">
                  Or continue with demo
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  onClick={() => handleQuickDemo("JobSeeker")}
                  label="Demo Job Seeker"
                  icon="pi pi-briefcase"
                  outlined
                  className="w-full text-gray-700 border-gray-300 hover:bg-gray-50 py-3 rounded-xl font-semibold transition-colors"
                />
                <Button
                  type="button"
                  onClick={() => handleQuickDemo("Recruiter")}
                  label="Demo Recruiter"
                  icon="pi pi-users"
                  outlined
                  className="w-full text-gray-700 border-gray-300 hover:bg-gray-50 py-3 rounded-xl font-semibold transition-colors"
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </Dialog>
  );
}
