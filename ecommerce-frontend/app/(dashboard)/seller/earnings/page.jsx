"use client"
import { useState, useEffect } from "react"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

const PAYOUT_STYLE = {
  completed: { background: "rgba(22,163,74,0.1)",  color: "#16A34A" },
  pending:   { background: "rgba(234,179,8,0.1)",  color: "#CA8A04" },
}

export default function SellerEarningsPage() {
  const [earnings, setEarnings] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [requesting, setRequesting] = useState(false)

  useEffect(() => {
    api.get("/seller/earnings")
      .then(r => setEarnings(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handlePayout = async () => {
    setRequesting(true)
    try {
      await api.post("/seller/payout")
      toast.success("Payout requested!")
    } catch {
      toast.error("Failed to request payout")
    } finally {
      setRequesting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  const summaryCards = [
    { label: "Total Earned",        value: `$${(earnings?.total     ?? 0).toFixed(2)}`, color: "var(--text)" },
    { label: "Available for Payout",value: `$${(earnings?.available ?? 0).toFixed(2)}`, color: "#16A34A"     },
    { label: "Pending",             value: `$${(earnings?.pending   ?? 0).toFixed(2)}`, color: "#CA8A04"     },
  ]

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          Earnings & Payouts
        </h1>
        <p style={{ fontSize: 14, color: "var(--text2)" }}>Track your revenue and request payouts</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
        {summaryCards.map(c => (
          <div key={c.label} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: "28px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "var(--text2)", fontFamily: "'Inter',sans-serif", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {c.label}
            </p>
            <p style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Syne',sans-serif", color: c.color }}>
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Payout Button */}
      <button
        onClick={handlePayout}
        disabled={requesting}
        className="btn-primary"
        style={{ marginBottom: 40, padding: "12px 28px", opacity: requesting ? 0.7 : 1 }}
      >
        {requesting ? "Requesting..." : "Request Payout"}
      </button>

      {/* Payout History */}
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>
        Payout History
      </h2>

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Date", "Amount", "Status"].map(h => (
                <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--text2)", fontFamily: "'Inter',sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!earnings?.payouts?.length ? (
              <tr>
                <td colSpan={3} style={{ padding: 48, textAlign: "center", color: "var(--text2)", fontSize: 14 }}>
                  No payouts yet
                </td>
              </tr>
            ) : earnings.payouts.map((p, i) => (
              <tr key={p._id}
                style={{ borderBottom: i < earnings.payouts.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>
                  {new Date(p.createdAt).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" })}
                </td>
                <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "'Inter',sans-serif" }}>
                  ${p.amount.toFixed(2)}
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ ...(PAYOUT_STYLE[p.status] ?? PAYOUT_STYLE.pending), padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 500, fontFamily: "'Inter',sans-serif", textTransform: "capitalize" }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}