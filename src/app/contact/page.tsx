import { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { contactPageSchema, breadcrumbSchema, SITE_URL } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'Contact - Nuke Blast Simulator',
  description: 'Contact the publisher of Nuke Blast Simulator — feedback, corrections, and concerns. Published by Moving Data Systems d.o.o., Slovenia.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-contact"
        schema={[
          contactPageSchema('/contact'),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Contact', url: '/contact' },
          ]),
        ]}
      />
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-400">Contact</h1>

        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-8">
          <p className="text-green-300 text-lg">
            Feedback, corrections, and concerns about the simulator are welcome. We read every message.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Publisher &amp; contact</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-8 space-y-2 text-green-300">
            <p className="text-xl font-semibold text-yellow-400">Moving Data Systems d.o.o.</p>
            <p>Smolnik 62, 2342 Ruše, Slovenia</p>
            <p>
              Email:{' '}
              <a href="mailto:info@nukeblastsimulator.com" className="text-yellow-400 hover:underline">
                info@nukeblastsimulator.com
              </a>
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">What to contact us about</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Corrections &amp; sources</h3>
              <ul className="list-disc list-inside space-y-2 text-green-300">
                <li>Factual or numerical errors</li>
                <li>Missing or better primary sources</li>
                <li>Scientific accuracy improvements</li>
              </ul>
            </div>
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Technical feedback</h3>
              <ul className="list-disc list-inside space-y-2 text-green-300">
                <li>Bug reports (browser, device, steps to reproduce)</li>
                <li>Accessibility issues</li>
                <li>Feature suggestions</li>
              </ul>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-400">Misuse &amp; security</h3>
              <ul className="list-disc list-inside space-y-2 text-red-300">
                <li>Suspected misuse of the simulator</li>
                <li>Threatening content</li>
                <li>Security vulnerabilities</li>
              </ul>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-orange-400">Legal &amp; policy</h3>
              <ul className="list-disc list-inside space-y-2 text-orange-300">
                <li>Terms and privacy questions</li>
                <li>Content licensing</li>
                <li>Takedown requests</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Other resources</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <ul className="space-y-3 text-green-300">
              <li>
                <strong className="text-yellow-400">About the author &amp; site:</strong>{' '}
                <a href="/about" className="text-yellow-400 hover:underline">About</a>
              </li>
              <li>
                <strong className="text-yellow-400">How the numbers are computed:</strong>{' '}
                <a href="/methodology" className="text-yellow-400 hover:underline">Methodology</a>
              </li>
              <li>
                <strong className="text-yellow-400">Legal:</strong>{' '}
                <a href="/terms" className="text-yellow-400 hover:underline">Terms</a> ·{' '}
                <a href="/privacy" className="text-yellow-400 hover:underline">Privacy</a>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
