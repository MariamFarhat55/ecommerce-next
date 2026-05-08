"use client"
import { useState, useEffect } from "react"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"]

const STATUS_STYLE = {
  pending:    { background: "rgba(234,179,8,0.1)",   color: "#CA8A04" },
  processing: { background: "rgba(59,130,246,0.1)",  color: "#2563EB" },
  shipped:    { background: "rgba(139,92,246,0.1)",  color: "#7C3AED" },
  delivered:  { background: "rgba(22,163,74,0.1)",   color: "#16A34A" },
  cancelled:  { background: "rgba(239,68,68,0.1)",   color: "#EF4444" },
}

export default function SellerOrdersPage() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/seller/orders")
      .then(r => setOrders(r.data.orders))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/seller/orders/${orderId}/status`, { status })
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o))
      toast.success("Status updated")
    } catch {
      toast.error("Failed to update")
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          Orders
        </h1>
        <p style={{ fontSize: 14, color: "var(--text2)" }}>{orders.length} total orders</p>
      </div>

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Order ID", "Customer", "Total", "Status", "Update"].map(h => (
                <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--text2)", fontFamily: "'Inter',sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 48, textAlign: "center", color: "var(--text2)", fontSize: 14 }}>
                  No orders yet
                </td>
              </tr>
            ) : orders.map((order, i) => (
              <tr key={order._id}
                style={{ borderBottom: i < orders.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                <td style={{ padding: "16px 20px", fontFamily: "monospace", fontSize: 13, color: "var(--text2)", fontWeight: 600 }}>
                  #{order._id.slice(-6).toUpperCase()}
                </td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "var(--text)", fontFamily: "'Inter',sans-serif" }}>
                  {order.user?.name ?? "—"}
                </td>
                <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "'Inter',sans-serif" }}>
                  ${order.total?.toFixed(2)}
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ ...STATUS_STYLE[order.status], padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 500, fontFamily: "'Inter',sans-serif", textTransform: "capitalize" }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order._id, e.target.value)}
                    className="lux-input"
                    style={{ width: "auto", padding: "6px 10px", fontSize: 13 }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}