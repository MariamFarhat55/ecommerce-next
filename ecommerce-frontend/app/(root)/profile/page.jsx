"use client"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import LoyaltyWidget from "@/components/marketing/LoyaltyWidget"
import ReferralBanner from "@/components/marketing/ReferralBanner"

export default function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name:    user?.name    ?? "",
    phone:   user?.phone   ?? "",
    address: user?.address ?? "",
    city:    user?.city    ?? "",
    country: user?.country ?? "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.patch("/users/profile", form)
      toast.success("Profile updated!")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false) }
  }

  const Section = ({ title, children }) => (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "'Syne',sans-serif", marginBottom: 16 }}>{title}</p>
      {children}
    </div>
  )

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, fontFamily: "'Syne',sans-serif", flexShrink: 0 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>
              {user?.name}
            </h1>
            <p style={{ fontSize: 13, color: "var(--text2)", fontFamily: "'Inter',sans-serif" }}>{user?.email}</p>
          </div>
        </div>

        <LoyaltyWidget />
        <ReferralBanner />

        <form onSubmit={handleSubmit}>
          <Section title="Personal Info">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="lux-input" placeholder="Your name" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="lux-input" placeholder="01xxxxxxxxx" />
              </div>
            </div>
          </Section>

          <Section title="Default Address">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Street Address</label>
                <input name="address" value={form.address} onChange={handleChange} className="lux-input" placeholder="123 Main St" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>City</label>
                  <input name="city" value={form.city} onChange={handleChange} className="lux-input" placeholder="Cairo" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Country</label>
                  <input name="country" value={form.country} onChange={handleChange} className="lux-input" placeholder="Egypt" />
                </div>
              </div>
            </div>
          </Section>

          <button type="submit" disabled={loading} className="btn-primary"
            style={{ width: "100%", padding: "13px", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}