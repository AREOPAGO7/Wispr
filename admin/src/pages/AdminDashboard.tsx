"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { Users, MessageSquare, FlipHorizontalIcon as SwapHorizontal, TrendingUp, Loader2, Activity, ArrowUpIcon, ArrowDownIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Stats {
  totalUsers: number
  totalSwaps: number
  totalDeals: number
  activeUsers: number
  recentUsers: Array<{
    id: number
    name: string
    email: string
    avatar?: string
    lastActive: string
  }>
}

interface StatCardProps {
  title: string
  value: number
  description: string
  icon: React.ReactNode
  trend?: { value: number; isPositive: boolean }
}

interface AvatarProps {
  name: string
  image?: string
}

// Enhanced StatCard Component
const StatCard = ({ title, value, description, icon, trend }: StatCardProps) => (
  <Card className="bg-background border-border">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-lg bg-muted/10 p-1.5 text-muted-foreground">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      {trend && (
        <div className="mt-2 flex items-center text-xs">
          {trend.isPositive ? (
            <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
          )}
          <span
            className={trend.isPositive ? "text-green-500" : "text-red-500"}
          >
            {trend.value}%
          </span>
          <span className="ml-1 text-muted-foreground">{description}</span>
        </div>
      )}
      <Progress 
        value={trend ? (trend.isPositive ? trend.value : 100 - trend.value) : 50} 
        className="mt-3 h-1"
      />
    </CardContent>
  </Card>
)

// Enhanced Avatar Component
const Avatar = ({ name, image }: AvatarProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
      {image ? (
        <img src={image || "/placeholder.svg"} alt={name} className="aspect-square h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <span className="text-sm font-medium text-muted-foreground">{initials}</span>
        </div>
      )}
      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-background"></span>
    </div>
  )
}

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Never';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  } catch (error) {
    return 'Invalid date';
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalSwaps: 0,
    totalDeals: 0,
    activeUsers: 0,
    recentUsers: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken")
        if (!token) {
          throw new Error("No authentication token found")
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const [usersRes, swapsRes, dealsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/admin/users", { headers }),
          axios.get("http://localhost:8000/api/admin/swaps", { headers }),
          axios.get("http://localhost:8000/api/admin/deals", { headers }),
        ])

        setStats({
          totalUsers: usersRes.data.total,
          totalSwaps: swapsRes.data.total,
          totalDeals: dealsRes.data.total,
          activeUsers: usersRes.data.data.filter((u: any) => u.last_active_at).length,
          recentUsers: usersRes.data.data.slice(0, 5).map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            lastActive: user.last_active_at,
          })),
        })
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err)
        setError("Failed to load dashboard statistics.")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col gap-8 p-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-[160px] rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-[400px] border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your platform's performance and recent activity.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="vs. last month"
          icon={<Users className="h-full w-full" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          description="current session"
          icon={<TrendingUp className="h-full w-full" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Swaps"
          value={stats.totalSwaps}
          description="lifetime"
          icon={<SwapHorizontal className="h-full w-full" />}
        />
        <StatCard
          title="Total Deals"
          value={stats.totalDeals}
          description="completion rate"
          icon={<MessageSquare className="h-full w-full" />}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>A list of users who recently accessed the platform.</CardDescription>
        </CardHeader>
        <ScrollArea className="h-[400px]">
          {stats.recentUsers.length > 0 ? (
            <div className="space-y-0">
              {stats.recentUsers.map((user, i) => (
                <div key={user.id}>
                  {i > 0 && <Separator />}
                  <div className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar name={user.name} image={user.avatar} />
                      <div>
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-muted-foreground">
                        Last active: {formatDate(user.lastActive)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground">No recent users found.</p>
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  )
}
