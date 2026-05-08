"use client"

export default function ShippingForm({ shipping, setShipping }) {
  const handleChange = (e) =>
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  return (
    <div className="border rounded-xl p-6">
      <h2 className="font-bold text-lg mb-4">Shipping Address</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="fullName"
          placeholder="Full name"
          value={shipping.fullName}
          onChange={handleChange}
          className="border rounded-lg p-3 col-span-2"
          required
        />
        <input
          name="phone"
          placeholder="Phone number"
          value={shipping.phone}
          onChange={handleChange}
          className="border rounded-lg p-3"
          required
        />
        <input
          name="city"
          placeholder="City"
          value={shipping.city}
          onChange={handleChange}
          className="border rounded-lg p-3"
          required
        />
        <input
          name="address"
          placeholder="Street address"
          value={shipping.address}
          onChange={handleChange}
          className="border rounded-lg p-3 col-span-2"
          required
        />
        <input
          name="country"
          placeholder="Country"
          value={shipping.country}
          onChange={handleChange}
          className="border rounded-lg p-3 col-span-2"
          required
        />
      </div>
    </div>
  )
}