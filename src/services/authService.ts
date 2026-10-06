import { User, AuthResponse } from '../types/auth';

const TOKEN_KEY = 'tripgenie_auth_token_v1';
const USER_KEY = 'tripgenie_auth_user_v1';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: User): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to store auth session in localStorage:', err);
  }
}

export function clearStoredSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (err) {
    console.error('Failed to clear auth session:', err);
  }
}

export function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function registerUser(params: {
  fullName: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (res.ok && data.success && data.token && data.user) {
      setStoredSession(data.token, data.user);
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: 'Unable to connect to authentication server. Please check your network and try again.'
    };
  }
}

export async function loginUser(params: {
  email: string;
  password: string;
  autoRegisterIfMissing?: boolean;
  fullName?: string;
}): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (res.ok && data.success && data.token && data.user) {
      setStoredSession(data.token, data.user);
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: 'Unable to connect to authentication server. Please check your network and try again.'
    };
  }
}

export async function requestPasswordReset(email: string): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      error: 'Unable to send password reset instructions right now. Please try again.'
    };
  }
}

export async function verifyCurrentSession(): Promise<User | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      clearStoredSession();
      return null;
    }
    const data = await res.json();
    if (data.success && data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data.user;
    }
    clearStoredSession();
    return null;
  } catch (err) {
    // If offline/network failure, return cached stored user for seamless offline experience
    return getStoredUser();
  }
}
