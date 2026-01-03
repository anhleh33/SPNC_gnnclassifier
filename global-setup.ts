import { FullConfig } from '@playwright/test';
import dotenv from 'dotenv';

async function globalSetup(config: FullConfig) {
    // 1. Read the environment variable passed from command line (e.g., 'test' or 'prod')
    // If not provided, default to 'test'
    const env = process.env.TEST_ENV || 'test';

    // 2. Load the matching .env file
    dotenv.config({
        path: `env/.env.${env}`,
        override: true
    });
    
    console.log(`Global Setup: Loaded environment variables from .env.${env}`);
}

export default globalSetup;