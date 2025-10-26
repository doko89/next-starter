import { db } from "../lib/db"
import { users } from "./schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

interface SeedUser {
  name: string
  email: string
  password: string
  role: "user" | "admin"
  image?: string
}

// Default seed users
const DEFAULT_USERS: SeedUser[] = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123456",
    role: "admin",
    image: "https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff",
  },
  {
    name: "Regular User",
    email: "user@example.com",
    password: "user123456",
    role: "user",
    image: "https://ui-avatars.com/api/?name=Regular+User&background=06b6d4&color=fff",
  },
  {
    name: "Test User",
    email: "test@example.com",
    password: "test123456",
    role: "user",
    image: "https://ui-avatars.com/api/?name=Test+User&background=10b981&color=fff",
  },
]

// Environment variable overrides
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123456"
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin User"

async function seed() {
  console.log("🌱 Starting database seeding...")

  try {
    // Check database connection
    await db.select().from(users).limit(1)
    console.log("✅ Database connection established")

    // Update admin user from environment variables if provided
    const envAdmin = {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin" as const,
      image: "https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff",
    }

    const seedUsers = [...DEFAULT_USERS]

    // Override admin user with environment variables
    const adminIndex = seedUsers.findIndex(user => user.role === "admin")
    if (adminIndex >= 0) {
      seedUsers[adminIndex] = envAdmin
    }

    let createdCount = 0
    let skippedCount = 0

    // Create each user if they don't exist
    for (const user of seedUsers) {
      try {
        // Check if user already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1)

        if (existingUser.length === 0) {
          const hashedPassword = await bcrypt.hash(user.password, 12)

          await db.insert(users).values({
            id: uuidv4(),
            name: user.name,
            email: user.email,
            password: hashedPassword,
            role: user.role,
            image: user.image,
            createdAt: new Date(),
            updatedAt: new Date(),
          })

          console.log(`✅ Created ${user.role} user: ${user.email}`)
          if (user.role === "admin") {
            console.log(`   Password: ${user.password}`)
          }
          createdCount++
        } else {
          console.log(`ℹ️  User already exists: ${user.email}`)
          skippedCount++
        }
      } catch (error) {
        console.error(`❌ Error creating user ${user.email}:`, error)
      }
    }

    // Display summary
    console.log("\n📊 Seeding Summary:")
    console.log(`   ✅ Created: ${createdCount} users`)
    console.log(`   ⏭️  Skipped: ${skippedCount} users`)

    if (createdCount > 0) {
      console.log("\n🔐 Login Credentials:")
      const adminUser = seedUsers.find(u => u.role === "admin")
      if (adminUser) {
        console.log(`   Admin: ${adminUser.email} / ${adminUser.password}`)
      }
      const regularUsers = seedUsers.filter(u => u.role === "user")
      regularUsers.forEach(user => {
        console.log(`   User: ${user.email} / ${user.password}`)
      })
    }

    console.log("\n🎉 Database seeding completed successfully!")

    // Display next steps
    if (createdCount > 0) {
      console.log("\n📝 Next Steps:")
      console.log("   1. Start the application: bun run dev")
      console.log("   2. Visit: http://localhost:3000")
      console.log("   3. Login with the credentials above")
      console.log("   4. Change default passwords after first login")
    }

  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

// Additional function to create just admin user
export async function createAdminUser(override?: {
  email?: string
  password?: string
  name?: string
}) {
  console.log("👑 Creating admin user...")

  try {
    const adminUser = {
      name: override?.name || ADMIN_NAME,
      email: override?.email || ADMIN_EMAIL,
      password: override?.password || ADMIN_PASSWORD,
      role: "admin" as const,
      image: "https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff",
    }

    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, adminUser.email))
      .limit(1)

    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash(adminUser.password, 12)

      await db.insert(users).values({
        id: uuidv4(),
        name: adminUser.name,
        email: adminUser.email,
        password: hashedPassword,
        role: adminUser.role,
        image: adminUser.image,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log(`✅ Created admin user: ${adminUser.email}`)
      console.log(`   Name: ${adminUser.name}`)
      console.log(`   Password: ${adminUser.password}`)
    } else {
      console.log(`ℹ️  Admin user already exists: ${adminUser.email}`)
    }

    return true
  } catch (error) {
    console.error("❌ Error creating admin user:", error)
    return false
  }
}

// Function to reset admin user password
export async function resetAdminPassword(newPassword?: string) {
  console.log("🔄 Resetting admin password...")

  try {
    const adminEmail = ADMIN_EMAIL
    const password = newPassword || ADMIN_PASSWORD

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.email, adminEmail))
      .returning({ id: users.id })

    if (result.length > 0) {
      console.log(`✅ Password reset for admin: ${adminEmail}`)
      console.log(`   New password: ${password}`)
      return true
    } else {
      console.log(`❌ Admin user not found: ${adminEmail}`)
      return false
    }
  } catch (error) {
    console.error("❌ Error resetting admin password:", error)
    return false
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  const command = process.argv[2]

  switch (command) {
    case "admin":
      createAdminUser()
        .then(() => process.exit(0))
        .catch(() => process.exit(1))
      break
    case "reset-password":
      const newPassword = process.argv[3]
      resetAdminPassword(newPassword)
        .then(() => process.exit(0))
        .catch(() => process.exit(1))
      break
    default:
      seed()
        .then(() => process.exit(0))
        .catch(() => process.exit(1))
      break
  }
}

export { seed }