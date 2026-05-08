"use client"
import { useState, useEffect } from "react"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

const IconTrash = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
)

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = () => {
    api.get("/admin/products")
      .then(r => setProducts(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return
    try {
      await api.delete(`/admin/products/${id}`)
      toast.success("Product deleted")
      fetchProducts()
    } catch { toast.error("Failed to delete") }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Products</h1>
        <p style={{ fontSize: 14, color: "var(--text2)" }}>{products.length} total products</p>
      </div>

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Product", "Category", "Price", "Stock", "Seller", "Actions"].map(h => (
                <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--text2)", fontFamily: "'Inter',sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 48, textAlign: "center", color: "var(--text2)", fontSize: 14 }}>No products found</td></tr>
            ) : products.map((p, i) => (
              <tr key={p._id}
                style={{ borderBottom: i < products.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img src={p.images?.[0] ?? "/placeholder.png"} alt={p.name}
                      style={{ width: 42, height: 42, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", fontFamily: "'Inter',sans-serif" }}>{p.name}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>
                  {p.category?.name ?? p.category ?? "—"}
                </td>
                <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "'Inter',sans-serif" }}>
                  ${p.price}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{
                    padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 500, fontFamily: "'Inter',sans-serif",
                    background: p.stock > 0 ? "rgba(22,163,74,0.1)" : "rgba(239,68,68,0.1)",
                    color: p.stock > 0 ? "#16A34A" : "#EF4444",
                  }}>
                    {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                  </span>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>
                  {p.seller?.name ?? "—"}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <button onClick={() => deleteProduct(p._id)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)", cursor: "pointer", fontSize: 13, color: "#EF4444", fontFamily: "'Inter',sans-serif", transition: "all 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.05)"}>
                    <IconTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}