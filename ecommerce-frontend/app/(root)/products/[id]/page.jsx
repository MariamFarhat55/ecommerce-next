"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import api from "@/lib/axios"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import toast from "react-hot-toast"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import ReviewsList from "@/components/products/ReviewsList"
import AddReviewForm from "@/components/products/AddReviewForm"

const IconHeart = ({ filled }) => (
  <svg width="20" height="20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
  </svg>
)
const IconCart = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
  </svg>
)

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct]           = useState(null)
  const [loading, setLoading]           = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty]                   = useState(1)
  const { addItem }                     = useCart()
  const { toggleItem, isWishlisted }    = useWishlist()

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data.product))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner />
  if (!product) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)", paddingTop: 64 }}>
      Product not found
    </div>
  )

  const wishlisted = isWishlisted(product._id)

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56 }}>

          {/* Images */}
          <div>
            <div style={{ borderRadius: 16, overflow: "hidden", background: "var(--bg2)", border: "1px solid var(--border)", aspectRatio: "1" }}>
              <img src={product.images?.[selectedImage] ?? "/placeholder.png"} alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {product.images.map((img, i) => (
                  <img key={i} src={img} onClick={() => setSelectedImage(i)}
                    style={{ width: 64, height: 64, objectFit: "cover", cursor: "pointer", borderRadius: 8,
                      border: `2px solid ${selectedImage === i ? "var(--accent)" : "var(--border)"}`,
                      transition: "border-color 0.2s" }} />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            <p style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>
              {product.category?.name ?? product.category}
            </p>

            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, color: "var(--text)", lineHeight: 1.2 }}>
              {product.name}
            </h1>

            <p style={{ fontSize: 30, fontWeight: 700, fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
              ${product.price}
            </p>

            <span style={{
              display: "inline-block", width: "fit-content", padding: "5px 14px", borderRadius: 100,
              fontSize: 12, fontWeight: 500, fontFamily: "'Inter',sans-serif",
              background: product.stock > 0 ? "rgba(22,163,74,0.1)" : "rgba(239,68,68,0.1)",
              color: product.stock > 0 ? "#16A34A" : "#EF4444",
            }}>
              {product.stock > 0 ? `In Stock — ${product.stock} left` : "Out of Stock"}
            </span>

            <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8, fontFamily: "'Inter',sans-serif" }}>
              {product.description}
            </p>

            {/* Qty */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>Qty</span>
              <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: 36, height: 40, background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--text2)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}>−</button>
                <span style={{ minWidth: 36, textAlign: "center", fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "'Inter',sans-serif", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)", height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {qty}
                </span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  style={{ width: 36, height: 40, background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--text2)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
              <button onClick={() => { addItem({ ...product, qty }); toast.success("Added to cart!") }}
                disabled={product.stock === 0} className="btn-primary"
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", fontSize: 15, opacity: product.stock === 0 ? 0.4 : 1, cursor: product.stock === 0 ? "not-allowed" : "pointer" }}>
                <IconCart /> Add to Cart
              </button>
              <button onClick={() => toggleItem(product)}
                style={{ width: 52, height: 52, borderRadius: 10, border: `1px solid ${wishlisted ? "#EF4444" : "var(--border)"}`, background: wishlisted ? "rgba(239,68,68,0.08)" : "var(--bg2)", color: wishlisted ? "#EF4444" : "var(--text2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}>
                <IconHeart filled={wishlisted} />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ marginTop: 72, borderTop: "1px solid var(--border)", paddingTop: 48 }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 700, color: "var(--text)", marginBottom: 28 }}>
            Reviews
          </h2>
          <AddReviewForm productId={id} onReviewAdded={() => window.location.reload()} />
          <ReviewsList productId={id} />
        </div>
      </div>
    </div>
  )
}