import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_WS_BASE_URL: z
    .string()
    .regex(/^wss?:\/\//, "Must be ws:// or wss://"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_ENABLE_QUERY_DEVTOOLS: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_WS_BASE_URL: process.env.NEXT_PUBLIC_WS_BASE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_ENABLE_QUERY_DEVTOOLS: process.env.NEXT_PUBLIC_ENABLE_QUERY_DEVTOOLS,
});
