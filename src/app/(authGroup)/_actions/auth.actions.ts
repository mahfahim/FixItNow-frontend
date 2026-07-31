// src/app/(authGroup)/_actions/auth.actions.ts
'use server';

import { cookies } from "next/headers";
import { IRegisterUser, ILoginUser } from "@/types";


const BASE_URL = (
  process.env.BACKEND_API_URL || "https://fixitnow-backend-tau.vercel.app"
).replace(/\/$/, "");


export async function register(payload: IRegisterUser) {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in register action:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "User registration failed",
    };
  }
}





export async function login(payload: ILoginUser) {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();

    if (data?.success && data?.data) {
      const { accessToken, refreshToken } = data.data;
      const cookieStore = await cookies();

      // Store accessToken in secure HTTP-only cookie
      if (accessToken) {
        cookieStore.set("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });
      }

      // Store refreshToken in secure HTTP-only cookie
      if (refreshToken) {
        cookieStore.set("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });
      }
    }

    return data;
  } catch (error: unknown) {
    console.error("Error in login action:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "User login failed",
    };
  }
}




export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error: unknown) {
    console.error("Error in logout action:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Logout failed",
    };
  }
}