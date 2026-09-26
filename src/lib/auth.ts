import { cookies } from 'next/headers';

export const ADMIN_EMAIL = 'admin@clean.com';
export const ADMIN_PASSWORD = '!Admin666@';
export const AUTH_COOKIE_NAME = 'auth_session';

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return token === 'authenticated_admin_session';
}

export function verifyCredentials(email: string, pass: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && pass === ADMIN_PASSWORD;
}
