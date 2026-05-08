"use client"
import { useState } from "react"
import api from "@/lib/axios"
import toast from "react-hot-toast"

// Bonus: Apply promo codes and discounts
export default function PromoCode({ total, setDiscount }) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState(false)

  const handleApply = async () => {
    if (!code.trim()) return
    setLoading(true)
    try {
      const res = await api.post("/promo/apply", { code, total })
      setDiscount(res.data.discount)
      setApplied(true)
      toast.success(`Promo code applied! You saved $${res.data.discount}`)
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Invalid promo code")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-xl p-6">
      <h2 className="font-bold text-lg mb-4">Promo Code</h2>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter promo code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={applied}
          className="border rounded-lg p-3 flex-1 disabled:bg-gray-50"
        />
        <button
          onClick={handleApply}
          disabled={loading || applied}
          className="bg-black text-white px-6 rounded-lg disabled:opacity-50"
        >
          {applied ? "Applied ✓" : loading ? "..." : "Apply"}
        </button>
      </div>
    </div>
  )
}