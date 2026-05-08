import { useSession, signIn, signOut } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user,
    role: session?.user?.role,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    // Login with email and password
    login: (credentials) =>
      signIn("credentials", { ...credentials, redirect: false }),
    // Bonus: Login with Google
    loginWithGoogle: () => signIn("google"),
    logout: () => signOut({ callbackUrl: "/" }),
  }
}