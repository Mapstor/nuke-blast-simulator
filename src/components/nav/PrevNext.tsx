import Link from 'next/link'

export type PrevNextItem = { label: string; href: string; sublabel?: string } | null

export function PrevNext({
  prev,
  next,
  label = 'Pagination',
}: {
  prev: PrevNextItem
  next: PrevNextItem
  label?: string
}) {
  if (!prev && !next) return null
  return (
    <nav
      aria-label={label}
      className="mt-10 pt-6 border-t border-green-500/30 grid sm:grid-cols-2 gap-3"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="block bg-black/50 border border-green-500/30 rounded-lg p-4 hover:border-green-400 transition group"
        >
          <div className="text-xs text-green-300/60 mb-1">← Previous</div>
          <div className="font-semibold text-yellow-400 group-hover:text-yellow-300">{prev.label}</div>
          {prev.sublabel ? <div className="text-xs text-green-300/70 mt-0.5">{prev.sublabel}</div> : null}
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="block bg-black/50 border border-green-500/30 rounded-lg p-4 hover:border-green-400 transition group sm:text-right"
        >
          <div className="text-xs text-green-300/60 mb-1">Next →</div>
          <div className="font-semibold text-yellow-400 group-hover:text-yellow-300">{next.label}</div>
          {next.sublabel ? <div className="text-xs text-green-300/70 mt-0.5">{next.sublabel}</div> : null}
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  )
}
