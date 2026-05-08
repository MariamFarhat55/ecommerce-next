"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"

const NAV_CATS = ["Women","Men","Shoes","Bags","Accessories","Watches"]

export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [catOpen, setCatOpen]           = useState(false)
  const [searchOpen, setSearchOpen]     = useState(false)
  const [searchQ, setSearchQ]           = useState("")
  const searchRef = useRef(null)
  const router    = useRouter()

  const { user, isAuthenticated, logout } = useAuth()
  const { count: cartCount }              = useCart()
  const { count: wishlistCount }          = useWishlist()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  useEffect(() => {
    const fn = (e) => {
      if (!e.target.closest("#user-menu"))  setDropdownOpen(false)
      if (!e.target.closest("#cat-menu"))   setCatOpen(false)
      if (!e.target.closest("#search-bar")) { setSearchOpen(false); setSearchQ("") }
    }
    document.addEventListener("click", fn)
    return () => document.removeEventListener("click", fn)
  }, [])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100)
  }, [searchOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim()) { router.push(`/products?search=${searchQ.trim()}`); setSearchOpen(false); setSearchQ("") }
  }

  const iconBtn = { position:"relative", display:"flex", alignItems:"center", justifyContent:"center", width:38, height:38, borderRadius:8, border:"1px solid var(--border)", background:"var(--bg2)", cursor:"pointer", transition:"border-color 0.2s", textDecoration:"none" }

  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, background: scrolled ? "rgba(245,240,235,0.96)" : "rgba(245,240,235,0.99)", backdropFilter:"blur(14px)", borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent", transition:"all 0.3s ease" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>

        <Link href="/" style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:"var(--text)", textDecoration:"none", letterSpacing:"-0.02em", flexShrink:0 }}>
          Shoply.
        </Link>

        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          <div id="cat-menu" style={{ position:"relative" }}>
            <button onClick={() => setCatOpen(p=>!p)}
              style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", background:"none", border:"none", cursor:"pointer", fontSize:14, fontWeight:500, color: catOpen ? "var(--text)" : "var(--text2)", fontFamily:"'Inter',sans-serif", borderRadius:6, transition:"color 0.2s" }}>
              Categories
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"
                style={{ transform: catOpen ? "rotate(180deg)" : "rotate(0)", transition:"transform 0.2s" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {catOpen && (
              <div style={{ position:"absolute", top:"calc(100% + 10px)", left:0, width:220, background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:8, boxShadow:"var(--shadow-lg)", zIndex:100 }}>
                {NAV_CATS.map(cat => (
                  <Link key={cat} href={`/products?category=${cat.toLowerCase()}`}
                    onClick={() => setCatOpen(false)}
                    style={{ display:"block", padding:"9px 12px", fontSize:14, color:"var(--text2)", textDecoration:"none", borderRadius:6, fontFamily:"'Inter',sans-serif", transition:"all 0.15s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.background="var(--bg3)"; e.currentTarget.style.color="var(--text)" }}
                    onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--text2)" }}>
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/products?sort=price_asc" className="nav-link" style={{ padding:"6px 12px", borderRadius:6 }}>Deals</Link>
          <Link href="/products?sort=newest" className="nav-link" style={{ padding:"6px 12px", borderRadius:6 }}>New Arrivals</Link>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:8 }}>

          {/* Search */}
          <div id="search-bar" style={{ position:"relative" }}>
            {searchOpen ? (
              <form onSubmit={handleSearch} style={{ display:"flex", alignItems:"center", gap:6, background:"var(--bg2)", border:"1.5px solid var(--accent)", borderRadius:8, padding:"4px 8px 4px 12px", width:220 }}>
                <input ref={searchRef} value={searchQ} onChange={e=>setSearchQ(e.target.value)}
                  placeholder="Search products..."
                  style={{ border:"none", background:"transparent", outline:"none", fontSize:13, color:"var(--text)", fontFamily:"'Inter',sans-serif", flex:1, minWidth:0 }} />
                <button type="submit" style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", padding:4, color:"var(--text2)" }}>
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/></svg>
                </button>
              </form>
            ) : (
              <button onClick={()=>setSearchOpen(true)} style={{ ...iconBtn }}
                onMouseEnter={e=>e.currentTarget.style.borderColor="var(--border-hover)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                <svg width="18" height="18" fill="none" stroke="var(--text2)" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/></svg>
              </button>
            )}
          </div>

          {/* Wishlist */}
          <Link href="/wishlist" style={{ ...iconBtn }}
            onMouseEnter={e=>e.currentTarget.style.borderColor="var(--border-hover)"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
            <svg width="18" height="18" fill="none" stroke="var(--text2)" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            {wishlistCount > 0 && (
              <span style={{ position:"absolute", top:3, right:3, width:15, height:15, borderRadius:"50%", background:"#EF4444", color:"#fff", fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" style={{ ...iconBtn }}
            onMouseEnter={e=>e.currentTarget.style.borderColor="var(--border-hover)"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
            <svg width="18" height="18" fill="none" stroke="var(--text2)" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            {cartCount > 0 && (
              <span style={{ position:"absolute", top:3, right:3, width:15, height:15, borderRadius:"50%", background:"var(--accent)", color:"#fff", fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          {isAuthenticated ? (
            <div id="user-menu" style={{ position:"relative" }}>
              <button onClick={() => setDropdownOpen(p=>!p)}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 10px 5px 5px", borderRadius:8, border:"1px solid var(--border)", background:"var(--bg2)", cursor:"pointer", fontSize:13, fontWeight:500, color:"var(--text)", fontFamily:"'Inter',sans-serif", transition:"border-color 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor="var(--border-hover)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"var(--accent)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                {user?.name?.split(" ")[0]}
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"
                  style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)", transition:"transform 0.2s" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", width:185, background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10, padding:6, boxShadow:"var(--shadow-lg)", zIndex:100 }}>
                  {user?.role === "admin" && (
                    <Link href="/admin" onClick={()=>setDropdownOpen(false)} className="footer-link" style={{ padding:"8px 12px", margin:0, borderRadius:6, fontSize:13 }}>
                      <svg style={{display:"inline",marginRight:6}} width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
                      Admin Panel
                    </Link>
                  )}
                  {user?.role === "seller" && (
                    <Link href="/seller" onClick={()=>setDropdownOpen(false)} className="footer-link" style={{ padding:"8px 12px", margin:0, borderRadius:6, fontSize:13 }}>
                      <svg style={{display:"inline",marginRight:6}} width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
                      Seller Dashboard
                    </Link>
                  )}
                  <Link href="/profile" onClick={()=>setDropdownOpen(false)} className="footer-link" style={{ padding:"8px 12px", margin:0, borderRadius:6, fontSize:13 }}>
                    <svg style={{display:"inline",marginRight:6}} width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Profile
                  </Link>
                  <Link href="/orders" onClick={()=>setDropdownOpen(false)} className="footer-link" style={{ padding:"8px 12px", margin:0, borderRadius:6, fontSize:13 }}>
                    <svg style={{display:"inline",marginRight:6}} width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                    My Orders
                  </Link>
                  <Link href="/wishlist" onClick={()=>setDropdownOpen(false)} className="footer-link" style={{ padding:"8px 12px", margin:0, borderRadius:6, fontSize:13 }}>
                    <svg style={{display:"inline",marginRight:6}} width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    Wishlist
                  </Link>
                  <div style={{ height:1, background:"var(--border)", margin:"4px 0" }} />
                  <button onClick={()=>{ logout(); setDropdownOpen(false) }}
                    style={{ padding:"8px 12px", margin:0, borderRadius:6, fontSize:13, background:"none", border:"none", cursor:"pointer", width:"100%", textAlign:"left", color:"#EF4444", fontFamily:"'Inter',sans-serif" }}>
                    <svg style={{display:"inline",marginRight:6}} width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display:"flex", gap:8 }}>
              <Link href="/login"    className="btn-secondary" style={{ padding:"8px 16px", fontSize:13 }}>Login</Link>
              <Link href="/register" className="btn-primary"   style={{ padding:"8px 16px", fontSize:13 }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}