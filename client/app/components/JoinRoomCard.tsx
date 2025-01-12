export default function JoinRoomCard() {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-dashed border-gray-700 
      rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4 
      hover:border-pink-700/50 transition cursor-pointer group">
      <div className="w-12 h-12 rounded-full bg-pink-900/30 flex items-center justify-center 
        group-hover:bg-pink-800/40 transition border border-pink-700/30">
        <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <div>
        <h3 className="font-medium text-gray-100 mb-1 group-hover:text-pink-300">Join with Code</h3>
        <p className="text-sm text-gray-400">Enter a room code to join a private quiz</p>
      </div>
    </div>
  )
} 