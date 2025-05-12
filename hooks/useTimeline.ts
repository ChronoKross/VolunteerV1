import { useEffect, useRef, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Employee } from "@/types/employee"

export function useTimeline(pageSize = 5) {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const supabase = createClient()

  // Fetch employees from Supabase
  const fetchEmployees = async (from: number, to: number) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to)
    setLoading(false)
    if (error) {
      console.error("Error fetching employees:", error)
      return []
    }
    return data || []
  }

  // Map Supabase employee data to timeline format
  function mapEmployees(data: Employee[]): any[] {
    return (data || []).map((emp) => ({
      id: emp.id,
      name: emp.name,
      initials: emp.name
        ? emp.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        : "EM",
      profilePicture: emp.profile_pic || "/placeholder.svg?height=100&width=100",
      leftTime: emp.created_at,
      hoursToday: (emp.totalVolunteeredHours ?? 0).toFixed(2),
      totalHours: emp.totalVolunteeredHours ?? 0,
      jobTitle: emp.job_title,
    }))
  }

  // Initial load
  useEffect(() => {
    const load = async () => {
      const data = await fetchEmployees(0, pageSize - 1)
      setEmployees(mapEmployees(data))
      setHasMore(data.length === pageSize)
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Real-time subscription (optional, for auto-update)
  useEffect(() => {
    const channel = supabase
      .channel('timeline-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employees',
        },
        () => {
          // Refetch first page on any change
          fetchEmployees(0, pageSize - 1).then((data) => {
            setEmployees(mapEmployees(data))
            setHasMore(data.length === pageSize)
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Pagination
  const loadMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const nextIndex = employees.length
    const data = await fetchEmployees(nextIndex, nextIndex + pageSize - 1)
    setEmployees((prev) => [...prev, ...mapEmployees(data)])
    setHasMore(data.length === pageSize)
    setLoading(false)
  }

  return { employees, loading, hasMore, loadMore }
}