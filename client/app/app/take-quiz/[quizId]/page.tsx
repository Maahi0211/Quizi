'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast, Toaster } from 'sonner'
import TopBar from '../../../components/TopBar'
import Sidebar from '../../../components/Sidebar'
import GradientBlobs from '../../../components/GradientBlobs'

interface Option {
  id: number
  optionText: string
}

interface Question {
  id: number
  questionText: string
  options: Option[]
}

interface Quiz {
  id: number
  title: string
  description: string
  creatorName: string
  questions: Question[]
}

interface QuizSubmissionResponse {
  id: number
  quizId: number
  userId: number
  score: number
  quizTitle: string
  userEmail: string
  submittedAt: string
}

export default function TakeQuiz() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('takeQuiz')
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResponse | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          toast.error('Please log in to take the quiz')
          router.push('/login')
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/${params.quizId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch quiz')
        }

        const data = await response.json()
        setQuiz(data)
      } catch (error) {
        console.error('Error fetching quiz:', error)
        toast.error('Failed to load quiz')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.quizId) {
      fetchQuiz()
    }
  }, [params.quizId, router])

  const handleOptionSelect = (questionId: number, optionId: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!quiz) return

    // Check if all questions are answered
    const unansweredQuestions = quiz.questions.filter(q => !selectedAnswers[q.id])
    if (unansweredQuestions.length > 0) {
      toast.error(`Please answer all questions before submitting`)
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      // Format the answers object correctly
      const requestBody = {
        quizId: quiz.id,
        answers: selectedAnswers // This is already in the format { questionId: optionId }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error('Failed to submit quiz')
      }

      const result = await response.json()
      setSubmissionResult(result)
      setIsSubmitted(true)
      toast.success('Quiz submitted successfully!')
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Failed to submit quiz')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 relative">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-400"></div>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 relative">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center text-gray-400">Quiz not found</div>
        </div>
      </div>
    )
  }

  if (isSubmitted && submissionResult) {
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
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-medium text-gray-100 mb-4">Quiz Completed!</h1>
                  <h2 className="text-xl text-gray-300 mb-2">{submissionResult.quizTitle}</h2>
                  <p className="text-gray-400">Submitted on {new Date(submissionResult.submittedAt).toLocaleString()}</p>
                </div>

                <div className="flex justify-center mb-8">
                  <div className="bg-pink-900/30 rounded-full p-8 border border-pink-700/30">
                    <div className="text-4xl font-bold text-pink-300">
                      {submissionResult.score}
                    </div>
                    <div className="text-sm text-pink-400 mt-1">Score</div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => router.push('/app')}
                    className="px-6 py-2 bg-pink-900/50 hover:bg-pink-800/50 text-pink-100 
                      rounded-lg transition border border-pink-700/30"
                  >
                    Back to Dashboard
                  </button>
                  <button
                    onClick={() => router.push('/app/my-quizzes')}
                    className="px-6 py-2 bg-pink-900/50 hover:bg-pink-800/50 text-pink-100 
                      rounded-lg transition border border-pink-700/30"
                  >
                    View All Attempts
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]

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
              <div className="mb-8">
                <h1 className="text-2xl font-medium text-gray-100 mb-2">{quiz.title}</h1>
                <p className="text-gray-300">{quiz.description}</p>
                <p className="text-sm text-gray-400 mt-2">Created by {quiz.creatorName}</p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-200">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                  </h2>
                  <div className="text-sm text-gray-400">
                    {Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}% Complete
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl text-gray-100 mb-4">{currentQuestion.questionText}</h3>
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className={`p-4 rounded-lg border cursor-pointer transition ${
                        selectedAnswers[currentQuestion.id] === option.id
                          ? 'border-pink-500 bg-pink-900/30'
                          : 'border-gray-700 hover:border-pink-700/50 bg-gray-800/30'
                      }`}
                      onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                    >
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          checked={selectedAnswers[currentQuestion.id] === option.id}
                          onChange={() => handleOptionSelect(currentQuestion.id, option.id)}
                          className="text-pink-600 focus:ring-pink-500 bg-gray-800 border-gray-700"
                        />
                        <span className="ml-3 text-gray-200">{option.optionText}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`px-6 py-2 rounded-lg transition border ${
                    currentQuestionIndex === 0
                      ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed border-gray-700'
                      : 'bg-pink-900/50 text-pink-100 hover:bg-pink-800/50 border-pink-700/30'
                  }`}
                >
                  Previous
                </button>
                
                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-pink-900/50 hover:bg-pink-800/50 text-pink-100 
                      rounded-lg transition border border-pink-700/30"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-pink-900/50 hover:bg-pink-800/50 text-pink-100 
                      rounded-lg transition border border-pink-700/30"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 