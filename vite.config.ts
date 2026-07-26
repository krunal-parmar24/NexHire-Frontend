import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    watch: {
      // Visual Studio's .vs folder holds locked index files on Windows
      // (e.g. .vs/*/FileContentIndex/*.vsidx) that trigger EBUSY errors
      // in Vite's fs watcher. Exclude it along with other non-source dirs.
      ignored: ["**/.vs/**", "**/node_modules/**", "**/dist/**"],
    },
  },
  test: {
    // Don't fail CI on days where no test files exist yet; real test
    // suites are added incrementally per the Implementation Plan.
    passWithNoTests: true,
  },
});
