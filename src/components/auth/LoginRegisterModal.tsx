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
      navigate("/onboarding");
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
      style={{ width: "90vw", maxWidth: "960px" }}
      className="border-0 rounded-3xl shadow-2xl overflow-hidden"
      contentClassName="!p-0 bg-white"
      maskClassName="bg-black/50 backdrop-blur-sm"
    >
      <div className="flex flex-col md:flex-row w-full max-h-[90vh] overflow-hidden">
        {/* Left Side: Branding Panel (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-[45%] !bg-gradient-to-br !from-[#2563EB] !to-[#4F46E5] p-12 flex-col justify-center items-center text-white relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-slate-900 opacity-20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center justify-center gap-12 w-full">
            <img
              src="/logo.png"
              alt="NexHire Logo"
              className="h-40 md:h-56 object-contain pointer-events-none transform transition-transform hover:scale-105 duration-500"
              style={{ filter: "brightness(0) invert(1)" }}
            />

            <div className="text-center w-full">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow-sm">
                Your next career <br /> move starts here.
              </h2>
              <p className="text-indigo-100/90 text-lg leading-relaxed max-w-sm mx-auto">
                Join the AI-powered platform connecting top talent with
                industry-leading recruiters instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms (Scrollable container) */}
        <div className="w-full md:w-[55%] flex flex-col bg-white overflow-y-auto">
          {/* Header Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/50 sticky top-0 z-20 shrink-0">
            <button
              className={classNames(
                "flex-1 py-5 text-center font-bold text-sm tracking-widest uppercase transition-colors outline-none border-b-2",
                tab === "login"
                  ? "text-[#4F46E5] border-[#4F46E5] bg-white shadow-[inset_0_-2px_0_0_#4F46E5]"
                  : "text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50/80"
              )}
              onClick={() => {
                setTab("login");
                setError(null);
              }}
            >
              Login
            </button>
            <button
              className={classNames(
                "flex-1 py-5 text-center font-bold text-sm tracking-widest uppercase transition-colors outline-none border-b-2",
                tab === "register"
                  ? "text-[#4F46E5] border-[#4F46E5] bg-white shadow-[inset_0_-2px_0_0_#4F46E5]"
                  : "text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50/80"
              )}
              onClick={() => {
                setTab("register");
                setError(null);
              }}
            >
              Register
            </button>
          </div>

          <div className="p-8 md:p-12 pb-16">
            <div className="text-center mb-10">
              {/* Logo for mobile only */}
              <div className="md:hidden flex justify-center mb-6 pointer-events-none">
                <img
                  src="/logo.png"
                  alt="NexHire Logo"
                  className="h-36 object-contain -mt-4 -mb-4"
                />
              </div>
              <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                {tab === "login" ? "Welcome back" : "Create an account"}
              </h2>
              <p className="text-gray-500 mt-3 text-sm font-medium">
                {tab === "login"
                  ? "Enter your details to access your dashboard."
                  : "Join NexHire to find your next opportunity."}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-8 flex items-start gap-3 border border-red-100 shadow-sm">
                <i className="pi pi-exclamation-circle mt-0.5 text-red-500"></i>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {tab === "register" && (
              <form onSubmit={handleRegister} className="flex flex-col gap-6">
                <RoleSelectionCards
                  selectedRole={selectedRole}
                  onSelect={setSelectedRole}
                />

                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-sm font-bold text-gray-700">
                    Email Address
                  </label>
                  <InputText
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    placeholder="you@example.com"
                    className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm bg-gray-50/50 hover:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">
                    Password
                  </label>
                  <Password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    toggleMask
                    feedback
                    placeholder="Create a strong password"
                    inputClassName="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm bg-gray-50/50 hover:bg-white"
                    className="w-full [&>div]:w-full"
                  />
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <Checkbox
                    inputId="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.checked || false)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 cursor-pointer leading-tight font-medium"
                  >
                    I accept the{" "}
                    <a
                      href="#"
                      className="text-[#4F46E5] hover:text-[#3730A3] font-semibold hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    &{" "}
                    <a
                      href="#"
                      className="text-[#4F46E5] hover:text-[#3730A3] font-semibold hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <Button
                  type="submit"
                  label="Create Account"
                  loading={loading}
                  className="w-full !bg-gradient-to-r !from-[#2563EB] !to-[#4F46E5] hover:!from-blue-700 hover:!to-indigo-700 text-white !border-none py-4 text-base font-bold mt-2 rounded-xl shadow-lg shadow-indigo-200 transition-transform active:scale-[0.98]"
                />
              </form>
            )}

            {tab === "login" && (
              <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">
                    Email Address
                  </label>
                  <InputText
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    placeholder="you@example.com"
                    className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm bg-gray-50/50 hover:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">
                    Password
                  </label>
                  <Password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    toggleMask
                    feedback={false}
                    placeholder="Enter your password"
                    inputClassName="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm bg-gray-50/50 hover:bg-white"
                    className="w-full [&>div]:w-full"
                  />
                </div>

                <Button
                  type="submit"
                  label="Sign In"
                  loading={loading}
                  className="w-full !bg-gradient-to-r !from-[#2563EB] !to-[#4F46E5] hover:!from-blue-700 hover:!to-indigo-700 text-white !border-none py-4 text-base font-bold mt-2 rounded-xl shadow-lg shadow-indigo-200 transition-transform active:scale-[0.98]"
                />

                <div className="relative flex items-center my-8">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    Or continue with demo
                  </span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    type="button"
                    onClick={() => handleQuickDemo("JobSeeker")}
                    label="Demo Job Seeker"
                    icon="pi pi-briefcase"
                    outlined
                    className="w-full !text-gray-700 !bg-white !border-gray-300 hover:!bg-gray-50 py-3.5 rounded-xl font-bold transition-colors shadow-sm"
                  />
                  <Button
                    type="button"
                    onClick={() => handleQuickDemo("Recruiter")}
                    label="Demo Recruiter"
                    icon="pi pi-users"
                    outlined
                    className="w-full !text-gray-700 !bg-white !border-gray-300 hover:!bg-gray-50 py-3.5 rounded-xl font-bold transition-colors shadow-sm"
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
