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
const IconPlus = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14"/>
  </svg>
)
const IconX = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
  </svg>
)

export default function AdminProductsPage() {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [saving, setSaving]         = useState(false)
  const [form, setForm]             = useState({ name: "", description: "", price: "", stock: "", category: "", images: "" })

  useEffect(() => { fetchAll() }, [])

  const fetchAll = () => {
    Promise.all([
      api.get("/admin/products"),
      api.get("/categories"),
    ]).then(([p, c]) => {
      setProducts(p.data.products)
      setCategories(c.data.categories)
    }).catch(() => {}).finally(() => setLoading(false))
  }

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post("/admin/products", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images ? form.images.split(",").map(s => s.trim()).filter(Boolean) : [],
      })
      toast.success("Product added!")
      setForm({ name: "", description: "", price: "", stock: "", category: "", images: "" })
      setShowForm(false)
      fetchAll()
    } catch { toast.error("Failed to add product") }
    finally { setSaving(false) }
  }

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return
    try {
      await api.delete(`/admin/products/${id}`)
      setProducts(prev => prev.filter(p => p._id !== id))
      toast.success("Product deleted")
    } catch { toast.error("Failed to delete") }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Products</h1>
          <p style={{ fontSize: 14, color: "var(--text2)" }}>{products.length} total products</p>
        </div>
        <button onClick={() => setShowForm(p => !p)} className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px" }}>
          {showForm ? <><IconX /> Cancel</> : <><IconPlus /> Add Product</>}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: 28, marginBottom: 24 }}>
          <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>Add New Product</p>
          <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Product Name</label>
              <input name="name" placeholder="e.g. Classic White Sneakers" value={form.name} onChange={handleChange} className="lux-input" required />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Description</label>
              <textarea name="description" placeholder="Product description..." value={form.description} onChange={handleChange} className="lux-input" style={{ resize: "none", height: 80 }} required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Price ($)</label>
              <input name="price" type="number" placeholder="0.00" value={form.price} onChange={handleChange} className="lux-input" required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Stock</label>
              <input name="stock" type="number" placeholder="0" value={form.stock} onChange={handleChange} className="lux-input" required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="lux-input" required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Image URLs (comma separated)</label>
              <input name="images" placeholder="https://..." value={form.images} onChange={handleChange} className="lux-input" />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
              <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, padding: "12px", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Adding..." : "Add Product"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" style={{ flex: 1, padding: "12px" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
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
                <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>{p.category?.name ?? "—"}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "'Inter',sans-serif" }}>${p.price}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{
                    padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 500, fontFamily: "'Inter',sans-serif",
                    background: p.stock > 0 ? "rgba(22,163,74,0.1)" : "rgba(239,68,68,0.1)",
                    color: p.stock > 0 ? "#16A34A" : "#EF4444",
                  }}>
                    {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                  </span>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>{p.seller?.name ?? "—"}</td>
                <td style={{ padding: "14px 20px" }}>
                  <button onClick={() => deleteProduct(p._id)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)", cursor: "pointer", fontSize: 13, color: "#EF4444", fontFamily: "'Inter',sans-serif" }}
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