'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface UserStats {
  totalQuizzesTaken: number
  totalQuizzesCreated: number
}

export default function StatsGrid() {
  const [stats, setStats] = useState<UserStats>({
    totalQuizzesTaken: 0,
    totalQuizzesCreated: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const userEmail = localStorage.getItem('userEmail')
        
        if (!token || !userEmail) {
          toast.error('Please log in to view stats')
          return
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/stats?email=${userEmail}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Failed to fetch stats')
        
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
        toast.error('Failed to load stats')
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">Quizzes Created</p>
          <p className="text-2xl font-light text-gray-100 mt-1">{stats.totalQuizzesCreated}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-pink-900/30 flex items-center justify-center">
          <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </div>

      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">Quizzes Taken</p>
          <p className="text-2xl font-light text-gray-100 mt-1">{stats.totalQuizzesTaken}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-pink-900/30 flex items-center justify-center">
          <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </div>
    </div>
  )
}