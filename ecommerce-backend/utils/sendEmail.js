const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Test SMTP connection
    await transporter.verify()

    // Send email
    const info = await transporter.sendMail({
      from: `"Luxe Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    })

    console.log("✅ Email sent:", info.response)
  } catch (err) {
    console.error("❌ Email Error:")
    console.error(err)
    throw new Error("Email could not be sent")
  }
}

module.exports = sendEmail