'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface UserStats {
  totalQuizzesTaken: number
  totalQuizzesCreated: number
  averageScore: number
}

export default function StatsGrid() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const userEmail = localStorage.getItem('userEmail') // Make sure you store user's email during login
        
        if (!token || !userEmail) {
          toast.error('Authentication information missing')
          return
        }

        const response = await fetch(`http://localhost:8080/auth/stats?email=${userEmail}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
        toast.error('Failed to load statistics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-pink-100">
            <div className="animate-pulse">
              <div className="h-4 bg-pink-100 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-pink-100 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-pink-100 hover:border-pink-200 transition">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Quizzes Created</h3>
        <p className="text-3xl text-gray-800">
          {stats?.totalQuizzesCreated || 0}
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-pink-100 hover:border-pink-200 transition">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Quizzes Taken</h3>
        <p className="text-3xl text-gray-800">
          {stats?.totalQuizzesTaken || 0}
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-pink-100 hover:border-pink-200 transition">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Average Score</h3>
        <p className="text-3xl text-gray-800">
          {stats?.averageScore ? `${stats.averageScore}%` : '0%'}
        </p>
      </div>
    </div>
  )
}