import { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, SITE_URL } from '@/lib/seo/schemas'
import { Cite, Sources, createCitations } from '@/components/seo/Cite'

export const metadata: Metadata = {
  title: 'Resources — Nuclear Arms-Control Treaties & Official Data Sources',
  description:
    'The main nuclear arms-control treaties (NPT, CTBT, TPNW) and the official organisations that publish nuclear-forces data: the Federation of American Scientists, SIPRI, the CTBTO and the UN Office for Disarmament Affairs.',
  alternates: { canonical: '/resources' },
}

// Each external link below points to a URL that is already in the site's source
// list (src/lib/data/sources.ts), so every organisation here is one the site
// actually cites. Treaty figures carry inline citations.
const TREATY_BODY = {
  ctbtoFaq: 'https://www.ctbto.org/resources/information-materials/frequently-asked-questions',
  unodaNpt:
    'https://disarmament.unoda.org/en/our-work/weapons-mass-destruction/nuclear-weapons/treaty-non-proliferation-nuclear-weapons',
  unodaTpnw:
    'https://disarmament.unoda.org/zh/spotlights/nuclear-weapon-prohibition-treaty-adopted-historic-vote-united-nations',
  fas: 'https://fas.org/initiative/status-world-nuclear-forces/',
  sipri: 'https://www.sipri.org/node/7895',
}

export default function ResourcesPage() {
  const cites = createCitations()
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-resources"
        schema={breadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: 'Resources', url: '/resources' },
        ])}
      />
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-green-400">Resources</h1>

        <p className="text-green-300 text-lg mb-10">
          The main nuclear arms-control treaties and the official bodies whose data this site relies on.
          Treaty figures below are current as of the dates given and link to the issuing authority.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Arms-control treaties</h2>
          <div className="space-y-6">

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">
                Treaty on the Non-Proliferation of Nuclear Weapons (NPT)
              </h3>
              <p className="text-green-300">
                Opened for signature in 1968 and in force since 1970, the NPT works to prevent the spread of
                nuclear weapons. <Cite c={cites} ids="un-office-for-disarmament-affairs-treaty-on-the;nus-centre-for-international-law-1968-treaty-on" />{' '}
                191 states have joined; review conferences are held every five years, and Article VI commits
                the parties to negotiate nuclear disarmament. <Cite c={cites} ids="un-office-for-disarmament-affairs-treaty-on-the;un-office-for-disarmament-affairs-npt-text-of-th" />
              </p>
              <p className="mt-4 text-sm">
                <a href={TREATY_BODY.unodaNpt} rel="nofollow noopener" className="text-yellow-400 hover:underline">
                  UN Office for Disarmament Affairs — NPT →
                </a>
              </p>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">
                Comprehensive Nuclear-Test-Ban Treaty (CTBT)
              </h3>
              <p className="text-green-300">
                Opened for signature in 1996, the CTBT bans all nuclear explosions. <Cite c={cites} ids="ctbto-preparatory-commission-frequently-asked-qu;united-nations-treaty-collection-status-of-treat-2" />{' '}
                188 states have signed and 179 have ratified (August 2026). It has not entered into force,
                because nine of the Annex 2 states whose ratification is required have yet to ratify. <Cite c={cites} ids="ctbto-preparatory-commission-joint-statement-by;united-nations-treaty-collection-status-of-treat-2" />
              </p>
              <p className="mt-4 text-sm">
                <a href={TREATY_BODY.ctbtoFaq} rel="nofollow noopener" className="text-yellow-400 hover:underline">
                  CTBTO Preparatory Commission →
                </a>
              </p>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">
                Treaty on the Prohibition of Nuclear Weapons (TPNW)
              </h3>
              <p className="text-green-300">
                Adopted on 7 July 2017 by a vote of 122 states in favour, the TPNW is the first treaty to
                prohibit nuclear weapons outright. <Cite c={cites} ids="un-office-for-disarmament-affairs-nuclear-weapon" />{' '}
                It entered into force on 22 January 2021. <Cite c={cites} ids="united-nations-treaty-collection-status-of-treat" />{' '}
                As of September 2026, 96 states have signed and 75 are parties. <Cite c={cites} ids="united-nations-treaty-collection-status-of-treat;hiroshima-prefectural-government-status-of-the-t" />
              </p>
              <p className="mt-4 text-sm">
                <a href={TREATY_BODY.unodaTpnw} rel="nofollow noopener" className="text-yellow-400 hover:underline">
                  UN Office for Disarmament Affairs — TPNW →
                </a>
              </p>
            </div>

          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Official data sources</h2>
          <p className="text-green-300 mb-6">
            The arsenal and treaty figures on this site come from these organisations. Each link goes to the
            publication the site cites.
          </p>
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-yellow-400">Federation of American Scientists</h3>
              <p className="text-green-300 text-sm mb-3">
                The Nuclear Information Project maintains the Status of World Nuclear Forces, the running
                estimate of each country&apos;s warhead inventory.
              </p>
              <a href={TREATY_BODY.fas} rel="nofollow noopener" className="text-yellow-400 hover:underline text-sm">
                Status of World Nuclear Forces →
              </a>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-yellow-400">SIPRI</h3>
              <p className="text-green-300 text-sm mb-3">
                The Stockholm International Peace Research Institute publishes the annual SIPRI Yearbook survey
                of world nuclear forces.
              </p>
              <a href={TREATY_BODY.sipri} rel="nofollow noopener" className="text-yellow-400 hover:underline text-sm">
                SIPRI Yearbook — world nuclear forces →
              </a>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-yellow-400">CTBTO Preparatory Commission</h3>
              <p className="text-green-300 text-sm mb-3">
                Operates the International Monitoring System that detects nuclear explosions and tracks the
                status of the test-ban treaty.
              </p>
              <a href={TREATY_BODY.ctbtoFaq} rel="nofollow noopener" className="text-yellow-400 hover:underline text-sm">
                CTBTO frequently asked questions →
              </a>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-yellow-400">UN Office for Disarmament Affairs</h3>
              <p className="text-green-300 text-sm mb-3">
                Holds the authoritative texts and membership records for the NPT, the TPNW and the other
                disarmament treaties.
              </p>
              <a href={TREATY_BODY.unodaNpt} rel="nofollow noopener" className="text-yellow-400 hover:underline text-sm">
                UNODA — nuclear-weapons treaties →
              </a>
            </div>

          </div>
        </section>

        <Sources c={cites} />

        <section className="mt-10 text-sm text-green-300/70">
          For the formulas behind the simulator, see the{' '}
          <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link>, and for the
          full reference list the{' '}
          <Link href="/sources" className="text-yellow-400 hover:underline">sources</Link> page.
        </section>
      </main>
    </div>
  )
}
