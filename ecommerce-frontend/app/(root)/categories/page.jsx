"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import api from "@/lib/axios"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    api.get("/categories")
      .then(r => setCategories(r.data.categories))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          All Categories
        </h1>
        <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 36 }}>
          {categories.length} categories available
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {categories.map(cat => (
            <Link key={cat._id} href={`/products?category=${cat.name.toLowerCase()}`}
              style={{ textDecoration: "none" }}>
              <div style={{
                background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14,
                overflow: "hidden", cursor: "pointer", transition: "all 0.25s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; e.currentTarget.style.borderColor = "var(--accent)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--border)" }}>
                {cat.image && (
                  <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                    <img src={cat.image} alt={cat.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                  </div>
                )}
                <div style={{ padding: "16px 18px" }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", fontFamily: "'Syne',sans-serif" }}>
                    {cat.name}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>Shop now →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}