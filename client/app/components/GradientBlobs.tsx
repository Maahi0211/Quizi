export default function GradientBlobs() {
  return (
    <>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-pink-100/30 to-purple-100/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-pink-100/30 to-purple-100/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
    </>
  )
} 