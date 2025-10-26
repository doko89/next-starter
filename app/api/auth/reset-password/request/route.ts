import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, verificationTokens } from "@/db/schema"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser.length === 0) {
      // Don't reveal that the user doesn't exist for security
      return NextResponse.json(
        { message: "If an account with this email exists, password reset instructions have been sent" },
        { status: 200 }
      )
    }

    // Generate reset token (valid for 24 hours)
    const token = nanoid(32)
    const expires = new Date()
    expires.setHours(expires.getHours() + 24)

    // Delete any existing tokens for this email
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, email))

    // Store the new token
    await db.insert(verificationTokens).values({
      identifier: email,
      token,
      expires,
    })

    // In a real application, you would send an email here
    // For now, we'll just log it to the console for development
    console.log(`Password reset token for ${email}: ${token}`)
    console.log(`This token will expire at: ${expires.toISOString()}`)

    return NextResponse.json(
      { message: "Password reset instructions have been sent to your email" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}