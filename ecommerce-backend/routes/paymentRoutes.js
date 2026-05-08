const router = require("express").Router()
const { createStripeIntent } = require("../controllers/paymentController")
const { protect } = require("../middleware/authMiddleware")

// Create Stripe payment intent (requires auth)
router.post("/stripe/intent", protect, createStripeIntent)

module.exports = router
