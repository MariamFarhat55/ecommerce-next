"use client"
import { useCart } from "@/hooks/useCart"

export default function CartItem({ item }) {
  const { removeItem, updateQty } = useCart()

  return (
    <div className="flex gap-4 border rounded-xl p-4 items-center">
      {/* Product image */}
      <img
        src={item.images?.[0] ?? "/placeholder.png"}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />

      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-500 text-sm">${item.price}</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (item.qty === 1) removeItem(item._id)
            else updateQty(item._id, item.qty - 1)
          }}
          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
        >
          -
        </button>
        <span className="w-8 text-center font-semibold">{item.qty}</span>
        <button
          onClick={() => updateQty(item._id, item.qty + 1)}
          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
        >
          +
        </button>
      </div>

      {/* Item total price */}
      <p className="font-bold w-20 text-right">
        ${(item.price * item.qty).toFixed(2)}
      </p>

      {/* Remove button */}
      <button
        onClick={() => removeItem(item._id)}
        className="text-red-400 hover:text-red-600 ml-2"
      >
        ✕
      </button>
    </div>
  )
}