import z from "zod";

export const serverEnvSchema = z.object({
  BASE_URL: z.url(),
});
export const clientEnvSchema = z.object({
  BASE_URL: z.url(),
});

export const clientEnv = clientEnvSchema.parse({
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
});

export const serverEnv = serverEnvSchema.parse({
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",
});
