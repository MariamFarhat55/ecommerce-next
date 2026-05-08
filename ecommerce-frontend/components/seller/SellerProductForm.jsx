"use client"
import { useState, useEffect } from "react"
import api from "@/lib/axios"
import toast from "react-hot-toast"

const IconX = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
  </svg>
)

export default function SellerProductForm({ product, onClose, onSaved }) {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    name:        product?.name        ?? "",
    description: product?.description ?? "",
    price:       product?.price       ?? "",
    stock:       product?.stock       ?? "",
    category:    product?.category?._id ?? product?.category ?? "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get("/categories").then(r => setCategories(r.data.categories)).catch(() => {})
  }, [])

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (product) {
        await api.patch(`/seller/products/${product._id}`, form)
        toast.success("Product updated!")
      } else {
        await api.post("/seller/products", form)
        toast.success("Product added!")
      }
      onSaved()
    } catch {
      toast.error("Failed to save product")
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>{label}</label>
      {children}
    </div>
  )

  return (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: 28, marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)", display: "flex", alignItems: "center", padding: 4, borderRadius: 6, transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text2)"}>
          <IconX />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Product Name">
            <input name="name" placeholder="e.g. Classic White Sneakers" value={form.name} onChange={handleChange} className="lux-input" required />
          </Field>
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Description">
            <textarea name="description" placeholder="Describe your product..." value={form.description} onChange={handleChange} className="lux-input" style={{ resize: "none", height: 88, lineHeight: 1.6 }} required />
          </Field>
        </div>

        <Field label="Price ($)">
          <input name="price" type="number" placeholder="0.00" value={form.price} onChange={handleChange} className="lux-input" required />
        </Field>

        <Field label="Stock Quantity">
          <input name="stock" type="number" placeholder="0" value={form.stock} onChange={handleChange} className="lux-input" required />
        </Field>

        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Category">
            <select name="category" value={form.category} onChange={handleChange} className="lux-input" required>
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </Field>
        </div>

        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
          <button type="submit" disabled={loading} className="btn-primary"
            style={{ flex: 1, padding: "12px", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: "12px" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}