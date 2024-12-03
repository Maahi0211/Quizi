'use client'

import { useState } from 'react'
import { toast, Toaster } from 'sonner'
import TopBar from '../../components/TopBar'
import Sidebar from '../../components/Sidebar'
import GradientBlobs from '../../components/GradientBlobs'

interface Option {
  optionText: string
  isCorrect: boolean
}

interface Question {
  questionText: string
  options: Option[]
}

interface QuizData {
  title: string
  description: string
  questions: Question[]
}

export default function CreateQuizPage() {
  const [activeTab, setActiveTab] = useState('create')
  const [quizData, setQuizData] = useState<QuizData>({
    title: '',
    description: '',
    questions: [
      {
        questionText: '',
        options: [
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false }
        ]
      }
    ]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ... all the handlers remain the same ...
  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...quizData.questions]
    updatedQuestions[index].questionText = value
    setQuizData({ ...quizData, questions: updatedQuestions })
  }

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...quizData.questions]
    updatedQuestions[questionIndex].options[optionIndex].optionText = value
    setQuizData({ ...quizData, questions: updatedQuestions })
  }

  const handleCorrectAnswerChange = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...quizData.questions]
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.map(
      (option, index) => ({ ...option, isCorrect: index === optionIndex })
    )
    setQuizData({ ...quizData, questions: updatedQuestions })
  }

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          questionText: '',
          options: [
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false }
          ]
        }
      ]
    })
  }

  const removeQuestion = (index: number) => {
    const updatedQuestions = quizData.questions.filter((_, i) => i !== index)
    setQuizData({ ...quizData, questions: updatedQuestions })
  }

  const handleSubmit = async () => {
    // Validation
    if (!quizData.title.trim()) {
      toast.error('Please enter a quiz title')
      return
    }

    if (!quizData.description.trim()) {
      toast.error('Please enter a quiz description')
      return
    }

    // Validate questions
    const invalidQuestion = quizData.questions.find(
      q => !q.questionText.trim() || q.options.some(o => !o.optionText.trim())
    )
    if (invalidQuestion) {
      toast.error('Please fill in all questions and options')
      return
    }

    // Check if each question has a correct answer
    const missingCorrectAnswer = quizData.questions.find(
      q => !q.options.some(o => o.isCorrect)
    )
    if (missingCorrectAnswer) {
      toast.error('Please select a correct answer for each question')
      return
    }

    try {
      setIsSubmitting(true)
      
      toast.promise(
        fetch('http://localhost:8080/quiz/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(quizData)
        }),
        {
          loading: 'Creating quiz...',
          success: () => {
            // Reset form
            setQuizData({
              title: '',
              description: '',
              questions: [
                {
                  questionText: '',
                  options: [
                    { optionText: '', isCorrect: false },
                    { optionText: '', isCorrect: false },
                    { optionText: '', isCorrect: false },
                    { optionText: '', isCorrect: false }
                  ]
                }
              ]
            })
            return 'Quiz created successfully!'
          },
          error: 'Failed to create quiz'
        }
      )
    } catch (error) {
      console.error('Error creating quiz:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50 relative">
      <div className="absolute inset-0 overflow-hidden">
        <GradientBlobs />
      </div>

      <div className="relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="ml-64 p-8">
          <TopBar />
          
          <div className="space-y-6 max-w-4xl mx-auto">
            <Toaster richColors position="top-right" />
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-gray-800">Create New Quiz</h2>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Creating...</span>
                ) : (
                  <>
                    <span>Publish Quiz</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {/* Quiz Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-pink-100">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={quizData.title}
                    onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition"
                    placeholder="Enter quiz title..."
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={quizData.description}
                    onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition"
                    placeholder="Enter quiz description..."
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {quizData.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-pink-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium text-gray-800">Question {questionIndex + 1}</span>
                    {quizData.questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-500 hover:text-red-600 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition mb-4"
                    placeholder="Enter your question..."
                  />

                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`correct-answer-${questionIndex}`}
                          checked={option.isCorrect}
                          onChange={() => handleCorrectAnswerChange(questionIndex, optionIndex)}
                          className="text-pink-600 focus:ring-pink-500"
                        />
                        <input
                          type="text"
                          value={option.optionText}
                          onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition"
                          placeholder={`Option ${optionIndex + 1}...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={addQuestion}
                className="w-full px-4 py-3 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg transition flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Question</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 