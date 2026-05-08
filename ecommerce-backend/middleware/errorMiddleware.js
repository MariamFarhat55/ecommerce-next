module.exports = (err, req, res, next) => {
  console.error("❌ Error:", err.message) 
  console.error(err.stack)                 
  const status = err.statusCode ?? 500
  res.status(status).json({
    message: err.message ?? "Server Error",
  })
}