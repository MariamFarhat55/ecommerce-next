const router  = require("express").Router()
const { getProducts, getProduct, addReview, getReviews } = require("../controllers/productController")
const { protect } = require("../middleware/authMiddleware")

router.get("/",              getProducts)
router.get("/:id",           getProduct)
router.get("/:id/reviews",   getReviews)
router.post("/:id/reviews",  protect, addReview)

module.exports = router