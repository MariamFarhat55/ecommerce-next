const mongoose = require("mongoose")

const promoSchema = new mongoose.Schema({
  code:      { type: String, required: true, unique: true, uppercase: true },
  discount:  { type: Number, required: true },
  type:      { type: String, enum: ["percentage", "fixed"], default: "percentage" },
  expiresAt: { type: Date },
  isActive:  { type: Boolean, default: true },
  usedCount: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model("PromoCode", promoSchema)