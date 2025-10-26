"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Mail, User } from "lucide-react"
import Link from "next/link"

export default function UserDashboard() {
  const { data: session } = useSession()
  const user = session?.user

  if (!user) {
    return <div>Please sign in to view your dashboard.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}! Here&apos;s an overview of your account.
        </p>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your current account details and status
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
                <Badge variant="secondary">{user.role}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Status</label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and account management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild className="w-full h-auto p-4 flex flex-col items-start">
              <Link href="/profile" className="flex flex-col items-start space-y-2">
                <User className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Edit Profile</div>
                  <div className="text-sm opacity-90">Update your account information</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full h-auto p-4 flex flex-col items-start">
              <Link href="/profile" className="flex flex-col items-start space-y-2">
                <Mail className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Change Password</div>
                  <div className="text-sm opacity-90">Update your account security</div>
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
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your recent account activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No recent activity to display
          </div>
        </CardContent>
      </Card>
    </div>
  )
}