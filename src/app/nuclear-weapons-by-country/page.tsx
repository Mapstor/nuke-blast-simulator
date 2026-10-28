import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { ArticleBody } from '@/components/blog/ArticleBody'
import { Byline } from '@/components/Byline'
import { articleSchema, breadcrumbSchema, SITE_URL } from '@/lib/seo/schemas'
import { Cite, Sources, createCitations } from '@/components/seo/Cite'
import { seoMetadata, pageH1 } from '@/lib/seo/pageMeta'
import { COUNTRIES, COUNTRY_SLUGS, val } from '@/lib/data/countryView'
import type { Section } from '@/lib/blog/types'

const PATH = '/nuclear-weapons-by-country'

export const metadata: Metadata = seoMetadata(PATH)

const FAS = 'federation-of-american-scientists-status-of-worl'
const SIPRI = 'sipri-sipri-yearbook-2026-ch-8-world-nuclear-for'
const SIPRI_PR = 'sipri-sipri-yearbook-2026-press-release-increasi'

// NBS-008: hub moved here from /blog/modern-nuclear-arsenals-2026 (308).
// NBS-012: numbers re-cited to SIPRI Yearbook 2026 ch. 8 and the 2026 Nuclear
// Notebooks; the Sarmat, reserve-vs-retired, China-2030 and uncited-claim
// problems from the sourcing report are corrected; each table row links to its
// country page.
const SECTIONS: Section[] = [
  {
    body: [
      { type: 'p', text: 'As of early 2026, nine states possess nuclear weapons: the United States, Russia, China, the United Kingdom, France, India, Pakistan, North Korea, and Israel (which has never officially confirmed). Their combined inventory is about 12,187 warheads. Of that, about 9,745 are in military stockpiles; the rest are split between reserve or central storage (about 5,733) and warheads retired and awaiting dismantlement (about 2,442). {{c:federation-of-american-scientists-status-of-worl;sipri-sipri-yearbook-2026-ch-8-world-nuclear-for;sipri-sipri-yearbook-2026-press-release-increasi}}' },
    ],
  },
  {
    heading: 'The big two: the United States and Russia',
    body: [
      { type: 'p', text: 'The United States and Russia hold the great majority of the world\'s nuclear warheads. Russia\'s inventory is estimated at about 5,420 (1,796 deployed on strategic launchers) and the United States at about 5,042 (1,670 deployed on strategic launchers plus about 100 non-strategic bombs in Europe), as of early 2026. {{c:federation-of-american-scientists-status-of-worl;sipri-sipri-yearbook-2026-ch-8-world-nuclear-for}}' },
      { type: 'p', text: 'Both arsenals follow the classical "triad": land-based intercontinental ballistic missiles (ICBMs), submarine-launched ballistic missiles (SLBMs), and strategic bombers. The United States fields 400 Minuteman III ICBMs, 14 Ohio-class ballistic-missile submarines carrying Trident II SLBMs, and B-2A and B-52H bombers. {{c:bulletin-of-the-atomic-scientists-fas-united-sta-2;us-air-force-lgm-30g-minuteman-iii-fact-sheet}} Russia fields Yars ICBMs, Borei-class submarines with Bulava SLBMs, and Tu-160 and Tu-95 bombers; its new Sarmat (RS-28) ICBM is listed in the 2026 Nuclear Notebook with no deployed launchers or warheads yet. {{c:bulletin-of-the-atomic-scientists-fas-russian-nu}}' },
    ],
  },
  {
    heading: 'China\'s buildup',
    body: [
      { type: 'p', text: 'China historically kept a relatively small arsenal under a "minimum deterrence" posture. That changed in the early 2020s, when satellite imagery revealed new missile silo fields in the country\'s north and west. FAS and SIPRI estimate China had about 620 warheads in early 2026, and the US Defense Department projects about 1,000 operational warheads by 2030, as quoted by FAS. {{c:federation-of-american-scientists-china-is-build;bulletin-of-the-atomic-scientists-fas-chinese-nu;federation-of-american-scientists-status-of-worl}}' },
      { type: 'p', text: 'China operates Jin-class (Type 094) ballistic-missile submarines, which are switching from the JL-2 to the longer-range JL-3, and its H-6N bomber carries a nuclear-capable air-launched ballistic missile. {{c:bulletin-of-the-atomic-scientists-fas-chinese-nu}}' },
    ],
  },
  {
    heading: 'The United Kingdom and France',
    body: [
      { type: 'p', text: 'Britain and France maintain modest, sea-based arsenals. The UK operates four Vanguard-class ballistic-missile submarines carrying Trident II SLBMs with British-designed warheads, an inventory of about 225 (120 deployed). The 2024 Nuclear Notebook records a plan to raise the stockpile ceiling to 260 warheads. {{c:federation-of-american-scientists-bulletin-of-th;federation-of-american-scientists-status-of-worl}}' },
      { type: 'p', text: 'France operates four Triomphant-class submarines carrying M51 missiles, plus land- and carrier-based Rafale aircraft armed with ASMPA cruise missiles; its stockpile is estimated at about 290 warheads (about 370 total inventory). {{c:bulletin-of-the-atomic-scientists-french-nuclear;federation-of-american-scientists-status-of-worl}}' },
    ],
  },
  {
    heading: 'India and Pakistan',
    body: [
      { type: 'p', text: 'India and Pakistan both conducted nuclear tests in May 1998 and have since built modest arsenals. India is estimated at about 190 warheads, delivered by aircraft, Agni land-based missiles, and Arihant-class submarines with K-15 and K-4 missiles. {{c:ctbto-preparatory-commission-ten-years-since-ind;federation-of-american-scientists-status-of-worl;bulletin-of-the-atomic-scientists-fas-indian-nuc}}' },
      { type: 'p', text: 'Pakistan is estimated at about 170 warheads, carried by the Abdali, Ghaznavi, Shaheen, Ghauri and Nasr ballistic missiles, Babur cruise missiles, and Mirage aircraft. {{c:federation-of-american-scientists-status-of-worl;bulletin-of-the-atomic-scientists-pakistan-nucle}}' },
    ],
  },
  {
    heading: 'North Korea',
    body: [
      { type: 'p', text: 'North Korea has conducted six nuclear tests since 2006. Its September 2017 test, which it called a hydrogen bomb, was its largest. It has flight-tested ICBMs including the Hwasong-15 (2017) and Hwasong-17 (2022) and is estimated to have about 60 assembled warheads, with fissile material for more. {{c:federation-of-american-scientists-bulletin-of-th-3;federation-of-american-scientists-status-of-worl;sipri-sipri-yearbook-2026-ch-8-world-nuclear-for}}' },
    ],
  },
  {
    heading: 'Israel: the unconfirmed nuclear power',
    body: [
      { type: 'p', text: 'Israel neither officially confirms nor denies having nuclear weapons, a long-standing policy of nuclear ambiguity; FAS and SIPRI estimate about 90 warheads. Delivery is assessed to include Jericho II and III ballistic missiles, F-15 and F-16I aircraft, and possibly submarine-launched cruise missiles. {{c:federation-of-american-scientists-status-of-worl;sipri-sipri-yearbook-2026-ch-8-world-nuclear-for;sipri-sipri-yearbook-2024-ch-7-sec-ix-israeli-nu}}' },
    ],
  },
  {
    heading: 'Total inventory and trends',
    body: [
      { type: 'p', text: 'Adding the official estimates, the global inventory is about 12,187 warheads in early 2026, of which about 9,745 are in military stockpiles and about 4,000 are deployed on missiles or at bomber bases. {{c:federation-of-american-scientists-status-of-worl;sipri-sipri-yearbook-2026-ch-8-world-nuclear-for}}' },
      { type: 'p', text: 'After three decades of post-Cold-War decline, total numbers have begun rising again, driven mainly by China\'s expansion. {{c:sipri-sipri-yearbook-2026-press-release-increasi}} With the New START Treaty expired in February 2026 and Russia\'s participation suspended since 2023, the era of US-Russia bilateral arms control is effectively over. {{c:federation-of-american-scientists-the-aftermath;nuclear-threat-initiative-new-start-treaty;un-office-for-disarmament-affairs-cd-2500-russia}}' },
    ],
  },
]

