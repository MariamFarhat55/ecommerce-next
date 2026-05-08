import { useCartStore } from "@/store/cartStore"

// Simple hook to access cart state and actions
export function useCart() {
  const { items, addItem, removeItem, updateQty, clearCart, total } =
    useCartStore()

  return {
    items,
    count: items.reduce((sum, i) => sum + i.qty, 0), // total number of items
    total: total(),
    addItem,
    removeItem,
    updateQty,
    clearCart,
  }
}