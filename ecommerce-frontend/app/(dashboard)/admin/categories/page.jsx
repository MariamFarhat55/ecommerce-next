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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [newName, setNewName]       = useState("")
  const [loading, setLoading]       = useState(true)

  useEffect(() => { fetchCats() }, [])

  const fetchCats = () => {
    api.get("/admin/categories")
      .then(r => setCategories(r.data.categories))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const addCategory = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      await api.post("/admin/categories", { name: newName })
      toast.success("Category added")
      setNewName("")
      fetchCats()
    } catch { toast.error("Failed to add") }
  }

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return
    try {
      await api.delete(`/admin/categories/${id}`)
      toast.success("Category deleted")
      fetchCats()
    } catch { toast.error("Failed to delete") }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Categories</h1>
        <p style={{ fontSize: 14, color: "var(--text2)" }}>{categories.length} categories</p>
      </div>

      {/* Add form */}
      <form onSubmit={addCategory} style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <input value={newName} onChange={e => setNewName(e.target.value)}
          placeholder="New category name..." className="lux-input" style={{ flex: 1 }} />
        <button type="submit" className="btn-primary" style={{ whiteSpace: "nowrap", padding: "11px 24px" }}>
          Add Category
        </button>
      </form>

      {/* List */}
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        {categories.length === 0 ? (
          <p style={{ padding: 48, textAlign: "center", color: "var(--text2)", fontSize: 14 }}>No categories yet</p>
        ) : categories.map((cat, i) => (
          <div key={cat._id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 20px",
            borderBottom: i < categories.length - 1 ? "1px solid var(--border)" : "none",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {cat.image && (
                <img src={cat.image} alt={cat.name}
                  style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", border: "1px solid var(--border)" }} />
              )}
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", fontFamily: "'Inter',sans-serif" }}>
                {cat.name}
              </span>
            </div>
            <button onClick={() => deleteCategory(cat._id)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)", cursor: "pointer", fontSize: 13, color: "#EF4444", fontFamily: "'Inter',sans-serif", transition: "all 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.05)"}>
              <IconTrash /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}