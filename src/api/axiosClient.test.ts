import { describe, expect, it } from "vitest";
import api from "./axiosClient";

describe("axiosClient", () => {
  it("defaults to localhost:60719 when VITE_API_BASE_URL is not set", () => {
    expect(api.defaults.baseURL).toBe("http://localhost:60719");
  });

  it("sends JSON content-type by default", () => {
    expect(api.defaults.headers["Content-Type"]).toBe("application/json");
  });
});
