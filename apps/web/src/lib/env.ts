import { z } from "zod";

export const serverEnvSchema = z.object({
  BASE_URL: z.string().default("http://localhost:3000"),
  GOOGLE_CLIENT_ID: z.string().default("mock-google-client-id"),
  GOOGLE_CLIENT_SECRET: z.string().default("mock-google-client-secret"),
  SESSION_SECRET: z.string().default("super-secret-session-key-32-chars-min!"),
});

export const clientEnvSchema = z.object({
  BASE_URL: z.string().default("http://localhost:3000"),
});

export const clientEnv = clientEnvSchema.parse({
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
});

export const serverEnv = serverEnvSchema.parse({
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
  GOOGLE_CLIENT_SECRET:
    process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
  SESSION_SECRET:
    process.env.SESSION_SECRET || "super-secret-session-key-32-chars-min!",
});
