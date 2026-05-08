"use client"
import { useState, useEffect } from "react"
import api from "@/lib/axios"
import Link from "next/link"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

const STATUS_STYLE = {
  pending:    { background: "rgba(234,179,8,0.1)",  color: "#CA8A04" },
  processing: { background: "rgba(59,130,246,0.1)", color: "#2563EB" },
  shipped:    { background: "rgba(139,92,246,0.1)", color: "#7C3AED" },
  delivered:  { background: "rgba(22,163,74,0.1)",  color: "#16A34A" },
  cancelled:  { background: "rgba(239,68,68,0.1)",  color: "#EF4444" },
}

export default function OrdersPage() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/orders/my-orders")
      .then(r => setOrders(r.data.orders))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  if (orders.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 64, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <svg width="64" height="64" fill="none" stroke="var(--text3)" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 700, color: "var(--text)" }}>No orders yet</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Your order history will appear here</p>
        <Link href="/products" className="btn-primary" style={{ marginTop: 8 }}>Start Shopping</Link>
      </div>
    )
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          My Orders
        </h1>
        <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 32 }}>{orders.length} orders</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((order) => (
            <Link key={order._id} href={`/orders/${order._id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", fontFamily: "'Syne',sans-serif" }}>
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>
                    {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <span style={{ ...(STATUS_STYLE[order.status] ?? STATUS_STYLE.pending), padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 500, fontFamily: "'Inter',sans-serif", textTransform: "capitalize" }}>
                    {order.status}
                  </span>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "'Syne',sans-serif" }}>
                    ${order.total?.toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}