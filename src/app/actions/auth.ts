"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clearAuthCookies, getPayloadTokenCookieName } from "@/lib/auth";
import { getPayloadClient } from "@/lib/payload";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const payload = await getPayloadClient();
    const result = await payload.login({
      collection: "users",
      data: { email, password },
    });

    if (!result.token) {
      return { error: "Login failed — no session token returned." };
    }

    const usersCollection = payload.config.collections.find((c) => c.slug === "users");
    const tokenExpiration =
      usersCollection && "auth" in usersCollection && usersCollection.auth
        ? usersCollection.auth.tokenExpiration
        : 60 * 60 * 24 * 7;

    const jar = await cookies();
    jar.set({
      name: getPayloadTokenCookieName(payload.config.cookiePrefix),
      value: result.token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenExpiration,
    });
  } catch (err) {
    const message = err instanceof Error && err.message ? err.message : "";
    if (message.includes("credentials") || message.includes("Invalid")) {
      return { error: "Invalid email or password." };
    }
    if (!process.env.DATABASE_URL) {
      return {
        error: "DATABASE_URL is missing on this deployment. Add it in Vercel, then redeploy.",
      };
    }
    console.error("Login database error:", message);
    return {
      error:
        "Cannot reach MongoDB Atlas. In Atlas open Network Access and allow 0.0.0.0/0, then redeploy.",
    };
  }

  redirect("/");
}

export async function logoutAction() {
  await clearAuthCookies();
  redirect("/login");
}
