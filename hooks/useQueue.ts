import { createClient } from '@/utils/supabase/client'
import { Employee } from '@/types/employee'
import { useEffect, useState } from 'react'
import EmployeeStack from '@/components/employeeStack/employeeStack';

const supabase = createClient();

export function useQueue() {
  const [queue, setQueue] = useState<Employee[]>([])

  const fetchQueue = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('position', { ascending: true })

    if (error) console.error('💥 Queue fetch error:', error)
    else setQueue(data ?? [])
  }

  useEffect(() => {
    fetchQueue()

    const channel = supabase
      .channel('queue-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // or '*' if you're tracking INSERTS/DELETES too
          schema: 'public',
          table: 'employees',
        },
        () => {
          fetchQueue()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return queue
}