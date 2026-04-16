import { z } from "zod";

export const CredentialsSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(8).max(128),
});

export type Credentials = z.infer<typeof CredentialsSchema>;

export const SignupSchema = CredentialsSchema.extend({
  displayName: z.string().trim().min(2).max(40),
});

export type SignupPayload = z.infer<typeof SignupSchema>;

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.uuid(),
    email: z.email(),
    displayName: z.string().nullable(),
  }),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
