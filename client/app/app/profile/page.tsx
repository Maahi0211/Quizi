'use client'

import { useState, useEffect } from 'react'
import { toast, Toaster } from 'sonner'
import TopBar from '../../components/TopBar'
import Sidebar from '../../components/Sidebar'
import GradientBlobs from '../../components/GradientBlobs'

interface UserProfile {
  id: number
  username: string
  email: string
  role: string | null
}

interface UserStats {
  totalQuizzesTaken: number
  totalQuizzesCreated: number
  averageScore: number
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const userEmail = localStorage.getItem('userEmail')

        if (!token || !userEmail) {
          toast.error('Please log in to view your profile')
          return
        }

        // Fetch profile
        const profileResponse = await fetch('http://localhost:8080/auth/user-detail', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        })

        // Fetch stats
        const statsResponse = await fetch(`http://localhost:8080/auth/stats?email=${userEmail}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!profileResponse.ok || !statsResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const profileData = await profileResponse.json()
        const statsData = await statsResponse.json()

        setProfile(profileData)
        setStats(statsData)
      } catch (error) {
        console.error('Error:', error)
        toast.error('Failed to load profile data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileAndStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50 relative">
      <Toaster richColors position="top-right" />
      <div className="absolute inset-0 overflow-hidden">
        <GradientBlobs />
      </div>

      <div className="relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="ml-64 p-8">
          <TopBar />
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-pink-100">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-32 w-32 bg-pink-100 rounded-full mx-auto"></div>
                  <div className="h-8 bg-pink-100 rounded w-1/3 mx-auto"></div>
                  <div className="h-4 bg-pink-100 rounded w-1/4 mx-auto"></div>
                </div>
              ) : profile ? (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-200 mx-auto">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
                        alt="Profile Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h1 className="text-2xl font-medium text-gray-800 mt-4">
                      {profile.username}
                    </h1>
                    <p className="text-gray-500">{profile.email}</p>
                    {profile.role && (
                      <span className="inline-block mt-2 px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                        {profile.role}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-pink-50 rounded-lg p-4">
                      <div className="text-2xl font-medium text-pink-900">
                        {stats?.totalQuizzesCreated || 0}
                      </div>
                      <div className="text-sm text-pink-600">Quizzes Created</div>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-4">
                      <div className="text-2xl font-medium text-pink-900">
                        {stats?.totalQuizzesTaken || 0}
                      </div>
                      <div className="text-sm text-pink-600">Quizzes Taken</div>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-4">
                      <div className="text-2xl font-medium text-pink-900">
                        {stats?.averageScore || 0}%
                      </div>
                      <div className="text-sm text-pink-600">Average Score</div>
                    </div>
                  </div>

                  <button className="px-6 py-2 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded-lg transition">
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  Failed to load profile. Please try again later.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 