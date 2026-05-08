"use client"
import { useState, useEffect, useRef } from "react"
import api from "@/lib/axios"

export default function ProductFilters({ filters, setFilters }) {
  const [categories, setCategories] = useState([])
  const [catOpen, setCatOpen] = useState(false)
  const catRef = useRef(null)

  useEffect(() => {
    api.get("/categories").then(r => setCategories(r.data.categories)).catch(() => {})
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (!catRef.current?.contains(e.target)) setCatOpen(false) }
    document.addEventListener("click", fn)
    return () => document.removeEventListener("click", fn)
  }, [])

  const handleChange = (e) =>
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const selectedCat = categories.find(c => c._id === filters.category)

  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:28, padding:"16px 20px", background:"var(--bg2)", borderRadius:12, border:"1px solid var(--border)" }}>

      {/* Search */}
      <div style={{ flex:1, minWidth:200, position:"relative" }}>
        <svg style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}
          width="15" height="15" fill="none" stroke="var(--text3)" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/>
        </svg>
        <input name="search" type="text" placeholder="Search products..."
          value={filters.search} onChange={handleChange}
          className="lux-input" style={{ paddingLeft:36 }} />
      </div>

      {/* Custom Category Dropdown */}
      <div ref={catRef} style={{ position:"relative", minWidth:160 }}>
        <button
          onClick={() => setCatOpen(p => !p)}
          style={{
            width:"100%", height:"100%", minHeight:44,
            display:"flex", alignItems:"center", justifyContent:"space-between", gap:8,
            padding:"0 14px", background:"var(--bg2)",
            border:`1.5px solid ${catOpen ? "var(--accent)" : "var(--border)"}`,
            borderRadius:8, cursor:"pointer", fontSize:14,
            color: filters.category ? "var(--text)" : "var(--text3)",
            fontFamily:"'Inter',sans-serif", fontWeight:500,
            transition:"border-color 0.2s",
            boxShadow: catOpen ? "0 0 0 3px rgba(17,17,17,0.06)" : "none",
          }}>
          <span>{selectedCat ? selectedCat.name : "All Categories"}</span>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"
            style={{ flexShrink:0, transition:"transform 0.2s", transform: catOpen ? "rotate(180deg)" : "rotate(0)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        {catOpen && (
          <div style={{
            position:"absolute", top:"calc(100% + 6px)", left:0, right:0,
            background:"var(--bg2)", border:"1px solid var(--border)",
            borderRadius:10, padding:6, boxShadow:"var(--shadow-lg)", zIndex:50,
            minWidth:180,
          }}>
            {/* All Categories option */}
            <button
              onClick={() => { setFilters(p => ({ ...p, category:"" })); setCatOpen(false) }}
              style={{
                width:"100%", padding:"9px 12px", textAlign:"left",
                background: !filters.category ? "var(--bg3)" : "transparent",
                border:"none", borderRadius:6, cursor:"pointer",
                fontSize:14, fontWeight: !filters.category ? 600 : 400,
                color: !filters.category ? "var(--text)" : "var(--text2)",
                fontFamily:"'Inter',sans-serif", transition:"all 0.15s",
                display:"flex", alignItems:"center", justifyContent:"space-between",
              }}
              onMouseEnter={e => { if(filters.category) e.currentTarget.style.background="var(--bg3)" }}
              onMouseLeave={e => { if(filters.category) e.currentTarget.style.background="transparent" }}>
              All Categories
              {!filters.category && (
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              )}
            </button>

            {/* Divider */}
            <div style={{ height:1, background:"var(--border)", margin:"4px 0" }} />

            {/* Categories */}
            {categories.map(cat => (
              <button key={cat._id}
                onClick={() => { setFilters(p => ({ ...p, category: cat._id })); setCatOpen(false) }}
                style={{
                  width:"100%", padding:"9px 12px", textAlign:"left",
                  background: filters.category === cat._id ? "var(--bg3)" : "transparent",
                  border:"none", borderRadius:6, cursor:"pointer",
                  fontSize:14, fontWeight: filters.category === cat._id ? 600 : 400,
                  color: filters.category === cat._id ? "var(--text)" : "var(--text2)",
                  fontFamily:"'Inter',sans-serif", transition:"all 0.15s",
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                }}
                onMouseEnter={e => { if(filters.category !== cat._id) e.currentTarget.style.background="var(--bg3)" }}
                onMouseLeave={e => { if(filters.category !== cat._id) e.currentTarget.style.background="transparent" }}>
                {cat.name}
                {filters.category === cat._id && (
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Min Price */}
      <input name="minPrice" type="number" placeholder="Min $"
        value={filters.minPrice} onChange={handleChange}
        className="lux-input" style={{ width:90 }} />

      {/* Max Price */}
      <input name="maxPrice" type="number" placeholder="Max $"
        value={filters.maxPrice} onChange={handleChange}
        className="lux-input" style={{ width:90 }} />

      {/* Sort */}
      <select name="sort" value={filters.sort} onChange={handleChange}
        className="lux-input" style={{ width:"auto", minWidth:160 }}>
        <option value="newest">Newest First</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>
  )
}