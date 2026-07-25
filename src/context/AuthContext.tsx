import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextValue {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  onboardingCompleted: boolean;
  setTokens: (
    access: string,
    refresh: string,
    role: string,
    onboardingCompleted: boolean
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    // hydrate from localStorage
    const a = localStorage.getItem("accessToken");
    const r = localStorage.getItem("refreshToken");
    const rr = localStorage.getItem("role");
    const o = localStorage.getItem("onboardingCompleted");
    if (a && r) {
      setAccessToken(a);
      setRefreshToken(r);
      setRole(rr);
      setOnboardingCompleted(o === "true");
    }
  }, []);

  const setTokens = (
    access: string,
    refresh: string,
    roleVal: string,
    onboarding: boolean
  ) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    setRole(roleVal);
    setOnboardingCompleted(onboarding);
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("role", roleVal);
    localStorage.setItem("onboardingCompleted", onboarding ? "true" : "false");
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setRole(null);
    setOnboardingCompleted(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("onboardingCompleted");
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        role,
        onboardingCompleted,
        setTokens,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
