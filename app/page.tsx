"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (status === "authenticated") {
    return null // Will redirect automatically
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome to Next.js Starter</CardTitle>
          <CardDescription>
            A complete Next.js 16 starter template with authentication and role-based access control
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button asChild className="w-full">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Get started with your account or explore the features
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
