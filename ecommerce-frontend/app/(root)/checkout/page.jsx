"use client"
import { useState } from "react"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import { FaCreditCard, FaPaypal, FaWallet } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";

const paymentMethods = [
  {
    id: "card",
    label: "Credit / Debit Card",
    icon: FaCreditCard,
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: FaPaypal,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    icon: MdLocalShipping,
  },
  {
    id: "wallet",
    label: "Wallet",
    icon: FaWallet,
  },
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [shipping, setShipping] = useState({
    fullName: user?.name ?? "", phone: "", address: "", city: "", country: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [promoCode, setPromoCode]         = useState("")
  const [discount, setDiscount]           = useState(0)
  const [promoApplied, setPromoApplied]   = useState(false)
  const [loading, setLoading]             = useState(false)
  const [step, setStep]                   = useState(1)

  const shippingCost = total > 100 ? 0 : 10
  const finalTotal   = total + shippingCost - discount

  const handleShippingChange = e => setShipping(p => ({ ...p, [e.target.name]: e.target.value }))

  const applyPromo = async () => {
    try {
      const res = await api.post("/promo/apply", { code: promoCode, total })
      setDiscount(res.data.discount)
      setPromoApplied(true)
      toast.success(`Saved $${res.data.discount.toFixed(2)}!`)
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Invalid promo code")
    }
  }

  const handlePlaceOrder = async () => {
    if (!shipping.fullName || !shipping.phone || !shipping.address || !shipping.city || !shipping.country) {
      toast.error("Please fill all shipping details")
      return
    }
    setLoading(true)
    try {
      // Step 1: Create the order
      const res = await api.post("/orders", {
        items, shipping, paymentMethod, discount, total: finalTotal,
      })

      const order = res.data.order

      // Step 2: Handle payment method
      if (paymentMethod === "card") {
        // Create Stripe payment intent then redirect to stripe page
        const intentRes = await api.post("/payments/stripe/intent", { orderId: order._id })
        clearCart()
        // Redirect to a stripe payment page with the clientSecret
        router.push(`/checkout/stripe?orderId=${order._id}&clientSecret=${intentRes.data.clientSecret}`)
        return
      }

      if (paymentMethod === "paypal") {
        // PayPal: just redirect to success for now (full PayPal integration needs webhook setup)
        clearCart()
        toast.success("Order placed! Complete PayPal payment at pickup.")
        router.push(`/checkout/success?orderId=${order._id}`)
        return
      }

      // COD or Wallet
      clearCart()
      toast.success("Order placed successfully! 🎉")
      router.push(`/checkout/success?orderId=${order._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to place order")
    } finally { setLoading(false) }
  }

  if (items.length === 0) { router.push("/cart"); return null }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>

        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Checkout
        </h1>

        {/* Steps */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 36 }}>
          {["Shipping", "Payment & Review"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i ? "#111" : step === i + 1 ? "#111" : "var(--bg3)", color: step >= i + 1 ? "#fff" : "var(--text2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, transition: "all 0.3s" }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 14, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? "var(--text)" : "var(--text2)" }}>{s}</span>
              {i < 1 && <span style={{ color: "var(--text3)", margin: "0 4px" }}>→</span>}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }}>

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Step 1 — Shipping */}
            {step === 1 && (
              <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
                  Shipping Address
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", display: "block", marginBottom: 6 }}>Full Name</label>
                    <input name="fullName" value={shipping.fullName} onChange={handleShippingChange} className="lux-input" placeholder="John Doe" required />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", display: "block", marginBottom: 6 }}>Phone</label>
                    <input name="phone" value={shipping.phone} onChange={handleShippingChange} className="lux-input" placeholder="01xxxxxxxxx" required />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", display: "block", marginBottom: 6 }}>City</label>
                    <input name="city" value={shipping.city} onChange={handleShippingChange} className="lux-input" placeholder="Cairo" required />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", display: "block", marginBottom: 6 }}>Street Address</label>
                    <input name="address" value={shipping.address} onChange={handleShippingChange} className="lux-input" placeholder="123 Main St" required />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", display: "block", marginBottom: 6 }}>Country</label>
                    <input name="country" value={shipping.country} onChange={handleShippingChange} className="lux-input" placeholder="Egypt" required />
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="btn-primary" style={{ marginTop: 20, width: "100%", padding: "13px" }}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <>
                <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
                    Payment Method
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {paymentMethods.map((m) => (
                      <label key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", border: `2px solid ${paymentMethod === m.id ? "var(--accent)" : "var(--border)"}`, borderRadius: 10, cursor: "pointer", background: paymentMethod === m.id ? "var(--bg3)" : "var(--bg2)", transition: "all 0.2s" }}>
                        <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} style={{ display: "none" }} />
                        <m.icon style={{ fontSize: 22, color: "var(--accent)" }} />
                        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", fontFamily: "'Inter', sans-serif" }}>{m.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Promo code */}
                <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>
                    Promo Code
                  </h2>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="lux-input"
                      disabled={promoApplied}
                      style={{ flex: 1 }}
                    />
                    <button onClick={applyPromo} disabled={promoApplied} className="btn-primary" style={{ whiteSpace: "nowrap", opacity: promoApplied ? 0.6 : 1 }}>
                      {promoApplied ? "Applied ✓" : "Apply"}
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1, padding: "13px" }}>
                    ← Back
                  </button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary" style={{ flex: 2, padding: "13px", opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Placing Order..." : "Place Order →"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right — Summary */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, position: "sticky", top: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
              Order Summary
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              {items.map(item => (
                <div key={item._id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <img src={item.images?.[0] ?? "/placeholder.png"} alt={item.name} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, background: "var(--bg3)" }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text2)" }}>× {item.qty}</p>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "var(--text2)" }}>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--gold)" }}>
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "var(--text2)" }}>Shipping</span>
                <span style={{ color: shippingCost === 0 ? "var(--gold)" : "var(--text)" }}>
                  {shippingCost === 0 ? "Free 🎉" : `$${shippingCost}`}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <span style={{ fontFamily: "'Syne', sans-serif" }}>Total</span>
                <span style={{ fontFamily: "'Syne', sans-serif" }}>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
