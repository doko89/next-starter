import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users, accounts, sessions } from "@/db/schema"
import { eq, gte, count } from "drizzle-orm"
import { cache } from "@/lib/redis"

interface AdminStats {
  totalUsers: number;
  totalAccounts: number;
  totalSessions: number;
  recentUsers: number;
  totalAdmins: number;
  activeUsers: number;
  topProviders: { provider: string; count: number }[];
}

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    // Try to get stats from cache first
    const cacheKey = "admin:stats";
    const cachedStats = await cache.get<AdminStats>(cacheKey);

    if (cachedStats) {
      return NextResponse.json({
        ...cachedStats,
        cached: true,
        timestamp: new Date().toISOString(),
      });
    }

    // Calculate date 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Get user statistics
    const [totalUsersResult, recentUsersResult, adminUsersResult, accountCount, sessionCount] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(users).where(gte(users.createdAt, sevenDaysAgo)),
      db.select({ count: count() }).from(users).where(eq(users.role, "admin")),
      db.select({ count: count() }).from(accounts),
      db.select({ count: count() }).from(sessions),
    ])

    // Get top OAuth providers
    const providerStats = await db
      .select({
        provider: accounts.provider,
        count: count(),
      })
      .from(accounts)
      .groupBy(accounts.provider)
      .orderBy((provider) => count(provider.provider));

    const totalUsers = totalUsersResult[0].count
    const recentUsers = recentUsersResult[0].count
    const totalAdmins = adminUsersResult[0].count
    const totalAccounts = accountCount[0].count
    const totalSessions = sessionCount[0].count

    // For demo purposes, assume 70% of users are "active"
    const activeUsers = Math.floor(totalUsers * 0.7)

    const stats: AdminStats = {
      totalUsers,
      totalAccounts,
      totalSessions,
      recentUsers,
      totalAdmins,
      activeUsers,
      topProviders: providerStats.map((stat) => ({
        provider: stat.provider,
        count: stat.count,
      })),
    };

    // Cache the stats for 5 minutes (300 seconds)
    await cache.set(cacheKey, stats, 300);

    return NextResponse.json({
      ...stats,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const session = await auth()

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    // Clear the stats cache
    const cacheKey = "admin:stats";
    await cache.del(cacheKey);

    return NextResponse.json({
      success: true,
      message: "Stats cache cleared successfully",
    });
  } catch (error) {
    console.error("Clear stats cache error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}