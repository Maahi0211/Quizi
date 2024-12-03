'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

interface UserProfile {
  id: number
  username: string
  email: string
  role: string | null
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    if (tab === 'myQuizzes') {
      router.push('/app/my-quizzes')
    } else if (tab === 'create') {
      router.push('/app/create-quiz')
    } else if (tab === 'profile') {
      router.push('/app/profile')
    } else {
      router.push('/app')
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('No token found')
          return
        }

        const response = await fetch('http://localhost:8080/auth/user-detail', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }

        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()
  }, [])

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-sm border-r border-pink-100 p-6">
      <div className="mb-8">
        <Link href="/app">
          <h1 className="text-2xl font-light text-pink-600">Quizi</h1>
          <p className="text-sm text-gray-500 mt-1">
            {profile ? `Welcome, ${profile.username}` : 'Welcome'}
          </p>
        </Link>
      </div>

      <nav className="space-y-2">
        {['overview', 'myQuizzes', 'create', 'profile'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              activeTab === tab
                ? 'bg-pink-50 text-pink-900'
                : 'text-gray-600 hover:bg-pink-50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>
    </aside>
  )
} 