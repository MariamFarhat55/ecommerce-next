import axios from "axios"
import { getSession } from "next-auth/react"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
})

// Automatically attach token from NextAuth session to every request
api.interceptors.request.use(async (config) => {
  const session = await getSession()
  if (session?.user?.token) {
    config.headers.Authorization = `Bearer ${session.user.token}`
  }
  return config
})

// Handle global errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login"
    }
    return Promise.reject(err)
  }
)

export default api
