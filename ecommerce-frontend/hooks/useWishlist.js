import { useWishlistStore } from "@/store/wishlistStore"

export function useWishlist() {
  const { items, toggleItem, isWishlisted, clearWishlist } =
    useWishlistStore()

  return {
    items,
    count: items.length,
    toggleItem,
    isWishlisted,
    clearWishlist,
  }
}