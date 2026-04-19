/**
 * Preload environment variables before any other imports.
 * This ensures that Prisma can read DATABASE_URL when it is imported.
 */
import * as dotenv from 'dotenv';

// Load environment variables from the correct .env file based on NODE_ENV
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
