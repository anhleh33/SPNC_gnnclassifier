'use client'

import { useState } from 'react'
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface Notification {
  id: string
  message: string
  type: NotificationType
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (
    message: string,
    type: NotificationType = 'info',
    duration = 2000
  ) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications((prev) => [...prev, { id, message, type }])

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return { notifications, addNotification, removeNotification }
}

export function NotificationContainer({
  notifications,
  onRemove,
}: {
  notifications: Notification[]
  onRemove: (id: string) => void
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="fixed top-4 right-4 z-[999] space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex overflow-hidden rounded-lg shadow-lg transition-all duration-300 ${
            hoveredId === notification.id
              ? 'translate-x-96 opacity-0 pointer-events-none'
              : 'translate-x-0 opacity-100'
          }`}
          onMouseEnter={() => setHoveredId(notification.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Left accent for light mode; in dark mode the whole card becomes colored via the inner content classes */}
          <div
            className={
              notification.type === 'success'
                ? 'w-1.5 bg-green-500 rounded-l-md'
                : notification.type === 'error'
                ? 'w-1.5 bg-red-500 rounded-l-md'
                : notification.type === 'warning'
                ? 'w-1.5 bg-yellow-500 rounded-l-md'
                : 'w-1.5 bg-blue-500 rounded-l-md'
            }
          />

          <div
            className={`flex items-center gap-3 px-4 py-3 flex-1 w-full border
            bg-white border-gray-100 text-gray-900
            dark:border-transparent
            ${notification.type === 'success' ? 'dark:bg-green-950 dark:text-green-200 dark:border-green-800' : ''}
            ${notification.type === 'error' ? 'dark:bg-red-950 dark:text-red-200 dark:border-red-800' : ''}
            ${notification.type === 'warning' ? 'dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800' : ''}
            ${notification.type === 'info' ? 'dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800' : ''}
          `}
          >
            {notification.type === 'success' && (
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600 dark:text-green-200" />
            )}
            {notification.type === 'error' && (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-200" />
            )}
            {notification.type === 'warning' && (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-yellow-600 dark:text-yellow-200" />
            )}
            {notification.type === 'info' && (
              <Info className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-200" />
            )}

            <span className="text-sm font-medium flex-1">{notification.message}</span>

            <button
              onClick={() => onRemove(notification.id)}
              className="text-current hover:opacity-70 transition-opacity flex-shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
