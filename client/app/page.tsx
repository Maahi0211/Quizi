import Link from 'next/link'

// New Cherry Blossom SVG (simpler design)
const CherryBlossom = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="50" r="8" className="fill-pink-200" />
    <circle cx="30" cy="35" r="6" className="fill-pink-200" />
    <circle cx="70" cy="35" r="6" className="fill-pink-200" />
    <circle cx="30" cy="65" r="6" className="fill-pink-200" />
    <circle cx="70" cy="65" r="6" className="fill-pink-200" />
  </svg>
)

// Updated Gradient Blob Components with darker colors
const GradientBlob1 = () => (
  <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
)

const GradientBlob2 = () => (
  <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-l from-pink-900/20 to-purple-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
)

const GradientBlob3 = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-t from-pink-900/20 to-purple-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
)

// Updated Navbar with dark theme
const Navbar = () => (
  <div className="fixed top-0 left-0 right-0 z-50 px-4 py-6">
    <nav className="max-w-6xl mx-auto bg-gray-900/80 backdrop-blur-sm rounded-full shadow-xl px-6 py-3 border border-gray-800">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-light text-pink-400">
          Quizi
        </Link>
        <div className="flex items-center space-x-8">
          <Link href="/about" className="text-gray-300 hover:text-pink-400 transition">About</Link>
          <Link href="/features" className="text-gray-300 hover:text-pink-400 transition">Features</Link>
          <Link href="/contact" className="text-gray-300 hover:text-pink-400 transition">Contact</Link>
          <Link href="/login" className="text-gray-300 hover:text-pink-400 transition">Login</Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-pink-900/50 hover:bg-pink-800/50 text-pink-100 rounded-full transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  </div>
)

// Updated Footer with dark theme
const Footer = () => (
  <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-light text-pink-400">Quizi</Link>
          <Link href="/privacy" className="text-sm text-gray-300 hover:text-pink-400">Privacy</Link>
          <Link href="/terms" className="text-sm text-gray-300 hover:text-pink-400">Terms</Link>
          <Link href="/contact" className="text-sm text-gray-300 hover:text-pink-400">Contact</Link>
        </div>
        <div className="flex space-x-4">
          <Link href="#" className="text-gray-300 hover:text-pink-400">Twitter</Link>
          <Link href="#" className="text-gray-300 hover:text-pink-400">Instagram</Link>
          <Link href="#" className="text-gray-300 hover:text-pink-400">LinkedIn</Link>
        </div>
      </div>
      <div className="mt-4 text-center text-sm text-gray-400">
        <p>© 2024 Quizi. All rights reserved.</p>
      </div>
    </div>
  </footer>
)

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 relative overflow-hidden">
      {/* Background Blobs - Changed from fixed to relative positioning */}
      <div className="absolute inset-0">
        <GradientBlob1 />
        <GradientBlob2 />
        <GradientBlob3 />
      </div>

      {/* Rest of your content */}
      <div className="relative z-10"> {/* Added a wrapper with z-index */}
        <Navbar />

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative">
          <div className="absolute top-0 left-0 w-64 h-64 opacity-10 animate-float">
            <CherryBlossom />
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10 animate-float-delayed">
            <CherryBlossom />
          </div>

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h1 className="text-6xl md:text-7xl font-light text-gray-100 mb-6">
              Learn Smarter with <span className="text-pink-400">Quizi</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your learning journey with our innovative quiz platform.
              Create, share, and master knowledge together.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-pink-900/50 hover:bg-pink-800/50 text-pink-100 rounded-full transition"
              >
                Get Started Free
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 border border-pink-700/50 hover:bg-pink-900/30 text-pink-100 rounded-full transition"
              >
                Watch Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-light text-center text-gray-100 mb-16">Why Choose Quizi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 opacity-10">
                  <CherryBlossom />
                </div>
                <h3 className="text-2xl font-medium text-gray-100 mb-4">Smart Learning</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our AI-powered system adapts to your learning style, helping you focus on what matters most.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 opacity-10">
                  <CherryBlossom />
                </div>
                <h3 className="text-2xl font-medium text-gray-100 mb-4">Collaborative Study</h3>
                <p className="text-gray-300 leading-relaxed">
                  Create and share quizzes with friends, classmates, or study groups effortlessly.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 opacity-10">
                  <CherryBlossom />
                </div>
                <h3 className="text-2xl font-medium text-gray-100 mb-4">Progress Tracking</h3>
                <p className="text-gray-300 leading-relaxed">
                  Monitor your improvement with detailed analytics and personalized insights.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 opacity-10">
                  <CherryBlossom />
                </div>
                <h3 className="text-2xl font-medium text-gray-100 mb-4">Mobile Ready</h3>
                <p className="text-gray-300 leading-relaxed">
                  Learn anywhere, anytime with our fully responsive mobile experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-900/50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-light text-gray-100 mb-8">Ready to transform your learning?</h2>
            <Link
              href="/register"
              className="px-8 py-4 bg-pink-900/50 hover:bg-pink-800/50 text-pink-100 rounded-full transition inline-block"
            >
              Start Learning Now
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}