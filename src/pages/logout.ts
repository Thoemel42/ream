import type { APIRoute } from "astro";
import { sessionCookieName } from "../lib/auth";

export const GET: APIRoute = ({ cookies, redirect, url }) => {
  cookies.set(sessionCookieName(), "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: url.protocol === "https:",
    maxAge: 0,
  });

  return redirect("/login");
};
