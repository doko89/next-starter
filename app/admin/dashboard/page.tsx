"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Settings, Shield, CalendarDays, Mail, User } from "lucide-react"
import Link from "next/link"
import { formatDateTime } from "@/lib/utils"
import { useState, useEffect } from "react"

interface UserStats {
  totalUsers: number
  recentUsers: number
  activeUsers: number
  totalAdmins: number
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const user = session?.user
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    recentUsers: 0,
    activeUsers: 0,
    totalAdmins: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch("/api/admin/stats")
        if (response.ok) {
          const stats = await response.json()
          setUserStats(stats)
        }
      } catch (error) {
        console.error("Failed to fetch user stats:", error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchUserStats()
  }, [])

  if (!user) {
    return <div>Please sign in to view the admin dashboard.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}! Here's an overview of your system.
        </p>
      </div>

      {/* Admin Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Administrator Information
          </CardTitle>
          <CardDescription>
            Your admin account details and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-lg font-semibold">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="destructive">{user.role}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Permissions</label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default" className="bg-green-500">Full Access</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : userStats.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              Registered users in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Users</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : userStats.recentUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              Users registered in the last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : userStats.activeUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              Users with recent activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : userStats.totalAdmins}
            </div>
            <p className="text-xs text-muted-foreground">
              Administrators in the system
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
          <CardDescription>
            Common administrative tasks and user management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild className="w-full h-auto p-4 flex flex-col items-start">
              <Link href="/admin/profile" className="flex flex-col items-start space-y-2">
                <Settings className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Manage Profile</div>
                  <div className="text-sm opacity-90">Update your admin account settings</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full h-auto p-4 flex flex-col items-start">
              <Link href="/admin/profile" className="flex flex-col items-start space-y-2">
                <Mail className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Change Password</div>
                  <div className="text-sm opacity-90">Update your admin account security</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            System Activity
          </CardTitle>
          <CardDescription>
            Recent system events and user activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No recent system activity to display
          </div>
        </CardContent>
      </Card>
    </div>
  )
}