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
    const message =
      err instanceof Error && err.message
        ? err.message
        : "Invalid email or password.";
    return {
      error: message.includes("credentials") || message.includes("Invalid")
        ? "Invalid email or password."
        : "Cannot reach database. Check DATABASE_URL / MongoDB Atlas.",
    };
  }

  redirect("/");
}

export async function logoutAction() {
  await clearAuthCookies();
  redirect("/login");
}
