"use client"
import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import api from "@/lib/axios"
import toast from "react-hot-toast"

// Load Stripe with public key from env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function CheckoutForm({ orderId, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)

    try {
      // Get payment intent from backend
      const { data } = await api.post("/payments/stripe/intent", { orderId })

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      })

      if (result.error) {
        toast.error(result.error.message)
      } else {
        toast.success("Payment successful!")
        onSuccess()
      }
    } catch (err) {
      toast.error("Payment failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="border rounded-lg p-4">
        {/* Stripe card input */}
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-black text-white py-3 rounded-xl disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  )
}

// Wrap with Stripe Elements provider
export default function StripePayment({ orderId, onSuccess }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm orderId={orderId} onSuccess={onSuccess} />
    </Elements>
  )
}