"use client"
import { useState } from "react"
import Link from "next/link"
import api from "@/lib/axios"
import toast from "react-hot-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("")
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post("/auth/forgot-password", { email })
      setSent(true)
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Something went wrong")
    } finally { setLoading(false) }
  }

  if (sent) return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, padding:24, textAlign:"center" }}>
      <div style={{ width:72, height:72, borderRadius:"50%", background:"var(--bg2)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"var(--shadow-md)" }}>
        <svg width="32" height="32" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      </div>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:700, color:"var(--text)" }}>
        Check your email
      </h2>
      <p style={{ fontSize:14, color:"var(--text2)", maxWidth:320, lineHeight:1.7 }}>
        We sent a reset link to <strong style={{ color:"var(--text)" }}>{email}</strong>
      </p>
      <Link href="/login" className="btn-primary" style={{ marginTop:8 }}>Back to Login</Link>
    </div>
  )

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex" }}>

      {/* Left — image */}
      <div style={{ flex:1, background:"#111", position:"relative", display:"flex" }}>
        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
          alt="Reset" style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.5 }} />
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:48 }}>
          <p style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:700, color:"#fff", lineHeight:1.3, marginBottom:12 }}>
            Forgot your password?
          </p>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>
            No worries — we'll send you a reset link in seconds.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 32px" }}>
        <div style={{ width:"100%", maxWidth:400 }}>

          <Link href="/" style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, color:"var(--text)", textDecoration:"none", display:"block", marginBottom:40 }}>
            Shoply.
          </Link>

          <div style={{ width:48, height:48, borderRadius:12, background:"var(--bg2)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20, boxShadow:"var(--shadow)" }}>
            <svg width="22" height="22" fill="none" stroke="var(--text2)" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>

          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:700, color:"var(--text)", marginBottom:6, letterSpacing:"-0.02em" }}>
            Forgot password?
          </h1>
          <p style={{ fontSize:14, color:"var(--text2)", marginBottom:28, lineHeight:1.7 }}>
            Enter your email and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:500, color:"var(--text2)", display:"block", marginBottom:6 }}>Email address</label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} className="lux-input" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width:"100%", padding:"13px", fontSize:15, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Sending..." : "Send Reset Link →"}
            </button>
          </form>

          <p style={{ textAlign:"center", marginTop:24, fontSize:14, color:"var(--text2)" }}>
            Remember it?{" "}
            <Link href="/login" style={{ color:"var(--accent)", fontWeight:500, textDecoration:"none" }}>
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}