import NextAuth from "next-auth"
import { authOptions } from "@/lib/authOptions"

// This single file handles all NextAuth routes (login, logout, session...)
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }