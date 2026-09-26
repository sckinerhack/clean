import { NextResponse } from 'next/server';
import { getPhoneByIdOrQuery } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || !q.trim()) {
      return NextResponse.json(
        { success: false, error: 'Query parameter q (IMEI or Serial Number) is required' },
        { status: 400 }
      );
    }

    const phone = await getPhoneByIdOrQuery(q.trim());
    if (!phone) {
      return NextResponse.json(
        { success: false, error: `No device matching IMEI or Serial Number "${q}" found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, phone });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Search failed' },
      { status: 500 }
    );
  }
}
