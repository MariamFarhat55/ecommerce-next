"use client"

const methods = [
  { id: "card", label: "Credit / Debit Card", icon: "💳" },
  { id: "paypal", label: "PayPal", icon: "🅿️" },
  { id: "cod", label: "Cash on Delivery", icon: "💵" },
  { id: "wallet", label: "Wallet", icon: "👛" },
]

export default function PaymentMethod({ paymentMethod, setPaymentMethod }) {
  return (
    <div className="border rounded-xl p-6">
      <h2 className="font-bold text-lg mb-4">Payment Method</h2>
      <div className="grid grid-cols-2 gap-3">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => setPaymentMethod(method.id)}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition ${
              paymentMethod === method.id
                ? "border-black bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <span className="text-2xl">{method.icon}</span>
            <span className="font-medium text-sm">{method.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}