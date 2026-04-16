import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";
import { prisma } from "../../db/prisma.js";
import { requireHost } from "../../middleware/requireHost.js";
import { CredentialsSchema, SignupSchema, type AuthResponse } from "./auth.schemas.js";

const BCRYPT_ROUNDS = 12;

export const authRouter = Router();

authRouter.post("/signup", async (req, res, next) => {
  try {
    const { email, password, displayName } = SignupSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: "EmailAlreadyInUse" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: { email, passwordHash, displayName },
      select: { id: true, email: true, displayName: true },
    });

    const token = jwt.sign({ sub: user.id }, env.JWT_SECRET);
    const response: AuthResponse = { token, user };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = CredentialsSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "InvalidCredentials" });
      return;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ error: "InvalidCredentials" });
      return;
    }

    const token = jwt.sign({ sub: user.id }, env.JWT_SECRET);
    const response: AuthResponse = {
      token,
      user: { id: user.id, email: user.email, displayName: user.displayName },
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

authRouter.get("/me", requireHost, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
      select: { id: true, email: true, displayName: true, createdAt: true },
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});
