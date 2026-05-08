import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Toggle product in wishlist (add if not exists, remove if exists)
      toggleItem: (product) => {
        const exists = get().items.find((i) => i._id === product._id)
        if (exists) {
          set({ items: get().items.filter((i) => i._id !== product._id) })
        } else {
          set({ items: [...get().items, product] })
        }
      },

      // Check if a product is in the wishlist
      isWishlisted: (id) => get().items.some((i) => i._id === id),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "wishlist-storage" }
  )
)