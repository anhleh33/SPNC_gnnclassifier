import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// --- 1. SETUP ENV VARS ---
dotenv.config({ path: path.resolve(__dirname, 'backend', '.env') });
const env = process.env.TEST_ENV || 'test';
dotenv.config({ path: path.resolve(__dirname, `env/.env.${env}`) });

// --- 2. INTELLIGENT PYTHON SELECTION (THE FIX) ---
const isCI = !!process.env.CI; // Detect if running in GitHub Actions
const isWin = process.platform === 'win32';

// LOGIC:
// - If on GitHub Actions (CI) -> Use 'python' (Global system python)
// - If Local Windows -> Use 'backend/.venv/Scripts/python.exe'
// - If Local Mac/Linux -> Use 'backend/.venv/bin/python'
const pythonExecutable = isCI 
  ? 'python' 
  : path.join(__dirname, 'backend', '.venv', isWin ? 'Scripts' : 'bin', isWin ? 'python.exe' : 'python');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    // ['allure-playwright']
  ],
  use: {
    trace: 'on-first-retry',
    baseURL: process.env.BASE_URL,
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
      // We wrap the path in quotes to handle spaces in paths
      command: `"${pythonExecutable}" -m backend.app`,
      
      port: 5000,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
      cwd: '.',
      env: {
        PYTHONPATH: process.cwd(),
        // Note: Using the hardcoded URL from your YAML for consistency
        DATABASE_URL: process.env.DATABASE_URL || '',
      }
    },
    {
      // ⚛️ FRONTEND
      command: 'npm run dev',
      port: 3000,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
      cwd: '.', 
    }
  ],
});