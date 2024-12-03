import { Quiz } from '@/types/quiz'

interface LiveQuizCardProps {
  quiz: Quiz;
}

export default function LiveQuizCard({ quiz }: LiveQuizCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-pink-100 rounded-xl p-6 hover:border-pink-200 transition group">
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm text-green-600">Live Now</span>
        </span>
        <span className="text-sm text-gray-500">
          {`${quiz.questions.length} questions`}
        </span>
      </div>

      <h3 className="text-xl font-medium text-gray-800 mb-2 group-hover:text-pink-900">
        {quiz.title}
      </h3>

      <div className="flex items-center space-x-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-pink-100"></div>
        <span className="text-sm text-gray-600">Hosted by {quiz.creatorName}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="px-2 py-1 bg-pink-50 text-pink-600 rounded-full text-xs">
          Quiz
        </span>
        <button className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded-lg transition flex items-center space-x-2">
          <span>Join Now</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
} 