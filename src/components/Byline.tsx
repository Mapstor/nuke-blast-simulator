import Link from 'next/link'

// Single visible byline for the named author, linking to /about (NBS-003).
export function Byline({ className = '' }: { className?: string }) {
  return (
    <p className={`text-sm text-green-300/70 ${className}`}>
      By{' '}
      <Link href="/about" className="text-yellow-400 hover:underline">
        Marko Visic, BSc Physics
      </Link>
    </p>
  )
}
