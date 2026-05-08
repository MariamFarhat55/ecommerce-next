"use client"
import { signIn } from "next-auth/react"

// Bonus: Reusable social login buttons component
export default function SocialLogin() {
  return (
    <div className="flex flex-col gap-3 mt-4">
      <button
        onClick={() => signIn("google")}
        className="flex items-center justify-center gap-2 border p-3 rounded-lg hover:bg-gray-50"
      >
        Continue with Google
      </button>
    </div>
  )
}