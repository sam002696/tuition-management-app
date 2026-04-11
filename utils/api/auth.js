import { API_BASE_URL } from "./base";

export const AUTH_API = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  CHANGE_PASSWORD: `${API_BASE_URL}/password/change`,
};
