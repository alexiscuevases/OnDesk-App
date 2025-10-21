"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { ConnectionInput } from "@/lib/validations/connection"

export interface Connection {
  id: string
  name: string
  type: string
  config: any
  status: string
  user_id: string
  created_at: string
  updated_at: string
}

export function useConnections() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchConnections = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error: fetchError } = await supabase
        .from("connections")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError

      setConnections(data || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch connections")
    } finally {
      setIsLoading(false)
    }
  }

  const createConnection = async (input: ConnectionInput) => {
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error: createError } = await supabase
        .from("connections")
        .insert({
          name: input.name,
          type: input.type,
          config: input.config,
          status: input.status,
          user_id: user.id,
        })
        .select()
        .single()

      if (createError) throw createError

      await fetchConnections()
      return data
    } catch (err: any) {
      setError(err.message || "Failed to create connection")
      throw err
    }
  }

  const updateConnection = async (id: string, input: Partial<ConnectionInput>) => {
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const updateData: any = { updated_at: new Date().toISOString() }
      if (input.name) updateData.name = input.name
      if (input.config) updateData.config = input.config
      if (input.status) updateData.status = input.status

      const { data, error: updateError } = await supabase
        .from("connections")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (updateError) throw updateError

      await fetchConnections()
      return data
    } catch (err: any) {
      setError(err.message || "Failed to update connection")
      throw err
    }
  }

  const deleteConnection = async (id: string) => {
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: deleteError } = await supabase.from("connections").delete().eq("id", id).eq("user_id", user.id)

      if (deleteError) throw deleteError

      await fetchConnections()
    } catch (err: any) {
      setError(err.message || "Failed to delete connection")
      throw err
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [])

  return {
    connections,
    isLoading,
    error,
    fetchConnections,
    createConnection,
    updateConnection,
    deleteConnection,
  }
}
