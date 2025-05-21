
// import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import EmployeeStack from "@/components/employeeStack/employeeStack";
import { EmployeeTimeline } from "@/components/employeeTimeline/employeeTimeline";
import { getEmployeesSSR, getTimelineEntriesSSR } from "@/lib/dbHelpers";


export default async function Home() {
  const employeesSSR = await getEmployeesSSR();
  const timelineEntriesSSR = await getTimelineEntriesSSR(); // Fetch from DB/server
  return (
    <>
      {/* <Hero /> */}
      <main className="flex flex-col gap-20 max-w-5xl p-5">
        <EmployeeStack initialEmployees ={employeesSSR} />
        <EmployeeTimeline initialTimeline={timelineEntriesSSR}  />
      </main>
    </>
  );
}
