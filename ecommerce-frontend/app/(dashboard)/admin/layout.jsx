import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import Sidebar from "@/components/layout/Sidebar"

const ADMIN_LINKS = [
  { href: "/admin",            label: "Dashboard",   icon: "dashboard"   },
  { href: "/admin/products",   label: "Products",    icon: "products"    },
  { href: "/admin/orders",     label: "Orders",      icon: "orders"      },
  { href: "/admin/users",      label: "Users",       icon: "users"       },
  { href: "/admin/categories", label: "Categories",  icon: "categories"  },
  { href: "/admin/promo",      label: "Promo Codes", icon: "promo"       },
]

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") redirect("/")

  return (
    <div style={{ display: "flex", minHeight: "100vh", paddingTop: 64 }}>
      <Sidebar links={ADMIN_LINKS} title="Admin Panel" />
      <main style={{ flex: 1, padding: 32, background: "var(--bg)", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  )
}