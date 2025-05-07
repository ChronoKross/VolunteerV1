import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const { employeeId, hours, date } = await request.json();
  if (!employeeId || typeof hours !== "number" || !date) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  const supabase = await createClient();

  // Update employee's totalVolunteeredHours
  const { data: emp, error: empErr } = await supabase
    .from("employees")
    .select("totalVolunteeredHours")
    .eq("id", employeeId)
    .single();

  if (empErr || !emp) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const newTotal = (emp.totalVolunteeredHours || 0) + hours;

  const { error: updateErr } = await supabase
    .from("employees")
    .update({ totalVolunteeredHours: newTotal })
    .eq("id", employeeId);

  if (updateErr) {
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }

  // Insert into timeline table (if exists)
  await supabase.from("timeline").insert([
    {
      employee_id: employeeId,
      action_type: "volunteer",
      created_at: date,
      volunteer_minutes: hours * 60,
    },
  ]);

  return NextResponse.json({ success: true, totalVolunteeredHours: newTotal });
}
