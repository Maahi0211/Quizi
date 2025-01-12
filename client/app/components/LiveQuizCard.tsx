'use client'

import { Quiz } from '@/types/quiz'
import { useRouter } from 'next/navigation'

interface LiveQuizCardProps {
  quiz: Quiz;
}

export default function LiveQuizCard({ quiz }: LiveQuizCardProps) {
  const router = useRouter()

  const handleJoinQuiz = () => {
    router.push(`/app/take-quiz/${quiz.id}`)
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 
      hover:border-pink-700/50 transition group">
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-sm text-green-400">Live Now</span>
        </span>
        <span className="text-sm text-gray-400">
          {`${quiz.questions.length} questions`}
        </span>
      </div>

      <h3 className="text-xl font-medium text-gray-100 mb-2 group-hover:text-pink-300">
        {quiz.title}
      </h3>

      <div className="flex items-center space-x-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-pink-900/30 border border-pink-700/30"></div>
        <span className="text-sm text-gray-300">Hosted by {quiz.creatorName}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="px-2 py-1 bg-pink-900/30 text-pink-300 rounded-full text-xs border border-pink-700/30">
          Quiz
        </span>
        <button 
          onClick={handleJoinQuiz}
          className="px-4 py-2 bg-pink-900/50 hover:bg-pink-800/50 text-pink-100 
            rounded-lg transition flex items-center space-x-2 border border-pink-700/30"
        >
          <span>Join Now</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
} 