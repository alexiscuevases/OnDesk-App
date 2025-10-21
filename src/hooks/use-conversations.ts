"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Conversation {
  id: string
  customer_name: string
  customer_email: string | null
  customer_phone: string | null
  status: string
  priority: string
  channel: string
  sentiment: string | null
  agent_id: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: string
  content: string
  created_at: string
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchConversations = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error: fetchError } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError

      setConversations(data || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch conversations")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchConversationMessages = async (conversationId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (fetchError) throw fetchError

      return data as Message[]
    } catch (err: any) {
      throw new Error(err.message || "Failed to fetch messages")
    }
  }

  const updateConversationStatus = async (id: string, status: string) => {
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: updateError } = await supabase
        .from("conversations")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", user.id)

      if (updateError) throw updateError

      await fetchConversations()
    } catch (err: any) {
      setError(err.message || "Failed to update conversation")
      throw err
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  return {
    conversations,
    isLoading,
    error,
    fetchConversations,
    fetchConversationMessages,
    updateConversationStatus,
  }
}
