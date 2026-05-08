"use client"
import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { useAuth } from "@/hooks/useAuth"

export default function LoyaltyWidget() {
  const { isAuthenticated } = useAuth()
  const [points, setPoints] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) return
    api.get("/users/loyalty").then(r => setPoints(r.data.points)).catch(() => {})
  }, [isAuthenticated])

  if (!isAuthenticated || points === null) return null

  const nextReward = 500
  const progress   = Math.min((points / nextReward) * 100, 100)

  return (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "'Syne',sans-serif" }}>Loyalty Points</p>
        </div>
        <p style={{ fontSize: 22, fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "var(--text)" }}>
          {points} <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text2)" }}>pts</span>
        </p>
      </div>
      <div style={{ height: 4, background: "var(--bg3)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "var(--accent)", borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
      <p style={{ fontSize: 12, color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>
        {nextReward - points} points until your next reward
      </p>
    </div>
  )
}