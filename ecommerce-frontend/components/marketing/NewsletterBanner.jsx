"use client"
import { useState } from "react"
import api from "@/lib/axios"
import toast from "react-hot-toast"

export default function NewsletterBanner() {
  const [email, setEmail]   = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone]     = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post("/marketing/newsletter", { email })
      setDone(true)
      toast.success("Subscribed!")
    } catch {
      toast.error("Something went wrong")
    } finally { setLoading(false) }
  }

  return (
    <section style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", padding: "60px 24px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <span className="section-tag">Newsletter</span>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--text)", marginBottom: 10, letterSpacing: "-0.02em" }}>
          Stay in the Loop
        </h2>
        <p style={{ fontSize: 15, color: "var(--text2)", marginBottom: 28 }}>
          Get exclusive offers and new arrivals straight to your inbox.
        </p>

        {done ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 24px", background: "rgba(22,163,74,0.1)", borderRadius: 10 }}>
            <span style={{ color: "var(--gold)", fontSize: 18 }}>✓</span>
            <span style={{ fontSize: 15, fontWeight: 500, color: "var(--gold)" }}>You're subscribed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, maxWidth: 420, margin: "0 auto" }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="lux-input"
              style={{ flex: 1 }}
              required
            />
            <button type="submit" className="btn-primary" style={{ whiteSpace: "nowrap", opacity: loading ? 0.7 : 1 }}>
              {loading ? "..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}