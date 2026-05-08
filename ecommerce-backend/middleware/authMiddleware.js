const jwt  = require("jsonwebtoken")
const User = require("../models/User")

// Protect — must be logged in
exports.protect = async (req, res, next) => {
  let token
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }
  if (!token) return res.status(401).json({ message: "Not authorized" })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select("-password")
    if (!req.user) return res.status(401).json({ message: "User not found" })
    if (!req.user.active) return res.status(403).json({ message: "Account restricted" })
    next()
  } catch {
    res.status(401).json({ message: "Token invalid" })
  }
}

// Admin only
exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ message: "Admin access required" })
  next()
}

// Seller only
exports.sellerOnly = (req, res, next) => {
  if (!["seller", "admin"].includes(req.user?.role))
    return res.status(403).json({ message: "Seller access required" })
  next()
}