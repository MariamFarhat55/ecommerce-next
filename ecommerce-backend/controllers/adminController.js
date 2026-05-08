const User      = require("../models/User")
const Product   = require("../models/Product")
const Order     = require("../models/Order")
const Category  = require("../models/Category")
const PromoCode = require("../models/PromoCode")

// Stats
exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalOrders, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find({ isPaid: true }),
    ])
    const revenue = orders.reduce((s, o) => s + o.total, 0)
    res.json({ totalUsers, totalProducts, totalOrders, revenue })
  } catch (err) { next(err) }
}

// Users
exports.getUsers    = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 })
    res.json({ users })
  } catch (err) { next(err) }
}
exports.updateUser  = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password")
    res.json({ user })
  } catch (err) { next(err) }
}

// Products
exports.getProducts    = async (req, res, next) => {
  try {
    const products = await Product.find().populate("category seller", "name").sort({ createdAt: -1 })
    res.json({ products })
  } catch (err) { next(err) }
}
exports.deleteProduct  = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: "Product deleted" })
  } catch (err) { next(err) }
}

// Orders
exports.getOrders       = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 })
    res.json({ orders })
  } catch (err) { next(err) }
}
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    res.json({ order })
  } catch (err) { next(err) }
}

// Categories
exports.getCategories   = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json({ categories })
  } catch (err) { next(err) }
}
exports.createCategory  = async (req, res, next) => {
  try {
    const category = await Category.create({ name: req.body.name })
    res.status(201).json({ category })
  } catch (err) { next(err) }
}
exports.deleteCategory  = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: "Category deleted" })
  } catch (err) { next(err) }
}

// Promo Codes
exports.getPromos   = async (req, res, next) => {
  try {
    const promos = await PromoCode.find().sort({ createdAt: -1 })
    res.json({ promos })
  } catch (err) { next(err) }
}
exports.createPromo = async (req, res, next) => {
  try {
    const promo = await PromoCode.create(req.body)
    res.status(201).json({ promo })
  } catch (err) { next(err) }
}
exports.deletePromo = async (req, res, next) => {
  try {
    await PromoCode.findByIdAndDelete(req.params.id)
    res.json({ message: "Promo deleted" })
  } catch (err) { next(err) }
}