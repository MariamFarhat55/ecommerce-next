const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const Order  = require("../models/Order")

// @POST /api/payments/stripe/intent
exports.createStripeIntent = async (req, res, next) => {
  try {
    const order = await Order.findById(req.body.orderId)
    if (!order) return res.status(404).json({ message: "Order not found" })

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.round(order.total * 100), // cents
      currency: "usd",
      metadata: { orderId: order._id.toString() },
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) { next(err) }
}

// @POST /api/payments/stripe/webhook
exports.stripeWebhook = async (req, res) => {
  const sig   = req.headers["stripe-signature"]
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return res.status(400).send("Webhook error")
  }

  if (event.type === "payment_intent.succeeded") {
    const { orderId } = event.data.object.metadata
    await Order.findByIdAndUpdate(orderId, { isPaid: true, paidAt: new Date() })
  }

  res.json({ received: true })
}