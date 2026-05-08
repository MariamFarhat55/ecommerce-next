"use client"
import { useEffect } from "react"
import api from "@/lib/axios"
import { useAuth } from "@/hooks/useAuth"

export default function PushNotification() {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return
    if (!("Notification" in window)) return

    // Request permission for push notifications
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        registerServiceWorker()
      }
    })
  }, [isAuthenticated])

  const registerServiceWorker = async () => {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js")
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      })
      // Send subscription to backend
      await api.post("/notifications/subscribe", sub)
    } catch (err) {
      console.error("Push notification setup failed", err)
    }
  }

  return null // Invisible component
}