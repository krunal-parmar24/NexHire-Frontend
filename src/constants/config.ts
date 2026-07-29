/** Frontend environment / configuration constants.
 * VITE_API_BASE_URL must be set in .env; the fallback is development-only. */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:60719";

/** Named constant for the file-upload screening-question API endpoint. */
export const SCREENING_FILE_UPLOAD_URL = "/api/upload";
