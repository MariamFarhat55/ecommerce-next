"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import api from "@/lib/axios"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

const statCards = [
  { label: "Total Users",    key: "totalUsers",    icon: "👥" },
  { label: "Total Products", key: "totalProducts", icon: "📦" },
  { label: "Total Orders",   key: "totalOrders",   icon: "🛒" },
  { label: "Revenue",        key: "revenue",       icon: "💰", prefix: "$" },
]

const quickLinks = [
  { label: "Manage Users",      href: "/admin/users" },
  { label: "Manage Products",   href: "/admin/products" },
  { label: "Manage Orders",     href: "/admin/orders" },
  { label: "Manage Categories", href: "/admin/categories" },
  { label: "Promo Codes",       href: "/admin/promo" },
  { label: "Banners & Content", href: "/admin/content" },
]

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/admin/stats").then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ padding: "40px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "var(--text)", fontWeight: 400, marginBottom: 8 }}>
        Admin Panel
      </h1>
      <div style={{ width: 36, height: 1, background: "var(--gold)", marginBottom: 36 }} />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 40 }}>
        {statCards.map((s) => (
          <div key={s.key} style={{ background: "var(--bg2)", border: "1px solid var(--border)", padding: "24px 20px" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--text2)", marginBottom: 10, fontFamily: "'Poppins', sans-serif" }}>
              {s.icon} {s.label}
            </p>
            <p style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", color: "var(--text)", fontWeight: 400 }}>
              {s.prefix}{stats?.[s.key] ?? 0}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "var(--text)", marginBottom: 18 }}>
        Quick Access
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {quickLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="cat-card"
            style={{ padding: "24px 20px", textAlign: "left" }}
          >
            <p style={{ fontSize: 13, color: "var(--text)", fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
              {l.label}
            </p>
            <p style={{ fontSize: 11, color: "var(--gold)", marginTop: 6, fontFamily: "'Poppins', sans-serif" }}>
              Manage →
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}