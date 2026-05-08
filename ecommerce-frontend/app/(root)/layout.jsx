import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

// All pages inside (root) will automatically have Navbar and Footer
export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}