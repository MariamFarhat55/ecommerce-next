"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import api from "@/lib/axios"
import toast from "react-hot-toast"

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "customer" })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return }
    setLoading(true)
    try {
      await api.post("/auth/register", form)
      toast.success("Account created! Please sign in.")
      router.push("/login")
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Registration failed")
    } finally { setLoading(false) }
  }

  const EyeIcon = ({ open }) => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      {open
        ? <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
        : <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
      }
    </svg>
  )

  const roles = [
    {
      value: "customer",
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
        </svg>
      ),
      label: "Shop",
      desc: "Buy products",
    },
    {
      value: "seller",
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
      ),
      label: "Sell",
      desc: "List my products",
    },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex" }}>

      {/* Left — image */}
      <div style={{ flex: 1, background: "#111", position: "relative", display: "flex" }}>
        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
          alt="Store" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 48 }}>
          <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 12 }}>
            Join thousands of buyers & sellers
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
            Create your free account and start shopping or selling today.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Logo */}
          <Link href="/" style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, color: "var(--text)", textDecoration: "none", display: "block", marginBottom: 36 }}>
            Shoply.
          </Link>

          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 700, color: "var(--text)", marginBottom: 4, letterSpacing: "-0.02em" }}>
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 28 }}>
            Already have one?{" "}
            <Link href="/login" style={{ color: "var(--accent)", fontWeight: 500, textDecoration: "none" }}>Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Name + Phone */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Full Name</label>
                <input name="name" placeholder="John Doe" onChange={handleChange} className="lux-input" required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Phone</label>
                <input name="phone" placeholder="01xxxxxxxxx" onChange={handleChange} className="lux-input" required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Email</label>
              <input name="email" type="email" placeholder="you@example.com" onChange={handleChange} className="lux-input" required />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input name="password" type={showPass ? "text" : "password"} placeholder="min. 6 characters"
                  onChange={handleChange} className="lux-input" style={{ paddingRight: 44 }} required />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text2)", display: "flex", alignItems: "center" }}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 8 }}>I want to</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {roles.map(r => {
                  const active = form.role === r.value
                  return (
                    <label key={r.value} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "14px 16px",
                      border: `2px solid ${active ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: 10, cursor: "pointer",
                      background: active ? "var(--bg3)" : "var(--bg2)",
                      transition: "all 0.2s",
                    }}>
                      <input type="radio" name="role" value={r.value} checked={active} onChange={handleChange} style={{ display: "none" }} />
                      <span style={{ color: active ? "var(--accent)" : "var(--text3)", flexShrink: 0 }}>{r.icon}</span>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "'Syne',sans-serif", lineHeight: 1.2 }}>{r.label}</p>
                        <p style={{ fontSize: 12, color: "var(--text2)" }}>{r.desc}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: "100%", padding: "13px", fontSize: 15, marginTop: 4, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>

          </form>

          <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 20, textAlign: "center", lineHeight: 1.6 }}>
            By creating an account you agree to our{" "}
            <span style={{ color: "var(--text2)", cursor: "pointer" }}>Terms of Service</span>
            {" & "}
            <span style={{ color: "var(--text2)", cursor: "pointer" }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}