// Every country row links to its page; numbers from the verified country data.
const TABLE_KEYS = COUNTRY_SLUGS.filter((k) => k !== 'iran')

export default function NuclearWeaponsByCountryPage() {
  const cites = createCitations()
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-nuclear-weapons-by-country"
        schema={[
          articleSchema({
            url: PATH,
            headline: pageH1(PATH),
            description: metadata.description as string,
          }),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Nuclear Weapons by Country', url: PATH },
          ]),
        ]}
      />

      <main className="max-w-3xl mx-auto px-5 py-8 md:p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">Nuclear Weapons by Country</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-400 leading-tight">
            {pageH1(PATH)}
          </h1>
          <p className="text-lg text-yellow-400 mb-4">
            How many nuclear weapons each country has, with delivery systems and trends, as of early 2026 — every figure cited.
          </p>
          <Byline />
        </header>

        {/* Country summary table — each row links to the full country page. */}
        <section id="at-a-glance" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">Every nuclear power at a glance</h2>
          <div className="overflow-x-auto border border-green-500/30 rounded-lg">
            <table className="w-full text-xs sm:text-sm text-green-300 whitespace-nowrap">
              <thead>
                <tr className="border-b border-green-500/30 text-yellow-400">
                  <th scope="col" className="text-left p-2">Country</th>
                  <th scope="col" className="text-right p-2">Total inventory</th>
                  <th scope="col" className="text-right p-2">Military stockpile</th>
                  <th scope="col" className="text-right p-2">Deployed (strategic)</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_KEYS.map((k) => {
                  const c = COUNTRIES[k]
                  return (
                    <tr key={k} className="border-b border-green-500/10">
                      <th scope="row" className="text-left p-2 font-normal">
                        <Link href={`/nuclear-weapons-by-country/${k}`} className="text-yellow-400 hover:underline">{c.name}</Link>
                      </th>
                      <td className="text-right p-2 tabular-nums">{val(c, 'warheads.fas.total_inventory')}</td>
                      <td className="text-right p-2 tabular-nums">{val(c, 'warheads.fas.military_stockpile')}</td>
                      <td className="text-right p-2 tabular-nums">{val(c, 'warheads.fas.deployed_strategic')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-green-300/60 mt-2">
            Federation of American Scientists, Status of World Nuclear Forces, early 2026; SIPRI&rsquo;s January 2026 totals match.<Cite c={cites} ids={`${FAS};${SIPRI}`} />{' '}
            <Link href="/nuclear-weapons-by-country/iran" className="text-yellow-400 hover:underline">Iran</Link> has no nuclear weapons and is covered as a status page.<Cite c={cites} ids={SIPRI_PR} />
          </p>
        </section>

        <ArticleBody sections={SECTIONS} cites={cites} />

        <Sources c={cites} />

        <section className="mt-10 text-sm text-green-300/70">
          See individual warhead profiles in the{' '}
          <Link href="/weapons" className="text-yellow-400 hover:underline">Weapons Database</Link>, put any two
          weapons head to head with the{' '}
          <Link href="/compare" className="text-yellow-400 hover:underline">comparison tool</Link>, or see the blast
          radius mapped on a major city on the{' '}
          <Link href="/examples" className="text-yellow-400 hover:underline">city pages</Link>.
        </section>
      </main>
    </div>
  )
}
