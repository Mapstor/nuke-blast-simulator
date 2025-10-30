import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.'
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-green-400 mb-4">404</div>
          <h1 className="text-2xl font-bold text-green-400 mb-2">Page Not Found</h1>
          <p className="text-green-300 mb-6">
            The page you are looking for could not be found.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/" 
            className="inline-block bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-6 rounded transition"
          >
            🎯 Return to Simulator
          </Link>
          
          <div className="text-sm text-green-300">
            <p>Or visit:</p>
            <div className="mt-2 space-y-1">
              <Link href="/about" className="block hover:text-green-400 transition">
                📖 About
              </Link>
              <Link href="/weapons" className="block hover:text-green-400 transition">
                💣 Weapons Database
              </Link>
              <Link href="/faq" className="block hover:text-green-400 transition">
                ❓ FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}