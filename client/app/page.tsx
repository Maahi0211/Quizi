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

// Gradient Blob Components
const GradientBlob1 = () => (
  <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-pink-100/30 to-purple-100/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
)

const GradientBlob2 = () => (
  <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-l from-pink-100/30 to-purple-100/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
)

const GradientBlob3 = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-t from-pink-100/30 to-purple-100/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
)

const Navbar = () => (
  <div className="fixed top-0 left-0 right-0 z-50 px-4 py-6">
    <nav className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-full shadow-md px-6 py-3">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-light text-pink-600">
          Quizi
        </Link>
        <div className="flex items-center space-x-8">
          <Link href="/about" className="text-gray-600 hover:text-pink-600 transition">About</Link>
          <Link href="/features" className="text-gray-600 hover:text-pink-600 transition">Features</Link>
          <Link href="/contact" className="text-gray-600 hover:text-pink-600 transition">Contact</Link>
          <Link href="/login" className="text-gray-600 hover:text-pink-600 transition">Login</Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded-full transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  </div>
)

const Footer = () => (
  <footer className="bg-white/80 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-light text-pink-600">Quizi</Link>
          <Link href="/privacy" className="text-sm text-gray-600 hover:text-pink-600">Privacy</Link>
          <Link href="/terms" className="text-sm text-gray-600 hover:text-pink-600">Terms</Link>
          <Link href="/contact" className="text-sm text-gray-600 hover:text-pink-600">Contact</Link>
        </div>
        <div className="flex space-x-4">
          <Link href="#" className="text-gray-600 hover:text-pink-600">Twitter</Link>
          <Link href="#" className="text-gray-600 hover:text-pink-600">Instagram</Link>
          <Link href="#" className="text-gray-600 hover:text-pink-600">LinkedIn</Link>
        </div>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Â© 2024 Quizi. All rights reserved.</p>
      </div>
    </div>
  </footer>
)

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50 relative overflow-hidden">
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
          <div className="absolute top-0 left-0 w-64 h-64 opacity-20 animate-float">
            <CherryBlossom />
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20 animate-float-delayed">
            <CherryBlossom />
          </div>

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h1 className="text-6xl md:text-7xl font-light text-gray-800 mb-6">
              Learn Smarter with <span className="text-pink-600">Quizi</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your learning journey with our innovative quiz platform.
              Create, share, and master knowledge together.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded-full transition"
              >
                Get Started Free
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 border border-pink-200 hover:bg-pink-50 text-pink-900 rounded-full transition"
              >
                Watch Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-light text-center text-gray-800 mb-16">Why Choose Quizi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 opacity-20">
                  <CherryBlossom />
                </div>
                <h3 className="text-2xl font-medium text-gray-800 mb-4">Smart Learning</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI-powered system adapts to your learning style, helping you focus on what matters most.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 opacity-20">
                  <CherryBlossom />
                </div>
                <h3 className="text-2xl font-medium text-gray-800 mb-4">Collaborative Study</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create and share quizzes with friends, classmates, or study groups effortlessly.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 opacity-20">
                  <CherryBlossom />
                </div>
                <h3 className="text-2xl font-medium text-gray-800 mb-4">Progress Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor your improvement with detailed analytics and personalized insights.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 opacity-20">
                  <CherryBlossom />
                </div>
                <h3 className="text-2xl font-medium text-gray-800 mb-4">Mobile Ready</h3>
                <p className="text-gray-600 leading-relaxed">
                  Learn anywhere, anytime with our fully responsive mobile experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white/50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-light text-gray-800 mb-8">Ready to transform your learning?</h2>
            <Link
              href="/register"
              className="px-8 py-4 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded-full transition inline-block"
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