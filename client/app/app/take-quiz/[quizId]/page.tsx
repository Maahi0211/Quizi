'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import TopBar from '../../../components/TopBar'
import Sidebar from '../../../components/Sidebar'
import GradientBlobs from '../../../components/GradientBlobs'
import { toast, Toaster } from 'sonner'

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
  questions: Question[]
}

export default function TakeQuizPage() {
  const params = useParams()
  const quizId = params.quizId
  const [activeTab, setActiveTab] = useState('takeQuiz')
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<{ [key: number]: number | null }>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:8080/quiz/${quizId}`, {
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

    if (quizId) {
      fetchQuiz()
    }
  }, [quizId])

  const handleOptionSelect = (questionId: number, optionId: number) => {
    setAnswers({ ...answers, [questionId]: optionId })
  }

  const handleSubmit = () => {
    // Here you can handle the submission of the quiz answers
    console.log('Submitted answers:', answers)
    toast.success('Quiz submitted successfully!')
  }

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
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-pink-100 rounded w-1/3 mx-auto"></div>
                <div className="h-4 bg-pink-100 rounded w-1/4 mx-auto"></div>
              </div>
            ) : quiz ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-pink-100">
                <h1 className="text-2xl font-medium text-gray-800 mb-4">{quiz.title}</h1>
                <p className="text-gray-500 mb-6">{quiz.description}</p>

                {quiz.questions.map((question) => (
                  <div key={question.id} className="mb-6">
                    <h2 className="text-lg font-medium text-gray-800 mb-2">{question.questionText}</h2>
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <div key={option.id} className="flex items-center">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={answers[question.id] === option.id}
                            onChange={() => handleOptionSelect(question.id, option.id)}
                            className="text-pink-600 focus:ring-pink-500"
                          />
                          <label className="ml-2 text-gray-700">{option.optionText}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition"
                >
                  Submit Quiz
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Failed to load quiz. Please try again later.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 