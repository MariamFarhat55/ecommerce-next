"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useState } from "react"
import api from "@/lib/axios"
import toast from "react-hot-toast"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function StripeForm({ orderId }) {
  const stripe   = useStripe()
  const elements = useElements()
  const router   = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
        },
      })
      if (error) toast.error(error.message)
    } catch {
      toast.error("Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || loading} className="btn-primary" style={{ padding: "14px", opacity: loading ? 0.7 : 1 }}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  )
}

export default function StripePage() {
  const params       = useSearchParams()
  const orderId      = params.get("orderId")
  const clientSecret = params.get("clientSecret")

  if (!clientSecret) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)" }}>
      Missing payment details
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 480, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, padding: 40 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: "var(--text)", marginBottom: 28 }}>
          Complete Payment
        </h1>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripeForm orderId={orderId} />
        </Elements>
      </div>
    </div>
  )
}
