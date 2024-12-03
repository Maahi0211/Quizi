export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[
        { title: 'Quizzes Created', value: '12' },
        { title: 'Quizzes Taken', value: '48' },
        { title: 'Average Score', value: '85%' }
      ].map((stat, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-pink-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.title}</h3>
          <p className="text-3xl text-gray-800">{stat.value}</p>
        </div>
      ))}
    </div>
  )
} 