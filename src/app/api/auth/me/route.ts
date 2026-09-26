import { NextResponse } from 'next/server';
import { isAuthenticated, ADMIN_EMAIL } from '@/lib/auth';

export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      return NextResponse.json({
        authenticated: true,
        user: { email: ADMIN_EMAIL, role: 'Admin' },
      });
    }
    return NextResponse.json({ authenticated: false, user: null });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error?.message }, { status: 500 });
  }
}
