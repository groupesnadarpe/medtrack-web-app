import { type ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { env } from "@/config/env";

export const authCookieName = "medtrack_access_token";
export const refreshCookieName = "medtrack_refresh_token";

const baseSessionCookie: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax",
  path: "/",
};

// Options uniques pour éviter les divergences entre login, logout et futurs refresh tokens.
export const sessionCookieOptions = {
  accessToken: {
    ...baseSessionCookie,
    maxAge: 60 * 60,
  },
  refreshToken: {
    ...baseSessionCookie,
    maxAge: 60 * 60 * 24 * 30,
  },
};