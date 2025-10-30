'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-green-500/30 px-4 py-3 text-xs text-gray-400" style={{ marginTop: '40px' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-3">
          <p className="mb-1">
            ⚠️ <strong className="text-yellow-400">EDUCATIONAL PURPOSE ONLY</strong> - This simulator is designed for educational awareness about nuclear weapons effects.
          </p>
          <p>
            Not intended for planning actual attacks. Data based on declassified research and scientific studies. 
            Created to promote understanding of nuclear weapons consequences and support nuclear disarmament efforts.
          </p>
        </div>
        
        {/* Legal Links */}
        <div className="flex justify-center gap-4 pt-2 border-t border-green-500/20">
          <Link href="/terms" className="hover:text-green-400 transition">
            Terms of Service
          </Link>
          <span className="text-green-500/30">•</span>
          <Link href="/privacy" className="hover:text-green-400 transition">
            Privacy Policy
          </Link>
          <span className="text-green-500/30">•</span>
          <Link href="/sources" className="hover:text-green-400 transition">
            Data Sources
          </Link>
          <span className="text-green-500/30">•</span>
          <Link href="/contact" className="hover:text-green-400 transition">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}