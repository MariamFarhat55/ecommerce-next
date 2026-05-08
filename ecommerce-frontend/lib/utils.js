// Format price to currency string
export const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price)

// Truncate long text
export const truncate = (text, length = 100) =>
  text.length > length ? text.slice(0, length) + "..." : text

// Get first letters of name for avatar
export const getInitials = (name) =>
  name?.split(" ").map((n) => n[0]).join("").toUpperCase() ?? "U"