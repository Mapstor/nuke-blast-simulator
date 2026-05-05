/* eslint-disable @next/next/no-img-element */
import type { ReactElement } from 'react'

// Shared OG card frame. Satori (the engine behind next/og) understands a
// strict subset of CSS — we use plain `display: flex` layouts, hex colors,
// linear/radial gradients, and absolute pixel sizes. No Tailwind, no grid.

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png' as const

export type OgFrameProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  metric?: { label: string; value: string }
  metricSecondary?: { label: string; value: string }
}

const COLORS = {
  bgDeep: '#020303',
  bgMid: '#0a1810',
  border: '#22c55e',
  borderDim: '#15803d',
  textPrimary: '#4ade80',
  textBody: '#86efac',
  textMuted: '#65a380',
  accent: '#facc15',
  metricRed: '#f87171',
}

export function OgFrame(props: OgFrameProps): ReactElement {
  const { eyebrow, title, subtitle, metric, metricSecondary } = props

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        // Layered background: radial fireball-suggestion at upper right,
        // diagonal gradient overlay, deep base.
        backgroundColor: COLORS.bgDeep,
        backgroundImage: [
          'radial-gradient(circle at 88% 18%, rgba(248,113,113,0.30) 0%, rgba(248,113,113,0.10) 18%, rgba(0,0,0,0) 40%)',
          'radial-gradient(circle at 88% 18%, rgba(250,204,21,0.18) 0%, rgba(250,204,21,0) 22%)',
          `linear-gradient(135deg, ${COLORS.bgDeep} 0%, ${COLORS.bgMid} 100%)`,
        ].join(', '),
        color: COLORS.textPrimary,
        fontFamily: 'sans-serif',
        padding: '52px 64px',
        borderTop: `5px solid ${COLORS.border}`,
        borderBottom: `5px solid ${COLORS.border}`,
      }}
    >
      {/* Subtle inner frame */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
          bottom: 18,
          left: 18,
          border: `1px solid rgba(34,197,94,0.18)`,
          pointerEvents: 'none',
          display: 'flex',
        }}
      />

      {/* Eyebrow row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: 20,
          letterSpacing: '0.20em',
          textTransform: 'uppercase',
          color: COLORS.textBody,
          opacity: 0.92,
        }}
      >
        <span
          style={{
            display: 'flex',
            width: 14,
            height: 14,
            backgroundColor: COLORS.border,
            borderRadius: '50%',
            marginRight: 16,
            boxShadow: `0 0 12px ${COLORS.border}`,
          }}
        />
        Nuclear Blast Simulator
        {eyebrow ? (
          <span
            style={{
              display: 'flex',
              marginLeft: 24,
              padding: '4px 16px',
              border: `1px solid ${COLORS.borderDim}`,
              borderRadius: 4,
              color: COLORS.accent,
              fontSize: 17,
              letterSpacing: '0.16em',
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          >
            {eyebrow}
          </span>
        ) : null}
      </div>

      <div style={{ display: 'flex', flex: 1 }} />

      {/* Title block */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 60 ? 56 : title.length > 40 ? 70 : 84,
            fontWeight: 800,
            lineHeight: 1.04,
            color: COLORS.textPrimary,
            letterSpacing: '-0.012em',
            textShadow: '0 2px 24px rgba(34,197,94,0.18)',
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              display: 'flex',
              marginTop: 18,
              fontSize: 30,
              color: COLORS.accent,
              fontWeight: 500,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      <div style={{ display: 'flex', flex: 1 }} />

      {/* Metrics row */}
      {metric || metricSecondary ? (
        <div
          style={{
            display: 'flex',
            gap: 48,
            paddingTop: 24,
            borderTop: `1px solid ${COLORS.borderDim}`,
            marginBottom: 18,
          }}
        >
          {metric ? <Metric label={metric.label} value={metric.value} valueColor={COLORS.metricRed} /> : null}
          {metricSecondary ? (
            <Metric label={metricSecondary.label} value={metricSecondary.value} valueColor={COLORS.accent} />
          ) : null}
        </div>
      ) : null}

      {/* Footer URL */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: 20,
          color: COLORS.textBody,
          letterSpacing: '0.06em',
          opacity: 0.9,
        }}
      >
        <span>nukeblastsimulator.com</span>
        <span style={{ display: 'flex', flex: 1 }} />
        <span style={{ display: 'flex', fontSize: 14, color: COLORS.textMuted, letterSpacing: '0.18em' }}>
          EDUCATIONAL · DECLASSIFIED DATA
        </span>
      </div>
    </div>
  )
}

function Metric({ label, value, valueColor }: { label: string; value: string; valueColor: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          fontSize: 18,
          color: '#86efac',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', fontSize: 44, fontWeight: 800, color: valueColor, letterSpacing: '-0.02em' }}>
        {value}
      </div>
    </div>
  )
}

export function formatYieldShort(yieldKt: number): string {
  if (yieldKt >= 1000) return `${(yieldKt / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} Mt`
  if (yieldKt >= 1) return `${yieldKt.toLocaleString()} kt`
  return `${(yieldKt * 1000).toLocaleString()} tons TNT`
}
