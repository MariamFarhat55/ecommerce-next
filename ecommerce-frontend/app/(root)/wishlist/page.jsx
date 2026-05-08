"use client"
import { useWishlist } from "@/hooks/useWishlist"
import { useCart }     from "@/hooks/useCart"
import toast from "react-hot-toast"
import Link from "next/link"

const IconX = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
  </svg>
)
const IconCart = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
  </svg>
)

export default function WishlistPage() {
  const { items, toggleItem } = useWishlist()
  const { addItem }           = useCart()

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 64, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <svg width="64" height="64" fill="none" stroke="var(--text3)" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 700, color: "var(--text)" }}>
          Your wishlist is empty
        </h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Save items you love to your wishlist</p>
        <Link href="/products" className="btn-primary" style={{ marginTop: 8 }}>Discover Products</Link>
      </div>
    )
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          My Wishlist
        </h1>
        <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 32 }}>{items.length} saved items</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
          {items.map((product) => (
            <div key={product._id} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ position: "relative", aspectRatio: "1" }}>
                <img src={product.images?.[0] ?? "/placeholder.png"} alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <button onClick={() => toggleItem(product)}
                  style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.9)"}>
                  <IconX />
                </button>
              </div>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "'Syne',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {product.name}
                </p>
                <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "'Syne',sans-serif" }}>
                  ${product.price}
                </p>
                <button
                  onClick={() => { addItem(product); toast.success("Added to cart!") }}
                  className="btn-primary"
                  style={{ width: "100%", padding: "10px", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <IconCart /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}