const jwt       = require("jsonwebtoken")
const crypto    = require("crypto")
const User      = require("../models/User")
const sendEmail = require("../utils/sendEmail")

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

// @POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already registered" })

    const verificationToken = crypto.randomBytes(32).toString("hex")
    const user = await User.create({ name, email, phone, password, role: role === "seller" ? "seller" : "customer", verificationToken })

    // Send confirmation email
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`
    await sendEmail({
      to: email,
      subject: "Verify your Luxe account",
      html: `<p>Hi ${name},</p><p>Please verify your email: <a href="${verifyUrl}">Click here</a></p>`,
    })

    res.status(201).json({ message: "Account created. Please check your email." })
  } catch (err) { next(err) }
}

// @POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password" })
    if (!user.active)
      return res.status(403).json({ message: "Account restricted" })

    res.json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id),
    })
  } catch (err) { next(err) }
}

// @GET /api/auth/verify-email?token=...
exports.verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ verificationToken: req.query.token })
    if (!user) return res.status(400).json({ message: "Invalid token" })
    user.isVerified = true
    user.verificationToken = undefined
    await user.save()
    res.json({ message: "Email verified successfully" })
  } catch (err) { next(err) }
}

// @POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(404).json({ message: "No account with that email" })

    const token = crypto.randomBytes(32).toString("hex")
    user.resetPasswordToken   = token
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
    await user.save()

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`
    await sendEmail({
      to: user.email,
      subject: "Reset your Luxe password",
      html: `<p>Reset your password: <a href="${resetUrl}">Click here</a></p><p>Expires in 1 hour.</p>`,
    })

    res.json({ message: "Reset link sent to your email" })
  } catch (err) { next(err) }
}

// @POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() },
    })
    if (!user) return res.status(400).json({ message: "Token invalid or expired" })

    user.password             = req.body.password
    user.resetPasswordToken   = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.json({ message: "Password reset successfully" })
  } catch (err) { next(err) }
}