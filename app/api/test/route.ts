import { NextResponse } from 'next/server';
import { getTest, postTest } from '@/lib/dbHelpers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    if (action === 'getTest') {
      const test = await getTest();
      return NextResponse.json(test);
    }

    // Fallback for invalid actions
    return NextResponse.json({ error: 'Invalid action or missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('Error in GET /api/test:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
   try {
      const body = await request.json();
      const { action, username } = body;
  
      if (action === 'postTest') {
        if (!username) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
  
        const newEmployee = await postTest(username); // Ensure this uses the "public.employees" table
        return NextResponse.json(newEmployee);
      }
  
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
      console.error('Error in POST /api/employee:', error);
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}