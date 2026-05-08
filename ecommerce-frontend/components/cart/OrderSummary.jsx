"use client"
import { useCart } from "@/hooks/useCart"

export default function OrderSummary({ discount = 0 }) {
  const { items, total } = useCart()

  const shipping = total > 100 ? 0 : 10 // Free shipping over $100
  const finalTotal = total - discount + shipping

  return (
    <div className="border rounded-xl p-6 flex flex-col gap-3">
      <h2 className="font-bold text-lg mb-2">Order Summary</h2>

      {/* List of items */}
      {items.map((item) => (
        <div key={item._id} className="flex justify-between text-sm text-gray-600">
          <span>{item.name} × {item.qty}</span>
          <span>${(item.price * item.qty).toFixed(2)}</span>
        </div>
      ))}

      <div className="border-t pt-3 flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Show discount if promo code applied */}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
        </div>

        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}