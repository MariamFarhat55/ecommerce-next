"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import api from "@/lib/axios"
import ProductCard from "@/components/products/ProductCard"
import NewsletterBanner from "@/components/marketing/NewsletterBanner"

function useInView() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

const cats = [
  { name: "Women",       slug: "women",       img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80", count: "1200+ items" },
  { name: "Men",         slug: "men",         img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", count: "1500+ items" },
  { name: "Shoes",       slug: "shoes",       img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", count: "800+ items"  },
  { name: "Bags",        slug: "bags",        img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80", count: "600+ items"  },
  { name: "Accessories", slug: "accessories", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80", count: "950+ items"  },
  { name: "Watches",     slug: "watches",     img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", count: "400+ items"  },
]

const features = [
  { 
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12"/></svg>,
    title: "Free Shipping", desc: "On orders over $50"
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"/></svg>,
    title: "30 Days Returns", desc: "Money back guarantee"
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>,
    title: "Secure Payment", desc: "100% secure payment"
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>,
    title: "24/7 Support", desc: "Dedicated support team"
  },
]

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const s1 = useInView()
  const s2 = useInView()
  const s3 = useInView()

  useEffect(() => {
    api.get("/products?limit=4&sort=newest")
      .then(r => setFeatured(r.data.products))
      .catch(() => {})
  }, [])

  const vis = (s, delay = "0s") => ({
    opacity:   s.inView ? 1 : 0,
    transform: s.inView ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.65s ease ${delay}, transform 0.65s ease ${delay}`,
  })

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: 64,
        background: "linear-gradient(135deg, #F5F0EB 0%, #EDE8E2 40%, #F2EDE7 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* soft warm blobs */}
        <div style={{ position:"absolute", top:-80, right:-80, width:480, height:480, borderRadius:"50%", background:"rgba(210,195,180,0.25)", filter:"blur(90px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-60, left:-60, width:320, height:320, borderRadius:"50%", background:"rgba(180,165,150,0.15)", filter:"blur(70px)", pointerEvents:"none" }} />

        <div style={{ maxWidth:1280, margin:"0 auto", padding:"80px 24px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center", width:"100%" }}>

          {/* Left — Text */}
          <div>
            <div className="fade-up" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px", background:"rgba(17,17,17,0.07)", borderRadius:100, marginBottom:24 }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:"var(--accent)", display:"inline-block" }} />
              <span style={{ fontSize:12, fontWeight:500, color:"var(--text2)", fontFamily:"'Inter',sans-serif", letterSpacing:"0.04em", textTransform:"uppercase" }}>
                New Season, New Style
              </span>
            </div>

            <h1 className="fade-up d1" style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(2.6rem,5vw,4.2rem)", fontWeight:700, color:"var(--text)", lineHeight:1.08, marginBottom:20, letterSpacing:"-0.03em" }}>
              Discover The<br/>Latest Trends<br/>
              <span style={{ color:"var(--accent2)" }}>In Fashion</span>
            </h1>

            <p className="fade-up d2" style={{ fontSize:16, color:"var(--text2)", lineHeight:1.75, marginBottom:36, maxWidth:420 }}>
              Explore our new collection of premium quality products. Handpicked just for you.
            </p>

            <div className="fade-up d3" style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <Link href="/products" className="btn-primary" style={{ fontSize:15, padding:"13px 28px" }}>
                Shop Now
              </Link>
              <Link href="/products" className="btn-secondary" style={{ fontSize:15, padding:"13px 28px" }}>
                View Collections
              </Link>
            </div>

            {/* Stats */}
            <div className="fade-up d4" style={{ display:"flex", gap:36, marginTop:48, paddingTop:36, borderTop:"1px solid var(--border)" }}>
              {[["10k+","Products"],["5k+","Customers"],["500+","Sellers"]].map(([num,label]) => (
                <div key={label}>
                  <p style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, color:"var(--text)", lineHeight:1 }}>{num}</p>
                  <p style={{ fontSize:12, color:"var(--text2)", marginTop:4 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image */}
          <div className="fade-up d2" style={{ position:"relative" }}>
            <div style={{ background:"var(--bg2)", borderRadius:24, padding:8, boxShadow:"0 24px 64px rgba(0,0,0,0.10)" }}>
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&q=85"
                alt="Fashion collection"
                style={{ width:"100%", borderRadius:18, aspectRatio:"4/3", objectFit:"cover", display:"block" }}
              />
            </div>
            {/* Floating badge */}
            <div style={{ position:"absolute", bottom:28, left:-20, background:"var(--bg2)", borderRadius:14, padding:"12px 18px", boxShadow:"var(--shadow-lg)", display:"flex", alignItems:"center", gap:10, border:"1px solid var(--border)" }}>
              <span style={{ fontSize:22 }}>⭐</span>
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:"var(--text)", fontFamily:"'Syne',sans-serif", lineHeight:1 }}>Premium Quality</p>
                <p style={{ fontSize:11, color:"var(--text2)", marginTop:3 }}>Made with best materials</p>
              </div>
            </div>
            {/* Second float */}
            <div style={{ position:"absolute", top:24, right:-16, background:"var(--bg2)", borderRadius:14, padding:"10px 16px", boxShadow:"var(--shadow-md)", border:"1px solid var(--border)" }}>
              <p style={{ fontSize:11, fontWeight:600, color:"var(--text)", fontFamily:"'Syne',sans-serif" }}>🛍️ Free Shipping</p>
              <p style={{ fontSize:10, color:"var(--text2)", marginTop:2 }}>On orders over $50</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES BAR ── */}
      <section style={{ background:"var(--bg2)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"28px 24px", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          {features.map((f) => (
            <div key={f.title} style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:22 }}>{f.icon}</span>
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:"var(--text)", fontFamily:"'Syne',sans-serif" }}>{f.title}</p>
                <p style={{ fontSize:12, color:"var(--text2)" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section ref={s1.ref} style={{ maxWidth:1280, margin:"0 auto", padding:"80px 24px", ...vis(s1) }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:32 }}>
          <div>
            <span className="section-tag">Browse our top categories</span>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.5rem,3vw,2rem)", fontWeight:700, color:"var(--text)", letterSpacing:"-0.02em" }}>
              Shop By Categories
            </h2>
          </div>
          <Link href="/categories" style={{ fontSize:14, color:"var(--text2)", fontWeight:500, textDecoration:"none", transition:"color 0.2s" }}
            onMouseEnter={e=>e.target.style.color="var(--text)"}
            onMouseLeave={e=>e.target.style.color="var(--text2)"}>
            View All →
          </Link>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:14 }}>
          {cats.map((c) => (
            <Link key={c.slug} href={`/products?category=${c.slug}`} className="cat-card">
              <div style={{ aspectRatio:"1", overflow:"hidden", background:"var(--bg3)" }}>
                <img src={c.img} alt={c.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s ease" }}
                  onMouseEnter={e=>e.target.style.transform="scale(1.08)"}
                  onMouseLeave={e=>e.target.style.transform="scale(1)"}
                />
              </div>
              <div style={{ padding:"14px 12px" }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"var(--text)", marginBottom:2 }}>{c.name}</h3>
                <p style={{ fontSize:12, color:"var(--text2)" }}>{c.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section ref={s2.ref} style={{ background:"var(--bg3)", padding:"80px 24px", ...vis(s2,"0.1s") }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:32 }}>
            <div>
              <span className="section-tag">Handpicked selection</span>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.5rem,3vw,2rem)", fontWeight:700, color:"var(--text)", letterSpacing:"-0.02em" }}>
                Featured Products
              </h2>
            </div>
            <Link href="/products" style={{ fontSize:14, color:"var(--text2)", fontWeight:500, textDecoration:"none" }}>
              View All →
            </Link>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {featured.length > 0
              ? featured.map(p => <ProductCard key={p._id} product={p} />)
              : [...Array(4)].map((_,i) => (
                  <div key={i} style={{ background:"var(--bg2)", borderRadius:12, overflow:"hidden", border:"1px solid var(--border)" }}>
                    <div className="skeleton" style={{ aspectRatio:"1", height:220 }} />
                    <div style={{ padding:16 }}>
                      <div className="skeleton" style={{ height:13, width:"70%", marginBottom:8 }} />
                      <div className="skeleton" style={{ height:13, width:"40%" }} />
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section ref={s3.ref} style={{ background:"#111111", padding:"80px 24px", ...vis(s3,"0.2s") }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:32, flexWrap:"wrap" }}>
          <div>
            <span style={{ fontSize:12, fontWeight:600, color:"#A8A29E", fontFamily:"'Inter',sans-serif", letterSpacing:"0.06em", textTransform:"uppercase" }}>
              Limited Time
            </span>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:700, color:"#fff", marginTop:8, marginBottom:12, letterSpacing:"-0.02em" }}>
              Up to 40% Off
            </h2>
            <p style={{ fontSize:15, color:"#71716E", maxWidth:400 }}>
              Exclusive deals on our most popular products. Limited time only.
            </p>
          </div>
          <Link href="/products?sort=sale" className="btn-secondary"
            style={{ fontSize:15, padding:"14px 32px", whiteSpace:"nowrap", borderColor:"#fff", color:"#fff" }}
            onMouseEnter={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color="#111"}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#fff"}}>
            Shop the Sale →
          </Link>
        </div>
      </section>

      <NewsletterBanner />
    </div>
  )
}