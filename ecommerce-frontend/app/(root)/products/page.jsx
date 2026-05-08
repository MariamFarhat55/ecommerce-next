"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import api from "@/lib/axios"
import ProductCard from "@/components/products/ProductCard"
import ProductFilters from "@/components/products/ProductFilters"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filters, setFilters]   = useState({
    search:   searchParams.get("search")   || "",
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    sort:     searchParams.get("sort")     || "newest",
  })

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: searchParams.get("category") || "",
      sort:     searchParams.get("sort")     || "newest",
      search:   searchParams.get("search")   || "",
    }))
  }, [searchParams])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (filters.search)   params.search   = filters.search
    if (filters.category) params.category = filters.category
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    if (filters.sort)     params.sort     = filters.sort
    api.get("/products", { params })
      .then(r => setProducts(r.data.products))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          All Products
        </h1>
        <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 28 }}>
          {!loading && `${products.length} products found`}
        </p>

        <ProductFilters filters={filters} setFilters={setFilters} />

        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text2)", fontSize: 15 }}>
            No products found
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, marginTop: 8 }}>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}