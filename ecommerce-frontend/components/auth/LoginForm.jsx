"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import toast from "react-hot-toast"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, loginWithGoogle } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await login({ email, password })
    setLoading(false)

    if (res?.error) {
      toast.error("Invalid email or password")
    } else {
      toast.success("Welcome back!")
      router.push("/")
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 rounded-lg"
          required
        />

        <a href="/forgot-password" className="text-sm text-blue-500">
          Forgot password?
        </a>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Bonus: Google login */}
      <button
        onClick={loginWithGoogle}
        className="w-full mt-4 border p-3 rounded-lg"
      >
        Continue with Google
      </button>

      <p className="text-center mt-4 text-sm">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-500">Register</a>
      </p>
    </div>
  )
}