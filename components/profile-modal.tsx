'use client'

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from 'lucide-react'
import { GitHubAvatar, getAvatarColorForUser } from "@/components/github-avatar"

interface ClassificationHistory {
  id: string
  image: string
  createdDate: string
  class: string
  subject: string
  modelAccuracy: string
  category: string
  categoryColor: string
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
  user?: {
    fullName: string
    username: string
    email: string
  }
}

export function ProfileModal({ isOpen, onClose, onLogout, user }: ProfileModalProps) {
  const classificationHistory: ClassificationHistory[] = [
    {
      id: "ME2-001",
      image: "/classified-image-1.jpg",
      createdDate: "2024-01-15 14:30",
      class: "Mountain Escape Two",
      subject: "Cat",
      modelAccuracy: "94.2%",
      category: "Eight Class",
      categoryColor: "#FF6B6B",
    },
    {
      id: "ME2-002",
      image: "/classified-image-2.jpg",
      createdDate: "2024-01-14 09:15",
      class: "Mountain Escape Two",
      subject: "Dog",
      modelAccuracy: "92.1%",
      category: "Five Class",
      categoryColor: "#4ECDC4",
    },
    {
      id: "ME2-003",
      image: "/classified-image-3.jpg",
      createdDate: "2024-01-13 16:45",
      class: "Mountain Escape Two",
      subject: "Bird",
      modelAccuracy: "88.5%",
      category: "Three Class",
      categoryColor: "#45B7D1",
    },
  ]

  const avatarColor = user?.username ? getAvatarColorForUser(user.username) : "#4ECDC4"

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div className="modal-bg border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <h2 className="text-2xl font-semibold text-foreground">User Profile</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex items-center gap-6">
            <GitHubAvatar username={user.username} size={120} />
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Full Name</p>
                <p className="font-semibold text-lg" style={{ color: avatarColor }}>{user.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Username</p>
                <p className="font-medium text-lg" style={{ color: avatarColor }}>@{user.username}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Email</p>
                <p className="font-medium text-lg" style={{ color: avatarColor }}>{user.email}</p>
              </div>
            </div>
          </div>

          {/* Classification History */}
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-lg mb-4 text-foreground">Classification History (Last 3)</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {classificationHistory.map((item) => (
                <Card key={item.id} className="p-3 hover:border-primary/50 transition-colors">
                  <div className="flex gap-4 items-start">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.subject}
                      className="w-20 h-20 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">ID</p>
                        <p className="font-medium text-foreground">{item.id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Class</p>
                        <p className="font-medium text-foreground">{item.class}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Subject</p>
                        <p className="font-medium text-foreground">{item.subject}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Accuracy</p>
                        <p className="font-medium text-green-600">
                          {item.modelAccuracy}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Created Date</p>
                        <p className="font-medium text-foreground">{item.createdDate}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border p-6 flex gap-3 flex-shrink-0">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Close
          </Button>
          <Button 
            onClick={onLogout} 
            className="flex-1 text-white"
            style={{ backgroundColor: avatarColor }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
