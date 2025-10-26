import { db } from "../lib/db"
import { users } from "./schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

async function seed() {
  console.log("🌱 Seeding database...")

  try {
    // Create admin user
    const adminEmail = "admin@example.com"
    const adminPassword = "admin123456"

    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1)

    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12)

      await db.insert(users).values({
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      })

      console.log(`✅ Created admin user: ${adminEmail}`)
      console.log(`   Password: ${adminPassword}`)
    } else {
      console.log(`ℹ️  Admin user already exists: ${adminEmail}`)
    }

    // Create regular user
    const userEmail = "user@example.com"
    const userPassword = "user123456"

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .limit(1)

    if (existingUser.length === 0) {
      const hashedPassword = await bcrypt.hash(userPassword, 12)

      await db.insert(users).values({
        name: "Regular User",
        email: userEmail,
        password: hashedPassword,
        role: "user",
      })

      console.log(`✅ Created regular user: ${userEmail}`)
      console.log(`   Password: ${userPassword}`)
    } else {
      console.log(`ℹ️  Regular user already exists: ${userEmail}`)
    }

    console.log("🎉 Database seeding completed!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error)
  process.exit(1)
})