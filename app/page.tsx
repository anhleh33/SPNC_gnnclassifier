"use client"

import { ImageClassifier } from "@/components/image-classifier"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { AuthModals } from "@/components/auth-modals"
import { ProfileModal } from "@/components/profile-modal"
import { useNotification, NotificationContainer } from "@/components/notification"
import { GitHubAvatar } from "@/components/github-avatar"

export default function Home() {
  const { notifications, addNotification, removeNotification } = useNotification()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    email: "",
  })

  useEffect(() => {
    localStorage.clear()
    setIsAuthenticated(false)
    setUser({ fullName: "", username: "", email: "" })
    const defaultUsers = [
      { fullName: "John Doe", username: "john_doe", email: "john@example.com", password: "Password123!", avatarColor: "#FF6B6B" },
      { fullName: "Jane Smith", username: "jane_smith", email: "jane@example.com", password: "Password456!", avatarColor: "#4ECDC4" },
      { fullName: "Alex Chen", username: "alex_chen", email: "alex@example.com", password: "Password789!", avatarColor: "#45B7D1" },
      { fullName: "Sarah Johnson", username: "sarah_johnson", email: "sarah@example.com", password: "Password012!", avatarColor: "#FFA07A" },
      { fullName: "Mike Wilson", username: "mike_wilson", email: "mike@example.com", password: "Password345!", avatarColor: "#98D8C8" },
    ]
    localStorage.setItem("users", JSON.stringify(defaultUsers))
  }, [])

  const handleSignIn = (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: any) =>
      (u.email === email || u.username === email) && u.password === password
    )

    if (!user) {
      addNotification("Invalid email/username or password", "error")
      return
    }

    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("currentUser", JSON.stringify({ fullName: user.fullName, username: user.username, email: user.email }))
    localStorage.setItem("userAvatarColor", user.avatarColor)
    setUser({ fullName: user.fullName, username: user.username, email: user.email })
    setIsAuthenticated(true)
    setShowSignIn(false)
    addNotification("Logged in successfully!", "success")
  }

  const handleSignUp = (userData: { fullName: string, username: string, email: string, avatarColor: string, password: string }) => {
    const { avatarColor, fullName, username, email, password } = userData
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    users.push({ fullName, username, email, password, avatarColor })
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("currentUser", JSON.stringify({ fullName, username, email }))
    localStorage.setItem("userAvatarColor", avatarColor)

    setUser({ fullName, username, email })
    setIsAuthenticated(true)
    setShowSignUp(false)
    setShowSignIn(false)
    addNotification("Account created successfully!", "success")
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("userAvatarColor")
    setIsAuthenticated(false)
    setShowProfile(false)
    setUser({ fullName: "", username: "", email: "" })
    addNotification("Logged out successfully", "success")
  }

  return (
    <div className="min-h-screen bg-background">
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />

      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">GNN</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">Graph Neural Network Classifier</h1>
          </button>
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowSignIn(true)}
                >
                  Sign In
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowSignUp(true)}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <GitHubAvatar username={user.username} size={32} />
                <span className="text-sm font-medium text-foreground">{user.username}</span>
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance text-foreground">
              AI-Powered Image Classification
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Upload an image and let our Graph Neural Network model identify the subject with advanced deep learning
              technology
            </p>
          </div>

          <ImageClassifier isAuthenticated={isAuthenticated} onNotification={addNotification} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Fast Processing</h3>
              <p className="text-sm text-muted-foreground">
                Get classification results in seconds with optimized GNN architecture
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-foreground">High Accuracy</h3>
              <p className="text-sm text-muted-foreground">
                State-of-the-art graph neural networks for precise subject detection
              </p>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.692 10-10.747S17.5 6.253 12 6.253z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2 text-foreground">Built with Educational Excellence</h3>
                <p className="text-muted-foreground">
                  Our training dataset has been carefully curated and developed by our team through an educational program in Vietnam.
                  This collaborative effort ensures high-quality, diverse data that powers our GNN model with real-world accuracy and reliability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            Dataset created by our educational team in Vietnam • Powered by GNN • Built with Next.js
          </p>
        </div>
      </footer>

      <AuthModals
        showSignIn={showSignIn}
        showSignUp={showSignUp}
        onSignInClose={() => setShowSignIn(false)}
        onSignUpClose={() => setShowSignUp(false)}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onNotification={addNotification}
      />

      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        onLogout={handleLogout}
        user={user}
      />
    </div>
  )
}
