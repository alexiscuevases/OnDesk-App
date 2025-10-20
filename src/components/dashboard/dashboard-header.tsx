"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, Menu } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

export function DashboardHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1 flex items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search agents, conversations..." className="pl-9" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary" asChild>
                  <Link href="/dashboard/notifications">View all</Link>
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[300px]">
                <div className="space-y-1">
                  <DropdownMenuItem className="flex-col items-start gap-1 p-3 cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm font-medium">New conversation started</p>
                      <Badge variant="default" className="text-xs">
                        New
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Agent "Support Bot" received a new message from Alice Johnson
                    </p>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex-col items-start gap-1 p-3 cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm font-medium">Agent performance alert</p>
                      <Badge variant="default" className="text-xs">
                        New
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Response time for Tech Support increased by 15%</p>
                    <span className="text-xs text-muted-foreground">15 min ago</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex-col items-start gap-1 p-3 cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm font-medium">Team member invited</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Sarah Chen joined your workspace as an Admin</p>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
                  </DropdownMenuItem>
                </div>
              </ScrollArea>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href="/dashboard/notifications">View all notifications</Link>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
