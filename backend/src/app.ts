import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { ZodError } from "zod";

import { env } from "./config/env.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { sessionRouter } from "./modules/session/session.routes.js";

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/sessions", sessionRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "ValidationError", issues: err.issues });
    return;
  }
  if (err instanceof Error && "statusCode" in err) {
    const statusCode = (err as Error & { statusCode: number }).statusCode;
    if (statusCode < 500) {
      res.status(statusCode).json({ error: err.name, message: err.message });
      return;
    }
  }
  console.error(err);
  res.status(500).json({ error: "InternalServerError" });
});

export { app };
