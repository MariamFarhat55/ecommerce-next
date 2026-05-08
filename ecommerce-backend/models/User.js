const mongoose = require("mongoose")
const bcrypt   = require("bcryptjs")

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  phone:    { type: String },
  password: { type: String, required: true, minlength: 6 },
  role:     { type: String, enum: ["customer", "seller", "admin"], default: "customer" },
  active:   { type: Boolean, default: true },

  // Profile
  address:  { type: String },
  city:     { type: String },
  country:  { type: String },
  loyaltyPoints: { type: Number, default: 0 },

  // Email verification
  isVerified:         { type: Boolean, default: false },
  verificationToken:  { type: String },

  // Password reset
  resetPasswordToken:   { type: String },
  resetPasswordExpires: { type: Date },

  // Wallet (bonus)
  walletBalance: { type: Number, default: 0 },

}, { timestamps: true })

// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return  
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
})
// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", userSchema)