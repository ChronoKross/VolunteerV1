import { NextResponse } from 'next/server';
import { getEmployees, getEmployeeById, volunteerEmployee } from '@/lib/dbHelpers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const id = searchParams.get('id');

  try {
    if (action === 'getEmployees') {
      const employees = await getEmployees();
      return NextResponse.json(employees);
    }

    if (action === 'getEmployeeById' && id) {
      const employee = await getEmployeeById(id);
      return NextResponse.json(employee);
    }

    return NextResponse.json({ error: 'Invalid action or missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('Error in GET /api/employee:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId } = body;

    if (action === 'volunteer') {
      if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }

      const result = await volunteerEmployee(userId);
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in POST /api/employee:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
