/* eslint-disable @next/next/no-img-element */
import type { ReactElement } from 'react'

// Shared OG card frame. Satori (the engine behind next/og) understands a
// strict subset of CSS — we use plain `display: 'flex'` layouts, hex colors,
// and absolute pixel sizes. No Tailwind, no grid.

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
  bg: '#000000',
  bgGradient: '#0a1810',
  border: '#22c55e', // green-500
  borderDim: '#15803d', // green-700
  textPrimary: '#4ade80', // green-400
  textBody: '#86efac', // green-300
  accent: '#facc15', // yellow-400
  metricRed: '#f87171', // red-400
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
        background: `linear-gradient(135deg, ${COLORS.bg} 0%, ${COLORS.bgGradient} 100%)`,
        color: COLORS.textPrimary,
        fontFamily: 'sans-serif',
        padding: '48px 64px',
        borderTop: `4px solid ${COLORS.border}`,
        borderBottom: `4px solid ${COLORS.border}`,
        position: 'relative',
      }}
    >
      {/* Top label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '20px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: COLORS.textBody,
          opacity: 0.85,
        }}
      >
        <span
          style={{
            display: 'flex',
            width: '12px',
            height: '12px',
            backgroundColor: COLORS.border,
            borderRadius: '50%',
            marginRight: '14px',
          }}
        />
        Nuclear Blast Simulator
        {eyebrow ? (
          <span
            style={{
              display: 'flex',
              marginLeft: '20px',
              padding: '2px 14px',
              border: `1px solid ${COLORS.borderDim}`,
              borderRadius: '4px',
              color: COLORS.accent,
              fontSize: '17px',
              letterSpacing: '0.14em',
            }}
          >
            {eyebrow}
          </span>
        ) : null}
      </div>

      {/* Spacer */}
      <div style={{ display: 'flex', flex: 1 }} />

      {/* Title block */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 60 ? '52px' : title.length > 40 ? '64px' : '76px',
            fontWeight: 800,
            lineHeight: 1.05,
            color: COLORS.textPrimary,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              display: 'flex',
              marginTop: '16px',
              fontSize: '28px',
              color: COLORS.accent,
              fontWeight: 500,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      {/* Spacer */}
      <div style={{ display: 'flex', flex: 1 }} />

      {/* Metrics row */}
      {(metric || metricSecondary) ? (
        <div
          style={{
            display: 'flex',
            gap: '40px',
            paddingTop: '24px',
            borderTop: `1px solid ${COLORS.borderDim}`,
            marginBottom: '16px',
          }}
        >
          {metric ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: '18px', color: COLORS.textBody, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                {metric.label}
              </div>
              <div style={{ display: 'flex', fontSize: '40px', fontWeight: 700, color: COLORS.metricRed }}>
                {metric.value}
              </div>
            </div>
          ) : null}
          {metricSecondary ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: '18px', color: COLORS.textBody, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                {metricSecondary.label}
              </div>
              <div style={{ display: 'flex', fontSize: '40px', fontWeight: 700, color: COLORS.accent }}>
                {metricSecondary.value}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Footer URL */}
      <div
        style={{
          display: 'flex',
          fontSize: '20px',
          color: COLORS.textBody,
          letterSpacing: '0.05em',
          opacity: 0.85,
        }}
      >
        nukeblastsimulator.com
      </div>
    </div>
  )
}

export function formatYieldShort(yieldKt: number): string {
  if (yieldKt >= 1000) return `${(yieldKt / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} Mt`
  if (yieldKt >= 1) return `${yieldKt.toLocaleString()} kt`
  return `${(yieldKt * 1000).toLocaleString()} tons TNT`
}
