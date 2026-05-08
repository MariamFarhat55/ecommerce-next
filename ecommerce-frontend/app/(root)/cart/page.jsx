"use client"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

export default function CartPage() {
  const { items, clearCart, removeItem, updateQty, total } = useCart()
  const { isAuthenticated } = useAuth()
  const shipping = total > 100 ? 0 : 10

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "var(--bg)", paddingTop: 64 }}>
        <span style={{ fontSize: 64 }}>🛒</span>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: "var(--text)" }}>Your cart is empty</h2>
        <p style={{ color: "var(--text2)", fontSize: 15 }}>Add some products to get started</p>
        <Link href="/products" className="btn-primary" style={{ marginTop: 8 }}>Start Shopping</Link>
      </div>
    )
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>

        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 32, letterSpacing: "-0.02em" }}>
          Shopping Cart ({items.length} items)
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }}>

          {/* Cart Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {items.map((item) => (
              <div key={item._id} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 16, alignItems: "center" }}>
                <img src={item.images?.[0] ?? "/placeholder.png"} alt={item.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, background: "var(--bg3)" }} />

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>{item.name}</p>
                  <p style={{ fontSize: 13, color: "var(--text2)" }}>${item.price} each</p>
                </div>

                {/* Qty controls */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--border)", borderRadius: 8, padding: "6px 12px" }}>
                  <button onClick={() => { if (item.qty === 1) removeItem(item._id); else updateQty(item._id, item.qty - 1) }}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--text2)", lineHeight: 1, padding: "0 2px" }}>
                    −
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item._id, item.qty + 1)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--text2)", lineHeight: 1, padding: "0 2px" }}>
                    +
                  </button>
                </div>

                <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "'Syne', sans-serif", minWidth: 70, textAlign: "right" }}>
                  ${(item.price * item.qty).toFixed(2)}
                </p>

                <button onClick={() => removeItem(item._id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: 18, padding: 4, borderRadius: 4, transition: "color 0.2s" }}>
                  ✕
                </button>
              </div>
            ))}

            <button onClick={clearCart} style={{ alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#EF4444", fontFamily: "'Inter', sans-serif" }}>
              Clear cart
            </button>
          </div>

          {/* Order Summary */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, position: "sticky", top: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
              Order Summary
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {items.map(item => (
                <div key={item._id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "var(--text2)" }}>{item.name} × {item.qty}</span>
                  <span style={{ color: "var(--text)", fontWeight: 500 }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "var(--text2)" }}>Subtotal</span>
                <span style={{ color: "var(--text)", fontWeight: 500 }}>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "var(--text2)" }}>Shipping</span>
                <span style={{ color: shipping === 0 ? "var(--gold)" : "var(--text)", fontWeight: 500 }}>
                  {shipping === 0 ? "Free 🎉" : `$${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p style={{ fontSize: 12, color: "var(--gold)", background: "rgba(22,163,74,0.08)", padding: "8px 12px", borderRadius: 6 }}>
                  Add ${(100 - total).toFixed(2)} more for free shipping!
                </p>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, marginTop: 8, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <span style={{ fontFamily: "'Syne', sans-serif", color: "var(--text)" }}>Total</span>
                <span style={{ fontFamily: "'Syne', sans-serif", color: "var(--text)" }}>${(total + shipping).toFixed(2)}</span>
              </div>
            </div>

            {isAuthenticated ? (
              <Link href="/checkout" className="btn-primary" style={{ width: "100%", marginTop: 20, padding: "14px", fontSize: 15 }}>
                Proceed to Checkout →
              </Link>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
                <Link href="/checkout" className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15 }}>
                  Guest Checkout →
                </Link>
                <Link href="/login" className="btn-secondary" style={{ width: "100%", padding: "13px", fontSize: 14 }}>
                  Login for faster checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}