"use client"
import { useState, useEffect } from "react"
import api from "@/lib/axios"
import Link from "next/link"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

export default function SellerDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/seller/stats")
      .then(r => setStats(r.data))
      .catch(err => console.error("Failed to fetch stats", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const statCards = [
    { label: "Total Products", value: stats?.totalProducts ?? 0,                         icon: "📦" },
    { label: "Total Orders",   value: stats?.totalOrders   ?? 0,                         icon: "🛒" },
    { label: "Total Earnings", value: `$${(stats?.totalEarnings ?? 0).toFixed(2)}`,      icon: "💰" },
    { label: "Pending Orders", value: stats?.pendingOrders ?? 0,                         icon: "⏳" },
  ]

  const quickLinks = [
    { label: "Manage Products", href: "/seller/products", desc: "Add & edit your listings" },
    { label: "View Orders",     href: "/seller/orders",   desc: "Track customer orders"    },
    { label: "Earnings",        href: "/seller/earnings", desc: "Payouts & revenue"        },
  ]

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
        Seller Dashboard
      </h1>
      <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 32 }}>
        Welcome back! Here's an overview of your store.
      </p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "24px 20px",
            textAlign: "center",
          }}>
            <p style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</p>
            <p style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: "var(--text)", marginBottom: 4 }}>
              {s.value}
            </p>
            <p style={{ fontSize: 12, color: "var(--text2)", fontFamily: "'Inter', sans-serif" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>
        Quick Access
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {quickLinks.map((l) => (
          <Link key={l.href} href={l.href} style={{ textDecoration: "none" }}>
            <div style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "24px 20px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)"
                e.currentTarget.style.boxShadow = "var(--shadow-md)"
                e.currentTarget.style.borderColor = "var(--accent)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "none"
                e.currentTarget.style.borderColor = "var(--border)"
              }}
            >
              <p style={{ fontSize: 15, fontWeight: 600, fontFamily: "'Syne', sans-serif", color: "var(--text)", marginBottom: 6 }}>
                {l.label}
              </p>
              <p style={{ fontSize: 12, color: "var(--text2)", fontFamily: "'Inter', sans-serif" }}>
                {l.desc}
              </p>
              <p style={{ fontSize: 12, color: "var(--accent)", marginTop: 10, fontWeight: 500 }}>
                Open →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}