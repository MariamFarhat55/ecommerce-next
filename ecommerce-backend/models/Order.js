const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  qty:      { type: Number, required: true },
  image:    { type: String },
})

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null = guest
  items: [orderItemSchema],

  shipping: {
    fullName: { type: String, required: true },
    phone:    { type: String, required: true },
    address:  { type: String, required: true },
    city:     { type: String, required: true },
    country:  { type: String, required: true },
  },

  paymentMethod: {
    type: String,
    enum: ["card", "paypal", "cod", "wallet"],
    required: true,
  },
  isPaid:   { type: Boolean, default: false },
  paidAt:   { type: Date },

  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },

  subtotal:     { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  discount:     { type: Number, default: 0 },
  total:        { type: Number, required: true },

  promoCode: { type: String },

  // Stripe / PayPal
  stripePaymentId: { type: String },
  paypalOrderId:   { type: String },

}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema)