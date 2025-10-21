"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  read: boolean
  user_id: string
  created_at: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchNotifications = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error: fetchError } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (fetchError) throw fetchError

      setNotifications(data || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: updateError } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id)
        .eq("user_id", user.id)

      if (updateError) throw updateError

      await fetchNotifications()
    } catch (err: any) {
      setError(err.message || "Failed to mark notification as read")
      throw err
    }
  }

  const markAllAsRead = async () => {
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: updateError } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false)

      if (updateError) throw updateError

      await fetchNotifications()
    } catch (err: any) {
      setError(err.message || "Failed to mark all notifications as read")
      throw err
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    fetchNotifications()
  }, [])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  }
}
