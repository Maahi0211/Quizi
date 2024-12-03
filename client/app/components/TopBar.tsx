'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TopBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  const handleProfileClick = () => {
    router.push('/app/profile')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="flex justify-between items-center mb-8 relative">
      <div>
        <h2 className="text-2xl font-light text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-200 hover:border-pink-300 transition focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
          >
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-pink-100 z-50">
              <button
                onClick={handleProfileClick}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-pink-50 transition"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 