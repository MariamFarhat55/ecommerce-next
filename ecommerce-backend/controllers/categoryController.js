const Category = require("../models/Category")

// @GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json({ categories })
  } catch (err) { next(err) }
}

// @GET /api/categories/:id
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: "Category not found" })
    res.json({ category })
  } catch (err) { next(err) }
}
