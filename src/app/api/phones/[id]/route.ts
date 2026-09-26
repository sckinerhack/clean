import { NextResponse } from 'next/server';
import { getPhoneByIdOrQuery, updatePhoneStatus, deletePhone } from '@/lib/db';
import { ApprovalStatus } from '@/types/phone';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const phone = await getPhoneByIdOrQuery(id);
    if (!phone) {
      return NextResponse.json({ success: false, error: 'Device not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, phone });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body as { status: ApprovalStatus };

    if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid approval status provided' },
        { status: 400 }
      );
    }

    const updatedPhone = await updatePhoneStatus(id, status);
    if (!updatedPhone) {
      return NextResponse.json({ success: false, error: 'Device not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, phone: updatedPhone });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deletePhone(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Device not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Device deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
