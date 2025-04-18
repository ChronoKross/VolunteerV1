'use client'

import { useTheme } from 'next-themes'
import { useQueue } from '@/hooks/useQueue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { motion, AnimatePresence } from 'framer-motion'

export default function EmployeeStack() {
  const employees = useQueue()
  const { theme } = useTheme()

  const getColorSaturation = (hours: number) => {
    const percentage = Math.min(hours / 50, 1) * 100
    return percentage
  }

  const volunteer = async (userId: string) => {
  try {
    const res = await fetch('/api/employee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'volunteer',
        userId,
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
                    onClick={() => volunteer(employee.id)}
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
