"use client"
import { useState } from "react"
import api from "@/lib/axios"
import { useAuth } from "@/hooks/useAuth"
import toast from "react-hot-toast"
import Link from "next/link"

export default function AddReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating]   = useState(5)
  const [hover, setHover]     = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const { isAuthenticated }   = useAuth()

  if (!isAuthenticated) return (
    <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 24, fontFamily: "'Inter',sans-serif" }}>
      <Link href="/login" style={{ color: "var(--accent)", fontWeight: 500, textDecoration: "none" }}>Login</Link> to leave a review
    </p>
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment })
      toast.success("Review added!")
      setComment("")
      setRating(5)
      onReviewAdded()
    } catch {
      toast.error("Failed to add review")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 32 }}>
      <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
        Write a Review
      </h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Star selector */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 8, fontFamily: "'Inter',sans-serif" }}>Your Rating</p>
          <div style={{ display: "flex", gap: 6 }}>
            {[1,2,3,4,5].map(star => (
              <button key={star} type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                <svg width="24" height="24" fill={(hover || rating) >= star ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="1.5" viewBox="0 0 24 24" style={{ transition: "fill 0.15s" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 8, fontFamily: "'Inter',sans-serif" }}>Your Review</p>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="lux-input"
            style={{ resize: "none", height: 96, lineHeight: 1.6 }}
            required />
        </div>

        <button type="submit" disabled={loading} className="btn-primary"
          style={{ alignSelf: "flex-start", padding: "11px 28px", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  )
}