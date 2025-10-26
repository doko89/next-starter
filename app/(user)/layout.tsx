"use client"

import { useSession } from "next-auth/react"
import { Sidebar } from "@/components/sidebar/sidebar"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const userRole = session?.user?.role as string

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={userRole || "user"} />
      <div className="flex-1 lg:ml-64">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}