"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import toast from "react-hot-toast"

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", role: "customer",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post("/auth/register", form)
      toast.success("Account created! Please check your email.")
      router.push("/login")
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Create Account</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="name" placeholder="Full name" onChange={handleChange}
          className="border p-3 rounded-lg" required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange}
          className="border p-3 rounded-lg" required />
        <input name="phone" placeholder="Phone number" onChange={handleChange}
          className="border p-3 rounded-lg" required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange}
          className="border p-3 rounded-lg" required />

        {/* User selects their role on registration */}
        <select name="role" onChange={handleChange} className="border p-3 rounded-lg">
          <option value="customer">Customer</option>
          <option value="seller">Seller</option>
        </select>

        <button type="submit" disabled={loading}
          className="bg-black text-white p-3 rounded-lg disabled:opacity-50">
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500">Login</a>
      </p>
    </div>
  )
}