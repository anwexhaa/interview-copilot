'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/app/auth-context'

const publicPaths = ['/signin', '/login']

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user && !publicPaths.includes(pathname)) {
      // Not logged in, trying to access a protected route
      router.replace('/signin')
    } else if (user && publicPaths.includes(pathname)) {
      // Logged in but trying to visit /auth/signin or /auth/login
      router.replace('/')
    }
  }, [user, loading, pathname, router])

  return <>{children}</>
}
