'use client'

import { useState, useEffect } from 'react'
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface Notification {
  id: string
  message: string
  type: NotificationType
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (message: string, type: NotificationType = 'info', duration = 2000) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { id, message, type }])
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return { notifications, addNotification, removeNotification }
}

export function NotificationContainer({ notifications, onRemove }: { 
  notifications: Notification[]
  onRemove: (id: string) => void 
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="fixed top-4 right-4 z-[999] space-y-2 max-w-sm">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 ${
            hoveredId === notification.id ? 'translate-x-96 opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'
          } ${
            notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200' :
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200' :
            notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200' :
            'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200'
          }`}
          onMouseEnter={() => setHoveredId(notification.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {notification.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'warning' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
          <span className="text-sm font-medium flex-1">{notification.message}</span>
          <button
            onClick={() => onRemove(notification.id)}
            className="text-current hover:opacity-70 transition-opacity flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
