const Product  = require("../models/Product")
const Category = require("../models/Category")
const mongoose = require("mongoose")

// @GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, sort, limit = 12, page = 1 } = req.query
    const query = { isActive: true }

    if (search) query.name = { $regex: search, $options: "i" }

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category
      } else {
        const cat = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, "i") } })
        query.category = cat?._id ?? null
      }
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    const sortMap = {
      newest:     { createdAt: -1 },
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
      rating:     { rating: -1 },
      deals:      { price: 1 },
      sale:       { price: 1 },
    }
    const sortBy = sortMap[sort] ?? { createdAt: -1 }

    const skip  = (Number(page) - 1) * Number(limit)
    const total = await Product.countDocuments(query)

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("seller", "name")
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit))

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
  } catch (err) { next(err) }
}

// @GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("seller", "name")
      .populate("reviews.user", "name")
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json({ product })
  } catch (err) { next(err) }
}

// @POST /api/products/:id/reviews
exports.addReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: "Product not found" })

    if (product.reviews.find(r => r.user.toString() === req.user._id.toString()))
      return res.status(400).json({ message: "Already reviewed" })

    product.reviews.push({ user: req.user._id, rating: req.body.rating, comment: req.body.comment })
    product.updateRating()
    await product.save()
    res.status(201).json({ message: "Review added" })
  } catch (err) { next(err) }
}

// @GET /api/products/:id/reviews
exports.getReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews.user", "name")
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json({ reviews: product.reviews })
  } catch (err) { next(err) }
}