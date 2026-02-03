"use server";

import { registerUser } from "@/lib/ojs";

export async function registerUserAction(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const givenName = formData.get("givenName") as string;
  const familyName = formData.get("familyName") as string;

  if (!username || !email || !password || !givenName || !familyName) {
    return {
      success: false,
      error: "All fields are required",
    };
  }

  try {
    await registerUser({
      username,
      email,
      password,
      givenName,
      familyName,
    });

    return {
      success: true,
      message: "Registration successful!",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}
