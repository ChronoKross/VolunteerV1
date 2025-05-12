"use client"
import { useTimeline } from "@/hooks/useTimeline"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Clock, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { Employee } from "@/types/employee"

const SkeletonLoader = () => {
  return (
    <div className="mb-6 relative animate-pulse">
      <div className="absolute left-[-8px] sm:left-[-16px] top-6 w-4 h-4 sm:w-6 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded-full z-10"></div>
      <Card className="p-4 sm:p-6 dark:bg-card dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex-1 space-y-3 w-full">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="flex flex-row gap-3 sm:gap-4 pt-2">
              <div className="bg-gray-200 dark:bg-gray-700 px-3 sm:px-4 py-2 rounded-md w-24 h-16"></div>
              <div className="bg-gray-200 dark:bg-gray-700 px-3 sm:px-4 py-2 rounded-md w-24 h-16"></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate)
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })
}

export function EmployeeTimeline() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const { timelineEntries, loading, hasMore, loadMore } = useTimeline(5)
  

  // Fetch employees from Supabase
 

  // Initial load
  useEffect(() => { setMounted(true) }, [])


  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (loading) return

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    )

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore])

  // Map Supabase employee data to timeline format
  // function mapEmployees(data: Employee[]): any[] {
  //   return (data || []).map((emp) => ({
  //     id: emp.id,
  //     name: emp.name,
  //     initials: emp.name
  //       ? emp.name
  //           .split(" ")
  //           .map((n) => n[0])
  //           .join("")
  //           .substring(0, 2)
  //           .toUpperCase()
  //       : "EM",
  //     profilePicture: emp.profile_pic || "/placeholder.svg?height=100&width=100",
  //     leftTime: emp.created_at,
  //     hoursToday: (emp.totalVolunteeredHours ?? 0).toFixed(2),
  //     totalHours: emp.totalVolunteeredHours ?? 0,
  //     jobTitle: emp.job_title,
  //   }))
  // }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Timeline connector animation
  const connectorVariants = {
    hidden: { scaleY: 0, originY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center sticky top-0 z-10 bg-background py-2 mb-2">
        <h2 className="text-xl font-semibold">Volunteer Timeline</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-md border-gray-200 dark:border-gray-800 w-10 h-10 p-0"
        >
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* Fixed height container with scrolling */}
      <div
        ref={timelineRef}
        className="relative h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: theme === "dark" ? "#4B5563 transparent" : "#D1D5DB transparent",
        }}
      >
        <motion.div className="relative pl-6 sm:pl-8" variants={container} initial="hidden" animate="show">
          {/* Timeline connector line with animation */}
          <motion.div
            className="absolute left-2 sm:left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 origin-top"
            variants={connectorVariants}
            initial="hidden"
            animate="visible"
          />

          {/* Skeleton loaders when initially loading */}
          {loading && timelineEntries.length === 0 && (
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <SkeletonLoader key={`skeleton-${index}`} />
              ))}
            </div>
          )}

          {/* Actual timeline entries */}
          <AnimatePresence>
            {timelineEntries.map((employee) => (
              <motion.div
                key={employee.id}
                variants={item}
                className="mb-6 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.01 }}
              >
                <motion.div
                  className="absolute left-[-8px] sm:left-[-16px] top-6 w-4 h-4 sm:w-6 sm:h-6 bg-background dark:bg-black rounded-full border-4 border-gray-300 dark:border-gray-700 z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    delay: 0.2,
                  }}
                />
                <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-300 dark:bg-card dark:border-gray-800">
                  <div className="flex flex-row gap-4 items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-medium">
                      {employee.initials}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">{employee.name}</h3>
                        <div className="flex items-center">
                          <span className="text-xs px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{Number(employee.hoursToday).toFixed(0)} hrs</span>
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm">{employee.jobTitle}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {hasMore && (
            <div ref={loadingRef} className="flex justify-center items-center py-4 mb-4 h-20">
              {loading && timelineEntries.length > 0 ? (
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-6 h-6 border-2 border-t-gray-800 dark:border-t-gray-200 border-gray-200 dark:border-gray-800 rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading more...</p>
                </motion.div>
              ) : (
                <div className="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              )}
            </div>
          )}

          {!hasMore && timelineEntries.length > 0 && (
            <motion.div
              className="text-center py-4 text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              No more entries to load
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
