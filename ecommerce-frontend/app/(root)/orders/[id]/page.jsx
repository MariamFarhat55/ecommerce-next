"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import api from "@/lib/axios"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import OrderTracking from "@/components/orders/OrderTracking"

const STATUS_STYLE = {
  pending:    { background: "rgba(234,179,8,0.1)",  color: "#CA8A04" },
  processing: { background: "rgba(59,130,246,0.1)", color: "#2563EB" },
  shipped:    { background: "rgba(139,92,246,0.1)", color: "#7C3AED" },
  delivered:  { background: "rgba(22,163,74,0.1)",  color: "#16A34A" },
  cancelled:  { background: "rgba(239,68,68,0.1)",  color: "#EF4444" },
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(false)

useEffect(() => {
  if (!id) return;

  const fetchOrder = async () => {
    setLoading(true);

    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchOrder();
}, [id]);

  if (!id || loading) return <LoadingSpinner />
  if (!order) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)", paddingTop: 64 }}>
      Order not found
    </div>
  )

  const Section = ({ title, children }) => (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 16 }}>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>{title}</h2>
      {children}
    </div>
  )

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
              Order #{order._id.slice(-6).toUpperCase()}
            </h1>
            <p style={{ fontSize: 14, color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>
              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <span style={{ ...(STATUS_STYLE[order.status] ?? STATUS_STYLE.pending), padding: "6px 14px", borderRadius: 100, fontSize: 13, fontWeight: 500, fontFamily: "'Inter',sans-serif", textTransform: "capitalize" }}>
            {order.status}
          </span>
        </div>

        {/* Tracking */}
        <Section title="Order Status">
          <OrderTracking status={order.status} />
        </Section>

        {/* Items */}
        <Section title="Items">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {order.items?.map((item, i) => (
              <div key={item._id ?? i} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <img src={item.images?.[0] ?? "/placeholder.png"} alt={item.name}
                  style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover", border: "1px solid var(--border)" }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", fontFamily: "'Inter',sans-serif" }}>{item.name}</p>
                  <p style={{ fontSize: 13, color: "var(--text2)" }}>Qty: {item.qty}</p>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Syne',sans-serif" }}>
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Shipping */}
        <Section title="Shipping Address">
          <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>{order.shipping?.fullName}</p>
          <p style={{ fontSize: 14, color: "var(--text2)" }}>{order.shipping?.address}</p>
          <p style={{ fontSize: 14, color: "var(--text2)" }}>{order.shipping?.city}, {order.shipping?.country}</p>
          <p style={{ fontSize: 14, color: "var(--text2)" }}>{order.shipping?.phone}</p>
        </Section>

        {/* Payment Summary */}
        <Section title="Payment Summary">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Subtotal", value: `$${order.subtotal?.toFixed(2) ?? "—"}` },
              { label: "Shipping", value: `$${order.shippingCost?.toFixed(2) ?? "0.00"}` },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "var(--text2)" }}>{r.label}</span>
                <span style={{ color: "var(--text)" }}>{r.value}</span>
              </div>
            ))}
            {order.discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "#16A34A" }}>Discount</span>
                <span style={{ color: "#16A34A" }}>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <span style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>Total</span>
              <span style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>${order.total?.toFixed(2)}</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text2)", textTransform: "capitalize" }}>
              Paid via {order.paymentMethod}
            </p>
          </div>
        </Section>

        {/* Cancel */}
        {order.status === "pending" && (
          <button
            onClick={async () => {
              await api.patch(`/orders/${id}/cancel`)
              setOrder({ ...order, status: "cancelled" })
            }}
            style={{ width: "100%", padding: "14px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)", color: "#EF4444", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.05)"}>
            Cancel Order
          </button>
        )}
      </div>
    </div>
  )
}