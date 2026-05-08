"use client"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import toast from "react-hot-toast"

const IconShare = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
  </svg>
)

export default function ReferralBanner() {
  const { user, isAuthenticated } = useAuth()
  const [copied, setCopied]       = useState(false)

  if (!isAuthenticated) return null

  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}?ref=${user?._id}`
    : ""

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success("Referral link copied!")
    setTimeout(() => setCopied(false), 3000)
  }

  const shareOnSocial = (platform) => {
    const text = "Check out Shoply — amazing products at great prices!"
    const urls = {
      twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + referralLink)}`,
    }
    window.open(urls[platform], "_blank")
  }

  return (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <IconShare />
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "'Syne',sans-serif" }}>Refer & Earn</p>
      </div>
      <p style={{ fontSize: 13, color: "var(--text2)", fontFamily: "'Inter',sans-serif", marginBottom: 16, lineHeight: 1.6 }}>
        Share your link and earn <strong style={{ color: "var(--text)" }}>100 points</strong> for every friend who orders!
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <input readOnly value={referralLink} className="lux-input"
          style={{ flex: 1, fontSize: 12, color: "var(--text2)" }} />
        <button onClick={copyLink} className="btn-primary"
          style={{ whiteSpace: "nowrap", padding: "11px 18px", fontSize: 13 }}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {[
          { platform: "whatsapp", label: "WhatsApp", color: "#25D366" },
          { platform: "facebook", label: "Facebook", color: "#1877F2" },
          { platform: "twitter",  label: "Twitter",  color: "#1DA1F2" },
        ].map(s => (
          <button key={s.platform} onClick={() => shareOnSocial(s.platform)}
            style={{ padding: "7px 14px", background: "transparent", border: `1px solid ${s.color}40`, color: s.color, fontSize: 12, fontFamily: "'Inter',sans-serif", fontWeight: 500, cursor: "pointer", borderRadius: 8, transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = `${s.color}10`}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}