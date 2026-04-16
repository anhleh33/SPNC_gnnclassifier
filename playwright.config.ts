import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import Enviroment from './utils/Enviroment';

dotenv.config({ path: path.resolve(__dirname, 'backend', '.env') });
const env = process.env.TEST_ENV || 'test';
dotenv.config({ path: path.resolve(__dirname, `env/.env.${env}`) });
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const isCI = !!process.env.CI;
const isWin = process.platform === 'win32';

let pythonExecutable;

if (isCI) {
  console.log("Running in CI mode: Using global 'python'");
  pythonExecutable = 'python';
} else {
  console.log("Running in Local mode: Using .venv");
  pythonExecutable = path.join(
    __dirname,
    'backend',
    '.venv',
    isWin ? 'Scripts' : 'bin',
    isWin ? 'python.exe' : 'python'
  );
}

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 3 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: Enviroment.BASE_URL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',

    viewport: { width: 1920, height: 1080 }, // Use standard desktop size
    actionTimeout: 15000, // Give CI more time to find elements
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: [
  //   {
  //     // 🐍 BACKEND
  //     command: `"${pythonExecutable}" -m backend.app`,
  //     port: 8000,
  //     timeout: 120 * 1000,
  //     reuseExistingServer: !process.env.CI,
  //     cwd: '.',
  //     env: {
  //       PYTHONPATH: process.cwd(),
  //       DATABASE_URL: process.env.DATABASE_URL || '',
  //     },
  //     stdout: 'pipe',
  //     stderr: 'pipe',
  //   },
  //   {
  //     // ⚛️ FRONTEND
  //     command: 'npm run dev',
  //     port: 3000,
  //     timeout: 120 * 1000,
  //     reuseExistingServer: !process.env.CI,
  //     cwd: '.',
  //     stdout: 'pipe',
  //     stderr: 'pipe',
  //   }
  // ],
});
