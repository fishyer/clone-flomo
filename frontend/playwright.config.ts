import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 5177);
const backendPort = Number(process.env.E2E_BACKEND_PORT ?? 8010);
const baseURL = `http://127.0.0.1:${port}`;
const backendBaseURL = `http://127.0.0.1:${backendPort}`;
const backendURL = `${backendBaseURL}/health`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  use: {
    baseURL,
    trace: "on-first-retry"
  },
  webServer: [
    {
      command:
        `cd ../backend && python_cmd=python && if [ -x .venv/bin/python ]; then python_cmd=.venv/bin/python; fi && CLONE_FLOMO_DATABASE_URL='sqlite:///:memory:' "$python_cmd" -m uvicorn app.main:app --host 127.0.0.1 --port ${backendPort}`,
      url: backendURL,
      reuseExistingServer: !process.env.CI
    },
    {
      command: `VITE_API_TARGET=${backendBaseURL} npm run dev -- --host 127.0.0.1 --port ${port} --strictPort`,
      url: baseURL,
      reuseExistingServer: !process.env.CI
    }
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
