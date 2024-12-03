'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Cherry Blossom SVG Components
const CherryBlossom1 = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full fill-pink-200">
    <path d="M100 10c-4.5 0-8 3.5-8 8s3.5 8 8 8 8-3.5 8-8-3.5-8-8-8zm0 30c-4.5 0-8 3.5-8 8s3.5 8 8 8 8-3.5 8-8-3.5-8-8-8zm30 0c-4.5 0-8 3.5-8 8s3.5 8 8 8 8-3.5 8-8-3.5-8-8-8zm-60 0c-4.5 0-8 3.5-8 8s3.5 8 8 8 8-3.5 8-8-3.5-8-8-8zm30 30c-4.5 0-8 3.5-8 8s3.5 8 8 8 8-3.5 8-8-3.5-8-8-8z"/>
  </svg>
)

const CherryBlossom2 = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full fill-pink-200">
    <path d="M100 10c-4.5 0-8 3.5-8 8s3.5 8 8 8 8-3.5 8-8-3.5-8-8-8zm-30 30c-4.5 0-8 3.5-8 8s3.5 8 8 8 8-3.5 8-8-3.5-8-8-8zm60 0c-4.5 0-8 3.5-8 8s3.5 8 8 8 8-3.5 8-8-3.5-8-8-8zm-30 30c-4.5 0-8 3.5-8 8s3.5 8 8 8 8-3.5 8-8-3.5-8-8-8z"/>
  </svg>
)

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          email,
          password,
        }),
      })

      const data = await response.text()

      if (response.ok) {
        // Registration successful
        router.push('/login')
      } else {
        // Registration failed
        setError(data || 'Registration failed')
      }
    } catch (err) {
      setError('An error occurred during registration')
      console.error('Registration error:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-pink-50 relative overflow-hidden">
      {/* Decorative cherry blossoms */}
      <div className="absolute top-0 left-0 w-64 h-64 opacity-20">
        <CherryBlossom1 />
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20">
        <CherryBlossom2 />
      </div>

      {/* register Form */}
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg space-y-6 relative z-10">
        <div className="text-center">
          <h1 className="text-3xl font-extralight text-gray-800 mb-2">Create Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-pink-100 rounded-md focus:ring-pink-200 focus:border-pink-200 outline-none transition"
              placeholder="Your Username"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-pink-100 rounded-md focus:ring-pink-200 focus:border-pink-200 outline-none transition"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-pink-100 rounded-md focus:ring-pink-200 focus:border-pink-200 outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-pink-100 rounded-md focus:ring-pink-200 focus:border-pink-200 outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded-md transition duration-200 ease-in-out"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-pink-600 hover:text-pink-700">
            Sign in
          </Link>
        </div>

        <div className="text-xs text-center text-gray-500">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-pink-600 hover:text-pink-700">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-pink-600 hover:text-pink-700">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
