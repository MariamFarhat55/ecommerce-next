"use client"
import Link from "next/link"

const cols = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Categories",   href: "/categories" },
      { label: "New Arrivals", href: "/products?sort=newest" },
      { label: "Sale",         href: "/products?sort=sale" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login",     href: "/login" },
      { label: "Register",  href: "/register" },
      { label: "My Orders", href: "/orders" },
      { label: "Wishlist",  href: "/wishlist" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ",            href: "#" },
      { label: "Shipping Policy", href: "#" },
      { label: "Returns",        href: "#" },
      { label: "Contact Us",     href: "#" },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{ background: "#111111", color: "#fff", marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40 }}>

        {/* Brand */}
        <div>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
             Shoply
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#A1A1AA", maxWidth: 280 }}>
            Your modern marketplace for quality products at great prices.
          </p>
          {/* Trust badges */}
          <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
            {["Free Returns", "Secure Pay", "24/7 Support"].map(b => (
              <span key={b} style={{ fontSize: 12, color: "#71717A", display: "flex", alignItems: "center", gap: 4 }}>
                ✓ {b}
              </span>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {cols.map((col) => (
          <div key={col.title}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>
              {col.title}
            </p>
            {col.links.map((link) => (
              <Link key={link.label} href={link.href} style={{ display: "block", fontSize: 14, color: "#71717A", marginBottom: 10, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "#71717A"}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid #27272A", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 13, color: "#71717A" }}>© 2024 Luxe. All rights reserved.</p>
          <p style={{ fontSize: 13, color: "#71717A" }}>Made with ❤️</p>
        </div>
      </div>
    </footer>
  )
}