import { config } from "dotenv";

config();

export const PORT: number = Number(process.env.PORT) || 4000;
export const MONGODB_URI: string = process.env.MONGODB_URI || "";
export const SESSION_SECRET: string = process.env.SESSION_SECRET || "";

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI! Set value in ".env"');
  console.error("Exiting...");
  process.exit(1);
}

if (!SESSION_SECRET) {
  console.error('Missing SESSION_SECRET! Set value in ".env"');
  console.error("Exiting...");
  process.exit(1);
}
