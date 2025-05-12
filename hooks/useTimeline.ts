import { useEffect, useRef, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Employee } from "@/types/employee"

export function useTimeline(pageSize = 5) {
  const [timelineEntries, setTimelineEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const supabase = createClient()

  // Fetch employees from Supabase, and join with timeline table
  const fetchTimelineEntries = async (from: number, to: number) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('timeline')
      .select(`
        *,
        employees (
          id,
          name,
          profile_pic,
          job_title,
          totalVolunteeredHours
        )
      `)
      .order('created_at', { ascending: false })
      .range(from, to)
    setLoading(false)
    if (error) {
      console.error("Error fetching timeline entries:", error)
      return []
    }
    return data || []
  }

  // Map Supabase employee data to timeline format
  function mapTimelineEntries(data: any[]): any[] {
    return (data || []).map((entry) => {
      const emp = entry.employees || {}
      return {
        id: entry.id,
        actionType: entry.action_type,
        createdAt: entry.created_at,
        employeeId: entry.employee_id,
        notes: entry.notes,
        shiftHours: entry.shift_hours,
        volunteerMinutes: entry.volunteer_minutes,
        name: emp.name || "",
        initials: emp.name
          ? emp.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
          : "EM",
        profilePicture: emp.profile_pic || "/placeholder.svg?height=100&width=100",
        jobTitle: emp.job_title || "",
        hoursToday: (emp.totalVolunteeredHours ?? 0).toFixed(2),
          totalHours: emp.totalVolunteeredHours ?? 0,
          leftAt: entry.created_at,
      }
    })
  }

  // Initial load
  useEffect(() => {
    const load = async () => {
      const data = await fetchTimelineEntries(0, pageSize - 1)
      setTimelineEntries(mapTimelineEntries(data))
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
          table: 'timeline',
        },
        () => {
          // Refetch first page on any change
          fetchTimelineEntries(0, pageSize - 1).then((data) => {
            setTimelineEntries(mapTimelineEntries(data))
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
    const nextIndex = timelineEntries.length
    const data = await fetchTimelineEntries(nextIndex, nextIndex + pageSize - 1)
    setTimelineEntries((prev) => [...prev, ...mapTimelineEntries(data)])
    setHasMore(data.length === pageSize)
      setLoading(false)
  }
    //

  return { timelineEntries, loading, hasMore, loadMore }
}