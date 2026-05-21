import z from "zod";

export const appConfigSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PASSWORD: z.string().optional(),
});

export type AppConfig = z.infer<typeof appConfigSchema>;