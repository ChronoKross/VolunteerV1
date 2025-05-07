import { Database } from "@/types/supabase";



export async function volunteerEmployee(client:any, userId: string, sessionMinutes: number) {
  

  // Get the current max position
  const { data: maxData, error: maxErr } = await client
    .from('employees')
    .select('position')
    .order('position', { ascending: false })
    .limit(1)
    .single()

  if (maxErr) throw new Error('Failed to fetch max position')

  const maxPosition = maxData?.position ?? 0

  // Move user to the back of the queue
  const { data: updateData, error: updateErr } = await client
    .from('employees')
    .update({ position: maxPosition + 1 })
    .eq('id', userId)
    .select()

  if (updateErr) throw new Error('Failed to update employee position')
  if (!updateData || updateData.length === 0) {
    throw new Error('Not authorized to volunteer (RLS policy blocked)');
  }

   const { error: timelineErr } = await client
    .from('timeline')
    .insert([
      {
        id: crypto.randomUUID(),
        employee_id: userId,
        action_type: "volunteer", // must match your enum
        created_at: new Date().toISOString(),
        volunteer_minutes: sessionMinutes, // pass this in
        shift_hours: sessionMinutes / 60,
        notes: "Volunteered via queue",
      } as Database["public"]["Tables"]["timeline"]["Insert"]
    ]);
  console.log("Timeline insert error:", timelineErr);  
  

  return { newPosition: maxPosition + 1 }
}


// Fetch all employees
export async function getEmployees(client:any) {
  
  console.log('Fetching all employees...');

  const { data, error } = await client
    .from('employees') // Correct schema and table name
    .select('*'); // Fetch all columns

  if (error) {
    console.error('Error fetching employees:', error);
    throw new Error(error.message || 'Failed to fetch employees');
  }

  console.log('Employees fetched successfully:', data);
  return data;
}

// Fetch a single employee by ID
export async function getEmployeeById(client:any, id: string) {
  
  console.log(`Fetching employee with ID: ${id}`);

  const { data, error } = await client
    .from('employees') // Correct schema and table name
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching employee by ID:', error);
    throw new Error(error.message || 'Failed to fetch employee by ID');
  }

  console.log('Employee fetched successfully:', data);
  return data;
}

// Fetch all shifts for a specific employee
// export async function getShiftsByEmployeeId(employeeId: number) {
  
//   console.log(`Fetching shifts for employee ID: ${employeeId}`);

//   const { data, error } = await client
//     .from('employees') // Correct schema and table name
//     .select('shift, start_time, end_time') // Fetch only shift-related columns
//     .eq('id', employeeId);

//   if (error) {
//     console.error('Error fetching shifts:', error);
//     throw new Error(error.message || 'Failed to fetch shifts');
//   }

//   console.log('Shifts fetched successfully:', data);
//   return data || [];
// }

// Add a new shift for an employee
// export async function addShift(employeeId: number, shift: string, start_time: string, end_time: string) {
  
//   console.log('Attempting to add shift:', { employeeId, shift, start_time, end_time });

//   const { data, error } = await client
//     .from('employees') // Correct schema and table name
//     .update({ shift, start_time, end_time }) // Update shift-related columns
//     .eq('id', employeeId);

//   if (error) {
//     console.error('Supabase Error in addShift:', error);
//     throw new Error(error.message || 'Failed to add shift');
//   }

//   console.log('Shift added successfully:', data);
//   return data;
// }

//  Fetch all shifts
// export async function getAllShifts() {
  
//   console.log('Fetching all shifts...');

//   const { data, error } = await client
//     .from('employees') // Correct schema and table name
//     .select('id, username, shift, start_time, end_time'); // Fetch shift-related columns

//   if (error) {
//     console.error('Error fetching shifts:', error);
//     throw new Error(error.message || 'Failed to fetch shifts');
//   }

//   console.log('Shifts fetched successfully:', data);
//   return data;
// }