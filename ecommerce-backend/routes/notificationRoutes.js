const router = require("express").Router()
const { protect } = require("../middleware/authMiddleware")

// Save push subscription
router.post("/subscribe", protect, async (req, res) => {
  try {
    // Save subscription to DB for push notifications
    res.json({ message: "Subscribed to notifications" })
  } catch (err) {
    res.status(500).json({ message: "Failed" })
  }
})

module.exports = router