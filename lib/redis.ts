import { createClient, RedisClientType } from "redis";

// Redis client instance
let redisClient: RedisClientType | null = null;

// Get Redis client instance
export function getRedisClient(): RedisClientType | null {
  if (!redisClient && process.env.REDIS_URL) {
    try {
      redisClient = createClient({
        url: process.env.REDIS_URL,
        socket: {
          connectTimeout: 5000,
        },
      });

      // Handle Redis errors
      redisClient.on("error", (error) => {
        console.error("Redis Client Error:", error);
        redisClient = null;
      });

      redisClient.on("connect", () => {
        console.log("Redis Client Connected");
      });

      redisClient.on("disconnect", () => {
        console.log("Redis Client Disconnected");
      });
    } catch (error) {
      console.error("Failed to create Redis client:", error);
    }
  }

  return redisClient;
}

// Connect to Redis
export async function connectRedis(): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.connect();
    return true;
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    return false;
  }
}

// Disconnect from Redis
export async function disconnectRedis(): Promise<void> {
  const client = getRedisClient();
  if (client && client.isOpen) {
    await client.quit();
  }
}

// Redis cache helper functions
export class RedisCache {
  private client: RedisClientType | null;

  constructor() {
    this.client = getRedisClient();
  }

  // Get value from cache
  async get<T>(key: string): Promise<T | null> {
    if (!this.client || !this.client.isOpen) {
      return null;
    }

    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  }

  // Set value in cache with optional TTL (seconds)
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    if (!this.client || !this.client.isOpen) {
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setEx(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
      return true;
    } catch (error) {
      console.error("Redis set error:", error);
      return false;
    }
  }

  // Delete key from cache
  async del(key: string): Promise<boolean> {
    if (!this.client || !this.client.isOpen) {
      return false;
    }

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error("Redis delete error:", error);
      return false;
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    if (!this.client || !this.client.isOpen) {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error("Redis exists error:", error);
      return false;
    }
  }

  // Increment numeric value
  async incr(key: string): Promise<number | null> {
    if (!this.client || !this.client.isOpen) {
      return null;
    }

    try {
      return await this.client.incr(key);
    } catch (error) {
      console.error("Redis increment error:", error);
      return null;
    }
  }

  // Set value only if key doesn't exist
  async setnx<T>(key: string, value: T): Promise<boolean> {
    if (!this.client || !this.client.isOpen) {
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      const result = await this.client.setNX(key, serializedValue);
      return result === 1;
    } catch (error) {
      console.error("Redis setnx error:", error);
      return false;
    }
  }

  // Get remaining TTL of key
  async ttl(key: string): Promise<number> {
    if (!this.client || !this.client.isOpen) {
      return -1;
    }

    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error("Redis TTL error:", error);
      return -1;
    }
  }

  // Clear all cache (use with caution)
  async flush(): Promise<boolean> {
    if (!this.client || !this.client.isOpen) {
      return false;
    }

    try {
      await this.client.flushDb();
      return true;
    } catch (error) {
      console.error("Redis flush error:", error);
      return false;
    }
  }
}

// Create a singleton cache instance
export const cache = new RedisCache();

// Initialize Redis connection on application start
export async function initializeRedis(): Promise<void> {
  if (process.env.REDIS_URL) {
    const connected = await connectRedis();
    if (connected) {
      console.log("✅ Redis connected successfully");
    } else {
      console.warn("⚠️ Redis connection failed, running without cache");
    }
  } else {
    console.log("📝 Redis URL not provided, running without cache");
  }
}