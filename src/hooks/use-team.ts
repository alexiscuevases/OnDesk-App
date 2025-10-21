"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { InviteTeamMemberInput } from "@/lib/validations/team"

export interface TeamMember {
  id: string
  email: string
  role: string
  status: string
  user_id: string | null
  invited_by: string
  created_at: string
  updated_at: string
}

export function useTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchTeamMembers = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error: fetchError } = await supabase
        .from("team_members")
        .select("*")
        .eq("invited_by", user.id)
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError

      setTeamMembers(data || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch team members")
    } finally {
      setIsLoading(false)
    }
  }

  const inviteTeamMember = async (input: InviteTeamMemberInput) => {
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error: createError } = await supabase
        .from("team_members")
        .insert({
          email: input.email,
          role: input.role,
          status: "pending",
          invited_by: user.id,
        })
        .select()
        .single()

      if (createError) throw createError

      await fetchTeamMembers()
      return data
    } catch (err: any) {
      setError(err.message || "Failed to invite team member")
      throw err
    }
  }

  const updateTeamMemberRole = async (id: string, role: string) => {
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error: updateError } = await supabase
        .from("team_members")
        .update({ role, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("invited_by", user.id)
        .select()
        .single()

      if (updateError) throw updateError

      await fetchTeamMembers()
      return data
    } catch (err: any) {
      setError(err.message || "Failed to update team member role")
      throw err
    }
  }

  const removeTeamMember = async (id: string) => {
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: deleteError } = await supabase.from("team_members").delete().eq("id", id).eq("invited_by", user.id)

      if (deleteError) throw deleteError

      await fetchTeamMembers()
    } catch (err: any) {
      setError(err.message || "Failed to remove team member")
      throw err
    }
  }

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  return {
    teamMembers,
    isLoading,
    error,
    fetchTeamMembers,
    inviteTeamMember,
    updateTeamMemberRole,
    removeTeamMember,
  }
}
