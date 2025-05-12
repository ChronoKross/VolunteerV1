'use client'

import { useTheme } from 'next-themes'
import { useQueue } from '@/hooks/useQueue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'



export default function EmployeeStack() {
  const employees = useQueue()
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

function calculateSessionMinutes(): number {
  const now = new Date();

  // Get today's 7pm
  const shiftStart = new Date(now);
  shiftStart.setHours(19, 0, 0, 0);

  // Get tomorrow's 7am
  const shiftEnd = new Date(shiftStart);
  shiftEnd.setDate(shiftEnd.getDate() + 1);
  shiftEnd.setHours(7, 0, 0, 0);

  // If now is between 7pm and midnight
  if (now >= shiftStart && now < shiftEnd) {
    return Math.floor((shiftEnd.getTime() - now.getTime()) / 60000);
  }

  // If now is between midnight and 7am (same shift, but after midnight)
  const prevShiftStart = new Date(shiftStart);
  prevShiftStart.setDate(prevShiftStart.getDate() - 1); // yesterday 7pm
  const prevShiftEnd = new Date(prevShiftStart);
  prevShiftEnd.setDate(prevShiftEnd.getDate() + 1);
  prevShiftEnd.setHours(7, 0, 0, 0);

  const midnight = new Date(prevShiftEnd);
  midnight.setHours(0, 0, 0, 0);
  if (now >= midnight && now < prevShiftEnd) {
    return Math.floor((prevShiftEnd.getTime() - now.getTime()) / 60000);
  }

  // Not in shift window
  return 0;
}
  const getColorSaturation = (hours: number) => {
    const percentage = Math.min(hours / 50, 1) * 100
    return percentage
  }

  const volunteer = async (userId: string, sessionMinutes:number) => {
  try {
    const res = await fetch('/api/employee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'volunteer',
        userId,
        sessionMinutes,
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Unknown error');

    console.log('✅ Volunteer success:', data);
  } catch (err) {
    console.error('❌ Volunteer failed:', err);
    // You could throw in a toast or visual indicator here
  }
  };
  
  useEffect(() => {
    setMounted(true)
  }, [])
 


  return (
    <div className="dark:from-slate-900 dark:via-blue-950 dark:to-violet-950">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Employee Volunteer Stack</h1>
          <ThemeSwitcher />
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {employees.map((employee, index) => {
              const saturation = getColorSaturation(employee.totalVolunteeredHours)

              return (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    delay: index * 0.05,
                  }}
                  layout
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    onClick={() => {
                      const sessionMinutes = calculateSessionMinutes()
                      if (sessionMinutes <= 0) {
                        alert("You cannot clock out before 7pm or after 7am!");
                        return;
                      }
                      volunteer(employee.id, sessionMinutes);
                    }}
                    className="w-full flex items-center justify-between p-4 h-auto text-left bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={employee.profile_pic || "/placeholder.svg"} alt={employee.name} />
                        <AvatarFallback>{employee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">{employee.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{employee.job_title}</p>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-1 px-2 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          theme === "dark"
                            ? `hsla(250, ${saturation}%, 30%, 0.8)`
                            : `hsla(210, ${saturation}%, 85%, 0.8)`,
                        color:
                          theme === "dark"
                            ? `hsl(250, ${Math.max(saturation, 60)}%, ${Math.min(70, 50 + saturation / 2)}%)`
                            : `hsl(210, ${Math.max(saturation, 60)}%, ${Math.max(30, 50 - saturation / 2)}%)`,
                        borderColor:
                          theme === "dark"
                            ? `hsla(250, ${saturation}%, 40%, 0.8)`
                            : `hsla(210, ${saturation}%, 70%, 0.8)`,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{employee.totalVolunteeredHours} hrs</span>
                    </div>
                  </Button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
