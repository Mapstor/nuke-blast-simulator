import { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, SITE_URL } from '@/lib/seo/schemas'
import { seoMetadata, pageH1 } from '@/lib/seo/pageMeta'

export const metadata: Metadata = seoMetadata('/privacy')

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-privacy"
        schema={breadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: 'Privacy Policy', url: '/privacy' },
        ])}
      />
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-400">{pageH1('/privacy')}</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Data controller</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 text-green-300 space-y-1">
            <p><strong className="text-yellow-400">Moving Data Systems d.o.o.</strong></p>
            <p>Smolnik 62, 2342 Ruše, Slovenia</p>
            <p>
              Contact:{' '}
              <a href="mailto:info@nukeblastsimulator.com" className="text-yellow-400 hover:underline">
                info@nukeblastsimulator.com
              </a>
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">What we collect, and who processes it</h2>
          <p className="text-green-300 mb-4">
            These are the only third-party services this site loads. We do not run advertising, and we do not
            sell data.
          </p>

          <div className="space-y-6">
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Google Analytics 4 (GA4)</h3>
              <ul className="list-disc list-inside space-y-2 text-green-300">
                <li>Measurement ID <code className="text-green-200">G-XDZQYKGTE2</code>, provided by Google.</li>
                <li>Collects pseudonymous usage data: pages viewed, referrer, device and browser type, and an approximate location derived from your IP address.</li>
                <li>Sets analytics cookies (for example <code className="text-green-200">_ga</code> and <code className="text-green-200">_ga_*</code>) to measure returning visits — only after you accept (see Consent below).</li>
                <li>Purpose: understand overall traffic and which pages are useful. Legal basis: your consent (EEA/UK/CH) or legitimate interest elsewhere.</li>
                <li>Opt out any time via the <em>Cookie settings</em> link in the footer, or Google&apos;s{' '}
                  <a href="https://tools.google.com/dlpage/gaoptout" className="text-yellow-400 hover:underline" rel="nofollow">opt-out browser add-on</a>.
                </li>
              </ul>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Mapbox (interactive map)</h3>
              <ul className="list-disc list-inside space-y-2 text-green-300">
                <li>Map tiles on the simulator are served by Mapbox. Loading them sends your IP address and map requests to Mapbox.</li>
                <li>Your weapon selections and detonation points are computed in your browser and are not sent to Mapbox or to us.</li>
                <li>Mapbox privacy policy:{' '}
                  <a href="https://www.mapbox.com/legal/privacy" className="text-yellow-400 hover:underline" rel="nofollow">mapbox.com/legal/privacy</a>.
                </li>
              </ul>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Vercel (hosting)</h3>
              <ul className="list-disc list-inside space-y-2 text-green-300">
                <li>The site is hosted on Vercel, which keeps standard server and edge logs (IP address, request time, user agent) for security and performance.</li>
                <li>Legal basis: legitimate interest in operating and securing the site.</li>
                <li>Vercel privacy policy:{' '}
                  <a href="https://vercel.com/legal/privacy-policy" className="text-yellow-400 hover:underline" rel="nofollow">vercel.com/legal/privacy-policy</a>.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-green-300 mt-4">
            Fonts are system/CSS fonts served from the site itself; no third-party font service is used. There
            are no user accounts, and we do not collect names, email addresses, or payment information.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Cookies &amp; consent</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 text-green-300 space-y-2">
            <p>
              We use Google Consent Mode v2. For visitors in the EEA, UK and Switzerland, analytics storage is
              <strong className="text-yellow-400"> denied by default</strong> and GA4 is only enabled after you
              choose <em>Accept</em> in the cookie banner. Elsewhere, analytics is enabled by default and you can
              opt out with <em>Reject</em>.
            </p>
            <p>
              You can change your choice any time via the <em>Cookie settings</em> link in the footer. We also
              use a small amount of browser local storage to remember your consent choice and the map view state.
              There are no advertising cookies.
            </p>
            <p className="text-green-300/70 text-sm">
              Interim note: this consent banner is a temporary implementation. If the site joins an ad network,
              that network&apos;s consent management platform will replace it.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Your rights (GDPR)</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 text-green-300">
            <p className="mb-3">
              If you are in the EEA, UK or Switzerland, you have the right to access, rectify, erase, restrict,
              and port your personal data, and to object to processing. To exercise any of these, email{' '}
              <a href="mailto:info@nukeblastsimulator.com" className="text-yellow-400 hover:underline">info@nukeblastsimulator.com</a>.
            </p>
            <p>
              You may also lodge a complaint with your supervisory authority — in Slovenia, the Information
              Commissioner (Informacijski pooblaščenec).
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">International transfers</h2>
          <p className="text-green-300">
            Google, Mapbox and Vercel may process data on servers outside your country, including the United
            States, under their respective safeguards (such as Standard Contractual Clauses). See each
            provider&apos;s privacy policy linked above.
          </p>
        </section>

        <div className="text-center text-green-400/50 text-sm">
          <p>Last updated: 15 October 2026</p>
        </div>
      </main>
    </div>
  )
}
