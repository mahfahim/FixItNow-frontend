// // src/app/(dashboardGroup)/customer/_actions/customer-getme.ts

// "use server";

// import { revalidateTag } from "next/cache";
// import { IUser, IUpdateUserProfile } from "@/types";

// const API_URL = process.env.BACKEND_API_URL as string;

// export interface ActionResponse<T> {
//   success: boolean;
//   message?: string;
//   data?: T;
//   error?: string;
// }




// export async function getMe(
//   token?: string
// ): Promise<ActionResponse<IUser>> {
//   try {
//     const res = await fetch(`${API_URL}/api/auth/me`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "User-Agent": "FixItNow-Frontend/1.0",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       next: {
//         revalidate: 60,
//         tags: ["user-profile"],
//       },
//     });

//     const result = await res.json().catch(() => ({}));

//     if (!res.ok) {
//       throw new Error(result.message || "Failed to fetch user profile");
//     }

//     return {
//       success: true,
//       message: result.message || "User profile retrieved successfully",
//       data: result.data,
//     };
//   } catch (error) {
//     const message =
//       error instanceof Error ? error.message : "Error fetching user profile.";
//     console.error("getMe error:", message);
//     return { success: false, error: message };
//   }
// }





// export async function updateMe(
//   payload: IUpdateUserProfile,
//   token?: string
// ): Promise<ActionResponse<IUser>> {
//   try {
//     const res = await fetch(`${API_URL}/api/auth/me`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         "User-Agent": "FixItNow-Frontend/1.0",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       body: JSON.stringify(payload),
//     });

//     const result = await res.json().catch(() => ({}));

//     if (!res.ok) {
//       throw new Error(result.message || "Failed to update user profile");
//     }

//     revalidateTag("user-profile", "max");

//     return {
//       success: true,
//       message: result.message || "User profile updated successfully",
//       data: result.data,
//     };
//   } catch (error) {
//     const message =
//       error instanceof Error ? error.message : "Error updating user profile.";
//     console.error("updateMe error:", message);
//     return { success: false, error: message };
//   }
// }