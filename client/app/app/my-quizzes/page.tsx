'use client'

import { useState, useEffect } from 'react'
import { toast, Toaster } from 'sonner'
import TopBar from '../../components/TopBar'
import Sidebar from '../../components/Sidebar'
import GradientBlobs from '../../components/GradientBlobs'
import ConfirmationModal from '../../components/ConfirmationModal'

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

export default function MyQuizzes() {
  const [activeTab, setActiveTab] = useState('myQuizzes')
  const [myQuizzes, setMyQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<number | null>(null)

  useEffect(() => {
    const fetchMyQuizzes = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:8080/quiz/my-quizzes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        setMyQuizzes(data)
      } catch (error) {
        console.error('Error fetching my quizzes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMyQuizzes()
  }, [])

  const handleDeleteClick = (quizId: number) => {
    setQuizToDelete(quizId)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/quiz/delete/${quizToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete quiz')
      }

      toast.success('Quiz deleted successfully')
      setMyQuizzes(myQuizzes.filter(quiz => quiz.id !== quizToDelete))
    } catch (error) {
      console.error('Error deleting quiz:', error)
      toast.error('Failed to delete quiz')
    } finally {
      setIsDeleteModalOpen(false)
      setQuizToDelete(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50 relative">
      <Toaster richColors position="top-right" />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Quiz"
        message="Are you sure you want to delete this quiz? This action cannot be undone."
      />
      
      <div className="absolute inset-0 overflow-hidden">
        <GradientBlobs />
      </div>

      <div className="relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="ml-64 p-8">
          <TopBar />

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-gray-800">My Quizzes</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm border border-pink-100 rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-pink-100 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-pink-100 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-pink-100 rounded w-1/4"></div>
                  </div>
                ))
              ) : (
                myQuizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-white/80 backdrop-blur-sm border border-pink-100 rounded-xl p-6 hover:border-pink-200 transition group">
                    <h3 className="text-xl font-medium text-gray-800 mb-2 group-hover:text-pink-900">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{quiz.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{quiz.questions.length} questions</span>
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded-lg transition">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(quiz.id)}
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 