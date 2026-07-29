import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { STORAGE_KEYS } from "../constants/storageKeys";

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
    const a = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const r = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const rr = localStorage.getItem(STORAGE_KEYS.ROLE);
    const o = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
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
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
    localStorage.setItem(STORAGE_KEYS.ROLE, roleVal);
    localStorage.setItem(
      STORAGE_KEYS.ONBOARDING_COMPLETED,
      onboarding ? "true" : "false"
    );
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setRole(null);
    setOnboardingCompleted(false);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
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
