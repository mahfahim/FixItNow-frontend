// src/app/(authGroup)/_actions/auth.action.ts
'use server';

const BASE_URL = process.env.BACKEND_API_URL;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export async function loginUser(data: LoginPayload) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store', 
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.message || 'Login failed' };
    }

    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { success: false, error: errorMessage };
  }
}

export async function registerUser(data: RegisterPayload) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.message || 'Registration failed' };
    }

    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { success: false, error: errorMessage };
  }
}