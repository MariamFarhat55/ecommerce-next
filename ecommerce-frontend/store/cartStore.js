import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Add product to cart or increase quantity if already exists
      addItem: (product) => {
        const exists = get().items.find((i) => i._id === product._id)
        if (exists) {
          set({
            items: get().items.map((i) =>
              i._id === product._id ? { ...i, qty: i.qty + 1 } : i
            ),
          })
        } else {
          set({ items: [...get().items, { ...product, qty: 1 }] })
        }
      },

      // Remove product from cart
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i._id !== id) }),

      // Update quantity of a specific product
      updateQty: (id, qty) =>
        set({
          items: get().items.map((i) =>
            i._id === id ? { ...i, qty } : i
          ),
        }),

      clearCart: () => set({ items: [] }),

      // Calculate total price
      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    // Saves cart to localStorage so it persists on page refresh
    { name: "cart-storage" }
  )
)