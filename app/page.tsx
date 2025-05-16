import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import EmployeeStack from "@/components/employeeStack/employeeStack";
import {EmployeeTimeline} from "@/components/employeeTimeline/employeeTimeline";

export default async function Home() {
  return (
    <>
      {/* <Hero /> */}
      <main className="flex flex-col gap-20 max-w-5xl p-5">
        {/* <EmployeeStack />
        <EmployeeTimeline /> */}
      </main>
    </>
  );
}
