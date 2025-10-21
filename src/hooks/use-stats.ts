"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface DashboardStats {
  totalConversations: number
  activeAgents: number
  avgResponseTime: string
  satisfactionRate: number
  conversationsChange: number
  agentsChange: number
  responseTimeChange: number
  satisfactionChange: number
}

export function useStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchStats = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Fetch conversations count
      const { count: conversationsCount } = await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      // Fetch active agents count
      const { count: agentsCount } = await supabase
        .from("agents")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "active")

      // Calculate stats (mock data for changes)
      setStats({
        totalConversations: conversationsCount || 0,
        activeAgents: agentsCount || 0,
        avgResponseTime: "2.4s",
        satisfactionRate: 94.5,
        conversationsChange: 12.5,
        agentsChange: 8.2,
        responseTimeChange: -5.3,
        satisfactionChange: 2.1,
      })
    } catch (err: any) {
      setError(err.message || "Failed to fetch stats")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    isLoading,
    error,
    fetchStats,
  }
}
