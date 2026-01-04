import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// --- 1. SETUP ENV VARS ---
dotenv.config({ path: path.resolve(__dirname, 'backend', '.env') });
const env = process.env.TEST_ENV || 'test';
dotenv.config({ path: path.resolve(__dirname, `env/.env.${env}`) });

// --- 2. INTELLIGENT PYTHON SELECTION (THE FIX) ---
const isCI = !!process.env.CI;
const isWin = process.platform === 'win32';

let pythonExecutable;

if (isCI) {
  // ☁️ IN CI: Use the global python command (where we just ran pip install)
  pythonExecutable = 'python';
} else {
  // 💻 LOCAL: Use your specific virtual environment path
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
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined, // Keep at 1 to avoid DB collisions
  reporter: [['html']],
  
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
  ],

  webServer: [
    {
      // 🐍 BACKEND
      command: `"${pythonExecutable}" -m backend.app`,
      port: 5000,
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