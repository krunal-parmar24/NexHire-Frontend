import api from "../axiosClient";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  onboardingCompleted: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
  acceptedTerms: boolean;
}

export const login = (data: LoginRequest): Promise<AuthResponse> =>
  api.post<AuthResponse>("/api/auth/login", data).then((r) => r.data);

export const register = (data: RegisterRequest): Promise<void> =>
  api.post("/api/auth/register", data).then(() => undefined);
