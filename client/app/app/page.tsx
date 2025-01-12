'use client'

import { useState, useEffect } from 'react'
import GradientBlobs from '../components/GradientBlobs'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import StatsGrid from '../components/StatsGrid'
import LiveQuizCard from '../components/LiveQuizCard'
import JoinRoomCard from '../components/JoinRoomCard'
import CreateQuiz from '../components/CreateQuiz'
import { Quiz } from '../../types/quiz'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/all`)
        const data = await response.json()
        setAvailableQuizzes(data)
      } catch (error) {
        console.error('Error fetching quizzes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'create':
        return <CreateQuiz />
      case 'overview':
        return (
          <>
            <StatsGrid />
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-gray-100">Live Quizzes</h2>
                <button className="text-sm text-pink-400 hover:text-pink-300 flex items-center space-x-1">
                  <span>View All</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  Array(3).fill(0).map((_, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 animate-pulse"
                    >
                      <div className="h-4 bg-gray-800 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/2 mb-3"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/4"></div>
                    </div>
                  ))
                ) : (
                  <>
                    {availableQuizzes.map((quiz) => (
                      <LiveQuizCard key={quiz.id} quiz={quiz} />
                    ))}
                    <JoinRoomCard />
                  </>
                )}
              </div>
            </div>
          </>
        )
      default:
        return <div className="text-gray-300">Coming Soon...</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 relative">
      <div className="absolute inset-0 overflow-hidden">
        <GradientBlobs />
      </div>

      <div className="relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="ml-64 p-8">
          <TopBar />
          {renderContent()}
        </main>
      </div>
    </div>
  )
}