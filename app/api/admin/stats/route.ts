import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/db/schema"
import { eq, gte, and } from "drizzle-orm"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    // Calculate date 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Get user statistics
    const [totalUsersResult, recentUsersResult, adminUsersResult] = await Promise.all([
      db.select({ count: users.id }).from(users),
      db.select({ count: users.id }).from(users).where(gte(users.createdAt, sevenDaysAgo)),
      db.select({ count: users.id }).from(users).where(eq(users.role, "admin")),
    ])

    const totalUsers = totalUsersResult.length
    const recentUsers = recentUsersResult.length
    const totalAdmins = adminUsersResult.length
    // For demo purposes, assume all users are "active" - in a real app, you'd track actual activity
    const activeUsers = Math.floor(totalUsers * 0.7)

    return NextResponse.json({
      totalUsers,
      recentUsers,
      activeUsers,
      totalAdmins,
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}