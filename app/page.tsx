"use client";

import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import EmployeeStack from "@/components/employeeStack/employeeStack";
import {EmployeeTimeline} from "@/components/employeeTimeline/employeeTimeline";

import { useState } from "react";
import { motion } from "framer-motion";

function VolunteerApp() {
    const [showTimeline, setShowTimeline] = useState(false);

    return (
        <div className="relative w-full h-screen bg-gray-900 overflow-hidden flex items-center justify-center">
            {/* Queue Component */}
            <motion.div
                animate={{
                    x: showTimeline ? "50%" : "0%",
                    rotate: showTimeline ? -5 : 0,
                    zIndex: showTimeline ? 0 : 2,
                    scale: showTimeline ? 0.95 : 1
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute w-[300px] h-[500px] bg-blue-800 rounded-lg shadow-lg border border-red-300"
            >
                <div className="flex items-center justify-center h-full text-white font-bold">
                    <EmployeeStack />
                </div>
            </motion.div>

            {/* Timeline Component */}
            <motion.div
                animate={{
                    x: showTimeline ? "0%" : "-50%",
                    rotate: showTimeline ? 5 : 0,
                    zIndex: showTimeline ? 2 : 0,
                    scale: showTimeline ? 1 : 0.95
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute w-[300px] h-[500px] bg-green-900 rounded-lg shadow-lg border border-orange-300"
            >
                <div className="flex items-center justify-center h-full text-white font-bold">
                    <EmployeeTimeline />
                </div>
            </motion.div>

            {/* Toggle Button */}
            <button
                className="absolute bottom-10 px-6 py-3 bg-yellow-500 text-black font-bold rounded"
                onClick={() => setShowTimeline(!showTimeline)}
            >
                Shuffle
            </button>
        </div>
    );
}

export default VolunteerApp;

