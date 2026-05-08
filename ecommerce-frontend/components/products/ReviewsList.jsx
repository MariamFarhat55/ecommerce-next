"use client"
import { useState, useEffect } from "react"
import api from "@/lib/axios"

const Stars = ({ rating }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1,2,3,4,5].map(s => (
      <svg key={s} width="14" height="14" fill={s <= rating ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
      </svg>
    ))}
  </div>
)

export default function ReviewsList({ productId }) {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    api.get(`/products/${productId}/reviews`)
      .then(r => setReviews(r.data.reviews))
      .catch(err => console.error(err))
  }, [productId])

  if (reviews.length === 0) return (
    <p style={{ color: "var(--text2)", fontSize: 14, fontFamily: "'Inter',sans-serif", marginTop: 8 }}>
      No reviews yet. Be the first!
    </p>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
      {reviews.map(review => (
        <div key={review._id} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "'Syne',sans-serif" }}>
              {review.user?.name ?? "Anonymous"}
            </span>
            <Stars rating={review.rating} />
          </div>
          <p style={{ fontSize: 14, color: "var(--text2)", fontFamily: "'Inter',sans-serif", lineHeight: 1.6 }}>
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  )
}