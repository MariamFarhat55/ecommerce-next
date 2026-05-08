import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import Sidebar from "@/components/layout/Sidebar"

const SELLER_LINKS = [
  { href: "/seller",          label: "Dashboard",   icon: "dashboard" },
  { href: "/seller/products", label: "My Products", icon: "products"  },
  { href: "/seller/orders",   label: "Orders",      icon: "orders"    },
  { href: "/seller/earnings", label: "Earnings",    icon: "earnings"  },
]

export default async function SellerLayout({ children }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "seller") redirect("/")

  return (
    <div style={{ display: "flex", minHeight: "100vh", paddingTop: 64 }}>
      <Sidebar links={SELLER_LINKS} title="Seller Dashboard" />
      <main style={{ flex: 1, padding: 32, background: "var(--bg)", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  )
}