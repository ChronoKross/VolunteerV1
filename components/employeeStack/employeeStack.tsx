"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Clock } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"

// Define the employee type based on the schema
interface Employee {
  id: string
  name: string
  profile_pic: string
  job_title: string
  volunteerHours: number // Calculated from timeline data
}

// Sample data - in a real app, this would come from your database
const sampleEmployees: Employee[] = [
  {
    id: "1",
    name: "Alex Johnson",
    profile_pic: "/placeholder.svg?height=40&width=40",
    job_title: "Software Engineer",
    volunteerHours: 45,
  },
  {
    id: "2",
    name: "Sam Taylor",
    profile_pic: "/placeholder.svg?height=40&width=40",
    job_title: "Product Manager",
    volunteerHours: 12,
  },
  {
    id: "3",
    name: "Jordan Smith",
    profile_pic: "/placeholder.svg?height=40&width=40",
    job_title: "UX Designer",
    volunteerHours: 28,
  },
  {
    id: "4",
    name: "Casey Williams",
    profile_pic: "/placeholder.svg?height=40&width=40",
    job_title: "Marketing Specialist",
    volunteerHours: 5,
  },
  {
    id: "5",
    name: "Riley Brown",
    profile_pic: "/placeholder.svg?height=40&width=40",
    job_title: "Data Analyst",
    volunteerHours: 32,
  },
]

// Maximum volunteer hours for color saturation calculation
const MAX_HOURS = 50

export default function EmployeeStack() {
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees)
  const { theme, setTheme } = useTheme()

  // Function to move an employee to the bottom of the stack
  const moveToBottom = (id: string) => {
    setEmployees((prev) => {
      const employee = prev.find((emp) => emp.id === id)
      if (!employee) return prev

      return [...prev.filter((emp) => emp.id !== id), employee]
    })
  }

  // Calculate color saturation based on volunteer hours
  const getColorSaturation = (hours: number) => {
    const percentage = Math.min(hours / MAX_HOURS, 1) * 100
    return percentage
  }

  return (
    <div className=" dark:from-slate-900 dark:via-blue-950 dark:to-violet-950">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Employee Volunteer Stack</h1>
          <ThemeSwitcher />
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {employees.map((employee, index) => {
              const saturation = getColorSaturation(employee.volunteerHours)

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
                    className="w-full flex items-center justify-between p-4 h-auto text-left bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
                    onClick={() => moveToBottom(employee.id)}
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
                      <span className="text-sm font-medium">{employee.volunteerHours} hrs</span>
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
