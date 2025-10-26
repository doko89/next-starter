"use client"

import { useState, useRef, ChangeEvent } from "react"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Upload, X } from "lucide-react"

export default function ProfileAvatar() {
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.")
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error("File too large. Maximum size is 5MB.")
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("avatar", file)

      const response = await fetch("/api/avatar", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Avatar updated successfully!")
        // Update session to reflect new avatar
        await update({
          ...session,
          user: {
            ...session?.user,
            image: data.avatarUrl,
          },
        })
      } else {
        toast.error(data.error || "Failed to update avatar")
      }
    } catch (error) {
      toast.error("An error occurred while uploading avatar")
    } finally {
      setIsLoading(false)
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveAvatar = async () => {
    if (!session?.user?.image) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/avatar", {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Avatar removed successfully!")
        // Update session to reflect removed avatar
        await update({
          ...session,
          user: {
            ...session?.user,
            image: null,
          },
        })
      } else {
        toast.error(data.error || "Failed to remove avatar")
      }
    } catch (error) {
      toast.error("An error occurred while removing avatar")
    } finally {
      setIsLoading(false)
    }
  }

  const getUserInitials = () => {
    if (!session?.user?.name) return "U"
    const names = session.user.name.split(" ")
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0]
    }
    return names[0][0]
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={session?.user?.image || undefined}
            alt={session?.user?.name || "User"}
          />
          <AvatarFallback className="text-lg">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>

        {session?.user?.image && (
          <Button
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemoveAvatar}
            disabled={isLoading}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar-upload" className="text-sm font-medium">
          Update Avatar
        </Label>
        <div className="flex items-center space-x-2">
          <Input
            id="avatar-upload"
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={isLoading}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isLoading ? "Uploading..." : "Choose File"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          JPEG, PNG, WebP, or GIF (max 5MB)
        </p>
      </div>
    </div>
  )
}