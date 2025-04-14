import { NextResponse } from 'next/server';
import { getEmployees, getEmployeeById, addEmployee } from '@/lib/dbHelpers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const id = searchParams.get('id');

  try {
    if (action === 'getEmployees') {
      const employees = await getEmployees(); // Ensure this uses the "public.employees" table
      return NextResponse.json(employees);
    }

    if (action === 'getEmployeeById' && id) {
      const employee = await getEmployeeById(id); // Ensure this uses the "public.employees" table
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
    const { action, username } = body;

    if (action === 'addEmployee') {
      if (!username) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const newEmployee = await addEmployee(username); // Ensure this uses the "public.employees" table
      return NextResponse.json(newEmployee);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in POST /api/employee:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}