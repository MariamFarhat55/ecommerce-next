import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // بيتكلم مع الـ Backend مباشرة
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            { email: credentials.email, password: credentials.password }
          )
          const { user, token } = res.data
          if (user) return { ...user, token }
          return null
        } catch {
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role  = user.role
        token.token = user.token // ← الـ JWT من الـ Backend
      }
      return token
    },
    async session({ session, token }) {
      session.user.role  = token.role
      session.user.token = token.token
      return session
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
}