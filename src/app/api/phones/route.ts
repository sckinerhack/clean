import { NextResponse } from 'next/server';
import { getAllPhones, createPhone } from '@/lib/db';
import { PhoneInput } from '@/types/phone';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    let phones = await getAllPhones();

    if (statusFilter && statusFilter !== 'All') {
      phones = phones.filter(
        (p) => p.approval_status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return NextResponse.json({ success: true, phones });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch phones' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: PhoneInput = await request.json();

    if (!body.imei || !body.imei.trim()) {
      return NextResponse.json(
        { success: false, error: 'IMEI number is required' },
        { status: 400 }
      );
    }

    if (!body.serial_number || !body.serial_number.trim()) {
      return NextResponse.json(
        { success: false, error: 'Serial Number is required' },
        { status: 400 }
      );
    }

    const result = await createPhone(body);

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error }, { status: 409 });
    }

    return NextResponse.json({ success: true, phone: result.phone }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save phone device' },
      { status: 500 }
    );
  }
}
