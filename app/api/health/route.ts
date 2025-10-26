import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";

interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database: "connected" | "disconnected";
    redis: "connected" | "disconnected";
    filesystem: "connected" | "disconnected";
  };
  environment: string;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  const startTime = Date.now();

  try {
    // Check database connection
    let databaseStatus: "connected" | "disconnected" = "disconnected";
    try {
      await db.select().from(users).limit(1);
      databaseStatus = "connected";
    } catch (error) {
      console.error("Database health check failed:", error);
    }

    // Check Redis connection
    let redisStatus: "connected" | "disconnected" = "disconnected";
    try {
      if (process.env.REDIS_URL) {
        const { createClient } = await import("redis");
        const redisClient = createClient({ url: process.env.REDIS_URL });
        await redisClient.connect();
        await redisClient.ping();
        await redisClient.quit();
        redisStatus = "connected";
      }
    } catch (error) {
      console.error("Redis health check failed:", error);
    }

    // Check filesystem access (uploads directory)
    let filesystemStatus: "connected" | "disconnected" = "connected";
    try {
      const fs = await import("fs/promises");
      await fs.access("public/uploads");
    } catch (error) {
      console.error("Filesystem health check failed:", error);
      filesystemStatus = "disconnected";
    }

    // Get memory usage
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = Math.round((usedMemory / totalMemory) * 100);

    // Get uptime
    const uptime = process.uptime();

    // Determine overall health
    const isHealthy =
      databaseStatus === "connected" &&
      filesystemStatus === "connected" &&
      memoryPercentage < 90;

    const response: HealthCheckResponse = {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: Math.round(uptime),
      version: process.env.npm_package_version || "1.0.0",
      services: {
        database: databaseStatus,
        redis: redisStatus,
        filesystem: filesystemStatus,
      },
      environment: process.env.NODE_ENV || "development",
      memory: {
        used: Math.round(usedMemory / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        percentage: memoryPercentage,
      },
    };

    const responseTime = Date.now() - startTime;

    // Add response time header
    const nextResponse = NextResponse.json(response);
    nextResponse.headers.set("X-Response-Time", `${responseTime}ms`);
    nextResponse.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");

    return isHealthy
      ? nextResponse
      : NextResponse.json(response, { status: 503 });

  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
      services: {
        database: "disconnected",
        redis: "disconnected",
        filesystem: "disconnected",
      },
      environment: process.env.NODE_ENV || "development",
      memory: {
        used: 0,
        total: 0,
        percentage: 0,
      },
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 503 });
  }
}

// Also support HEAD requests for simple health checks
export async function HEAD(): Promise<Response> {
  try {
    // Quick health check - just check database
    await db.select().from(users).limit(1);

    return new Response(null, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      }
    });
  } catch {
    return new Response(null, { status: 503 });
  }
}