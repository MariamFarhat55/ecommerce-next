"use client"
import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import toast from "react-hot-toast"

export default function ProductCard({ product }) {
  const { addItem }               = useCart()
  const { toggleItem, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product._id)

  return (
    <Link href={`/products/${product._id}`} className="product-card">

      {/* Image */}
      <div className="card-img" style={{ position:"relative", aspectRatio:"1", overflow:"hidden", background:"var(--bg3)" }}>
        <img
          src={product.images?.[0] ?? "/placeholder.png"}
          alt={product.name}
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
        />

        {/* Discount badge */}
        {product.discount > 0 && (
          <div style={{ position:"absolute", top:10, left:10, padding:"3px 8px", background:"#111", color:"#fff", fontSize:11, fontWeight:600, borderRadius:100, fontFamily:"'Inter',sans-serif" }}>
            -{product.discount}%
          </div>
        )}

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div style={{ position:"absolute", inset:0, background:"rgba(245,240,235,0.85)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span className="badge-red">Sold Out</span>
          </div>
        )}

        {/* Wishlist btn */}
        <button onClick={(e) => { e.preventDefault(); toggleItem(product) }}
          className="card-wish"
          style={{ position:"absolute", top:10, right:10, width:34, height:34, borderRadius:"50%", background:"rgba(255,255,255,0.96)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"var(--shadow)" }}>
          <svg width="15" height="15" fill={wishlisted ? "#EF4444" : "none"} stroke={wishlisted ? "#EF4444" : "var(--text2)"} strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>

        {/* Add to cart hover action */}
        <div className="card-actions" style={{ position:"absolute", bottom:0, left:0, right:0, padding:10, background:"rgba(255,255,255,0.97)", borderTop:"1px solid var(--border)" }}>
          <button
            onClick={(e) => {
              e.preventDefault()
              if (product.stock > 0) { addItem(product); toast.success("Added to cart!") }
            }}
            disabled={product.stock === 0}
            style={{ width:"100%", padding:"9px", background:"var(--accent)", color:"#fff", border:"none", borderRadius:6, fontSize:13, fontWeight:500, fontFamily:"'Inter',sans-serif", cursor: product.stock > 0 ? "pointer" : "not-allowed", opacity: product.stock === 0 ? 0.5 : 1, transition:"background 0.2s" }}
            onMouseEnter={e=>{ if(product.stock > 0) e.currentTarget.style.background="var(--accent2)" }}
            onMouseLeave={e=>{ e.currentTarget.style.background="var(--accent)" }}>
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding:"14px 16px 16px" }}>
        <p style={{ fontSize:11, color:"var(--text3)", fontWeight:500, marginBottom:3, fontFamily:"'Inter',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em" }}>
          {product.category?.name ?? product.category}
        </p>
        <p style={{ fontSize:14, fontWeight:600, color:"var(--text)", marginBottom:8, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"'Syne',sans-serif" }}>
          {product.name}
        </p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
            <p style={{ fontSize:16, fontWeight:700, color:"var(--text)", fontFamily:"'Syne',sans-serif" }}>
              ${product.price}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p style={{ fontSize:12, color:"var(--text3)", textDecoration:"line-through" }}>
                ${product.originalPrice}
              </p>
            )}
          </div>
          {product.stock > 0
            ? <span className="badge-dark" style={{ fontSize:11 }}>In Stock</span>
            : <span className="badge-red"  style={{ fontSize:11 }}>Sold out</span>
          }
        </div>
      </div>
    </Link>
  )
}