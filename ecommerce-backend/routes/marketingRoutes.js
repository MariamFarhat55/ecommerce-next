const router = require("express").Router()
const User   = require("../models/User")

// Newsletter subscription
router.post("/newsletter", async (req, res, next) => {
  try {
    const { email } = req.body
    // Save email to DB or send to email service
    res.json({ message: "Subscribed successfully" })
  } catch (err) { next(err) }
})

module.exports = router