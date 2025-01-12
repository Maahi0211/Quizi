'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast, Toaster } from 'sonner'
import GradientBlobs from '../components/GradientBlobs'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Authentication failed`)
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('userEmail', email)
      router.push('/app')
    } catch (error) {
      console.error('Login error:', error)
      toast.error(`Login failed. Please check your credentials.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 relative">
      <Toaster richColors position="top-right" />
      <div className="absolute inset-0 overflow-hidden">
        <GradientBlobs />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl border border-gray-800 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-100">Welcome Back</h1>
            <p className="text-gray-400 mt-2">Sign in to continue to Quizi</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg 
                  focus:ring-pink-500/30 focus:border-pink-500/30 text-gray-100 placeholder-gray-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg 
                  focus:ring-pink-500/30 focus:border-pink-500/30 text-gray-100 placeholder-gray-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-pink-900/50 hover:bg-pink-800/50 text-pink-100 
                rounded-lg transition flex items-center justify-center space-x-2 
                disabled:opacity-50 disabled:cursor-not-allowed border border-pink-700/30"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-center text-gray-400">
              Don&apos;t have an account?{` `}
              <Link href="/register" className="text-pink-400 hover:text-pink-300 transition">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}