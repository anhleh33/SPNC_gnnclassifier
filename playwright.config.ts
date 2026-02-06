import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// --- 1. SETUP ENV VARS ---
dotenv.config({ path: path.resolve(__dirname, 'backend', '.env') });
const env = process.env.TEST_ENV || 'test';
dotenv.config({ path: path.resolve(__dirname, `env/.env.${env}`) });
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// --- 2. INTELLIGENT PYTHON SELECTION (THE FIX) ---
const isCI = !!process.env.CI;
const isWin = process.platform === 'win32';

let pythonExecutable;

if (isCI) {
  // ☁️ IN CI (GitHub Actions): Use the global python
  console.log("Running in CI mode: Using global 'python'");
  pythonExecutable = 'python'; 
} else {
  // 💻 LOCAL: Use your virtual environment
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
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // workers: process.env.CI ? 1 : undefined, // Keep at 1 to avoid DB collisions
  reporter: [['line'], ['html'], ['allure-playwright']],
  
  use: {
    trace: 'on-first-retry',
    baseURL: process.env.BASE_URL,
    screenshot: 'only-on-failure',
    video: 'on',
    launchOptions: {
      slowMo: 500,
    },
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

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

  webServer: [
    {
      // 🐍 BACKEND
      command: `"${pythonExecutable}" -m backend.app`,
      port: 8000,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
      cwd: '.',
      env: {
        PYTHONPATH: process.cwd(),
        DATABASE_URL: process.env.DATABASE_URL || '',
      },
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      // ⚛️ FRONTEND
      command: 'npm run dev',
      port: 3000,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
      cwd: '.', 
      stdout: 'pipe',
      stderr: 'pipe',
    }
  ],
});