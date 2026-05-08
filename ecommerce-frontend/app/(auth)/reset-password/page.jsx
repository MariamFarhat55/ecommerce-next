"use client"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import api from "@/lib/axios"
import toast from "react-hot-toast"

const EyeIcon = ({ open }) => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    {open
      ? <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
      : <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
    }
  </svg>
)

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm]   = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const searchParams = useSearchParams()
  const router       = useRouter()
  const token        = searchParams.get("token")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) { toast.error("Passwords don't match"); return }
    if (password.length < 6)  { toast.error("Min. 6 characters"); return }
    setLoading(true)
    try {
      await api.post("/auth/reset-password", { token, password })
      toast.success("Password reset successfully!")
      router.push("/login")
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Link expired or invalid")
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex" }}>

      {/* Left — image */}
      <div style={{ flex:1, background:"#111", position:"relative", display:"flex" }}>
        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
          alt="Reset" style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.5 }} />
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:48 }}>
          <p style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:700, color:"#fff", lineHeight:1.3, marginBottom:12 }}>
            Set a new password
          </p>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>
            Choose something strong and memorable.
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>

          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:700, color:"var(--text)", marginBottom:6, letterSpacing:"-0.02em" }}>
            Set new password
          </h1>
          <p style={{ fontSize:14, color:"var(--text2)", marginBottom:28, lineHeight:1.7 }}>
            Must be at least 6 characters.
          </p>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:500, color:"var(--text2)", display:"block", marginBottom:6 }}>New Password</label>
              <div style={{ position:"relative" }}>
                <input type={showPass ? "text" : "password"} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="lux-input" style={{ paddingRight:44 }} required />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--text2)", display:"flex" }}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize:12, fontWeight:500, color:"var(--text2)", display:"block", marginBottom:6 }}>Confirm Password</label>
              <input type="password" placeholder="••••••••"
                value={confirm} onChange={e => setConfirm(e.target.value)}
                className="lux-input" required />
              {confirm && password !== confirm && (
                <p style={{ fontSize:12, color:"#EF4444", marginTop:6, display:"flex", alignItems:"center", gap:4 }}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6"/></svg>
                  Passwords don't match
                </p>
              )}
              {confirm && password === confirm && confirm.length >= 6 && (
                <p style={{ fontSize:12, color:"#16A34A", marginTop:6, display:"flex", alignItems:"center", gap:4 }}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Passwords match
                </p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width:"100%", padding:"13px", fontSize:15, marginTop:4, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Resetting..." : "Reset Password →"}
            </button>
          </form>

          <p style={{ textAlign:"center", marginTop:24, fontSize:14, color:"var(--text2)" }}>
            <Link href="/login" style={{ color:"var(--accent)", fontWeight:500, textDecoration:"none" }}>
              ← Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}