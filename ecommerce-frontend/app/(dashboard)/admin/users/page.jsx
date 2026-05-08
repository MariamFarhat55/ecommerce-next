"use client"
import { useState, useEffect } from "react"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

const ROLE_STYLE = {
  customer: { background: "rgba(59,130,246,0.1)",  color: "#2563EB" },
  seller:   { background: "rgba(234,179,8,0.1)",   color: "#CA8A04" },
  admin:    { background: "rgba(139,92,246,0.1)",  color: "#7C3AED" },
}

const IconTrash = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
)

export default function AdminUsersPage() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/admin/users")
      .then(r => setUsers(r.data.users))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleStatus = async (id, active) => {
    try {
      await api.patch(`/admin/users/${id}`, { active: !active })
      setUsers(prev => prev.map(u => u._id === id ? { ...u, active: !active } : u))
      toast.success(active ? "User restricted" : "User approved")
    } catch { toast.error("Failed to update user") }
  }

  const deleteUser = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers(prev => prev.filter(u => u._id !== id))
      toast.success("User deleted")
    } catch { toast.error("Failed to delete user") }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Users</h1>
        <p style={{ fontSize: 14, color: "var(--text2)" }}>{users.length} registered users</p>
      </div>

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Name", "Email", "Phone", "Role", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--text2)", fontFamily: "'Inter',sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 48, textAlign: "center", color: "var(--text2)", fontSize: 14 }}>No users found</td></tr>
            ) : users.map((u, i) => (
              <tr key={u._id}
                style={{ borderBottom: i < users.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", fontFamily: "'Inter',sans-serif" }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>{u.email}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>{u.phone ?? "—"}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ ...(ROLE_STYLE[u.role] ?? ROLE_STYLE.customer), padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 500, fontFamily: "'Inter',sans-serif", textTransform: "capitalize" }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{
                    padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 500, fontFamily: "'Inter',sans-serif",
                    background: u.active ? "rgba(22,163,74,0.1)" : "rgba(239,68,68,0.1)",
                    color: u.active ? "#16A34A" : "#EF4444",
                  }}>
                    {u.active ? "Active" : "Restricted"}
                  </span>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {/* Approve / Restrict */}
                    <button onClick={() => toggleStatus(u._id, u.active)}
                      style={{
                        padding: "7px 14px", borderRadius: 8,
                        border: `1px solid ${u.active ? "rgba(239,68,68,0.2)" : "rgba(22,163,74,0.2)"}`,
                        background: u.active ? "rgba(239,68,68,0.05)" : "rgba(22,163,74,0.05)",
                        cursor: "pointer", fontSize: 13, fontFamily: "'Inter',sans-serif",
                        color: u.active ? "#EF4444" : "#16A34A", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                      {u.active ? "Restrict" : "Approve"}
                    </button>

                    {/* Delete — مش بيحذف الـ admin نفسه */}
                    {u.role !== "admin" && (
                      <button onClick={() => deleteUser(u._id, u.name)}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)", cursor: "pointer", fontSize: 13, color: "#EF4444", fontFamily: "'Inter',sans-serif", transition: "all 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.05)"}>
                        <IconTrash /> Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}