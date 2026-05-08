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

export default function AdminPromoPage() {
  const [promos, setPromos]   = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState({ code: "", discount: "", type: "percentage", expiresAt: "" })

  useEffect(() => { fetchPromos() }, [])

  const fetchPromos = () => {
    api.get("/admin/promo")
      .then(r => setPromos(r.data.promos))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const addPromo = async (e) => {
    e.preventDefault()
    try {
      await api.post("/admin/promo", form)
      toast.success("Promo code added")
      setForm({ code: "", discount: "", type: "percentage", expiresAt: "" })
      fetchPromos()
    } catch { toast.error("Failed to add promo") }
  }

  const deletePromo = async (id) => {
    try {
      await api.delete(`/admin/promo/${id}`)
      toast.success("Promo deleted")
      fetchPromos()
    } catch { toast.error("Failed to delete") }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Promo Codes</h1>
        <p style={{ fontSize: 14, color: "var(--text2)" }}>{promos.length} active codes</p>
      </div>

      {/* Add form */}
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "'Syne',sans-serif", marginBottom: 16 }}>
          Add New Promo Code
        </p>
        <form onSubmit={addPromo} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Code</label>
            <input name="code" placeholder="e.g. SAVE20" value={form.code} onChange={handleChange} className="lux-input" required />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Discount Value</label>
            <input name="discount" type="number" placeholder="e.g. 20" value={form.discount} onChange={handleChange} className="lux-input" required />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="lux-input">
              <option value="percentage">Percentage %</option>
              <option value="fixed">Fixed Amount $</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Expires At (optional)</label>
            <input name="expiresAt" type="date" value={form.expiresAt} onChange={handleChange} className="lux-input" />
          </div>
          <button type="submit" className="btn-primary" style={{ gridColumn: "1 / -1", padding: "12px" }}>
            Add Promo Code
          </button>
        </form>
      </div>

      {/* List */}
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Code", "Discount", "Type", "Expires", "Actions"].map(h => (
                <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--text2)", fontFamily: "'Inter',sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {promos.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 48, textAlign: "center", color: "var(--text2)", fontSize: 14 }}>No promo codes yet</td></tr>
            ) : promos.map((p, i) => (
              <tr key={p._id}
                style={{ borderBottom: i < promos.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "var(--text)", background: "var(--bg3)", padding: "4px 10px", borderRadius: 6 }}>
                    {p.code}
                  </span>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "'Inter',sans-serif" }}>
                  {p.type === "percentage" ? `${p.discount}%` : `$${p.discount}`}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{
                    padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 500, fontFamily: "'Inter',sans-serif",
                    background: p.type === "percentage" ? "rgba(59,130,246,0.1)" : "rgba(22,163,74,0.1)",
                    color: p.type === "percentage" ? "#2563EB" : "#16A34A",
                  }}>
                    {p.type}
                  </span>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>
                  {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "No expiry"}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <button onClick={() => deletePromo(p._id)}
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