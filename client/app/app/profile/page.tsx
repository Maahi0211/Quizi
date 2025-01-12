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
        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user-detail`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        })

        // Fetch stats
        const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/stats?email=${userEmail}`, {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 relative">
      <Toaster richColors position="top-right" />
      <div className="absolute inset-0 overflow-hidden">
        <GradientBlobs />
      </div>

      <div className="relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="ml-64 p-8">
          <TopBar />
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-8 border border-gray-800">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-32 w-32 bg-gray-800 rounded-full mx-auto"></div>
                  <div className="h-8 bg-gray-800 rounded w-1/3 mx-auto"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/4 mx-auto"></div>
                </div>
              ) : profile ? (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-900/50 mx-auto">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
                        alt="Profile Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h1 className="text-2xl font-medium text-gray-100 mt-4">
                      {profile.username}
                    </h1>
                    <p className="text-gray-400">{profile.email}</p>
                    {profile.role && (
                      <span className="inline-block mt-2 px-3 py-1 bg-pink-900/50 text-pink-100 
                        rounded-full text-sm border border-pink-700/30">
                        {profile.role}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="text-2xl font-medium text-gray-100">
                        {stats?.totalQuizzesCreated || 0}
                      </div>
                      <div className="text-sm text-pink-400">Quizzes Created</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="text-2xl font-medium text-gray-100">
                        {stats?.totalQuizzesTaken || 0}
                      </div>
                      <div className="text-sm text-pink-400">Quizzes Taken</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="text-2xl font-medium text-gray-100">
                        {stats?.averageScore || 0}%
                      </div>
                      <div className="text-sm text-pink-400">Average Score</div>
                    </div>
                  </div>

                  <button className="px-6 py-2 bg-pink-900/50 hover:bg-pink-800/50 text-pink-100 
                    rounded-lg transition border border-pink-700/30">
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-400">
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