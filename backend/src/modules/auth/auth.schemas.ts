import { z } from "zod";

export const CredentialsSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(8).max(128),
});

export type Credentials = z.infer<typeof CredentialsSchema>;

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.uuid(),
    email: z.email(),
  }),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
