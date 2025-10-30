'use client'

import { useState } from 'react'
import { useSimulatorStore } from '@/store/simulatorStore'
import { formatNumber } from '@/lib/utils/format'

export function ShareButton() {
  const selectedBomb = useSimulatorStore(state => state.selectedBomb)
  const epicenter = useSimulatorStore(state => state.epicenter)
  const blastCircles = useSimulatorStore(state => state.blastCircles)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (!selectedBomb || !epicenter || !blastCircles) return

    // Create shareable URL with parameters
    const params = new URLSearchParams({
      bomb: selectedBomb.id,
      lat: epicenter.lat.toFixed(4),
      lng: epicenter.lng.toFixed(4)
    })
    
    const url = `${window.location.origin}?${params.toString()}`
    
    // Create share text
    const shareText = `Nuclear Blast Simulation: ${selectedBomb.name} (${selectedBomb.yield} kt) 
Estimated casualties: ${formatNumber(blastCircles.totalCasualties)}
Location: ${epicenter.lat.toFixed(2)}°, ${epicenter.lng.toFixed(2)}°

Simulate at: ${url}`

    // Try to use Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nuclear Blast Simulation',
          text: shareText,
          url: url
        })
      } catch (err) {
        // User cancelled or error - fallback to clipboard
        copyToClipboard(url)
      }
    } else {
      // Fallback to copying to clipboard
      copyToClipboard(url)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!selectedBomb || !epicenter || !blastCircles) {
    return null
  }

  return (
    <button
      onClick={handleShare}
      className="w-full px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded hover:bg-green-500/30 transition flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-1.519 1.523m-5.393-7.181a3 3 0 00-5.197 2.341m5.197-2.341a3 3 0 014.243 4.243M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      {copied ? 'Link Copied!' : 'Share Results'}
    </button>
  )
}