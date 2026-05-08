const User = require("../models/User")

// @GET /api/users/profile
exports.getProfile = async (req, res, next) => {
  try {
    res.json({ user: req.user })
  } catch (err) { next(err) }
}

// @PATCH /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, city, country } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, city, country },
      { new: true, runValidators: true }
    ).select("-password")
    res.json({ user })
  } catch (err) { next(err) }
}

// @GET /api/users/loyalty
exports.getLoyalty = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("loyaltyPoints")
    res.json({ points: user.loyaltyPoints ?? 0 })
  } catch (err) { next(err) }
}