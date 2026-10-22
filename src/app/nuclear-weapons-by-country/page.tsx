import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { ArticleBody } from '@/components/blog/ArticleBody'
import { Byline } from '@/components/Byline'
import { articleSchema, breadcrumbSchema, SITE_URL } from '@/lib/seo/schemas'
import { Sources, createCitations } from '@/components/seo/Cite'
import { seoMetadata, pageH1 } from '@/lib/seo/pageMeta'
import type { Section } from '@/lib/blog/types'

const PATH = '/nuclear-weapons-by-country'

export const metadata: Metadata = seoMetadata(PATH)

// NBS-008: moved here from /blog/modern-nuclear-arsenals-2026 (now a 308). The
// by-country arsenal breakdown is the evergreen hub for the country cluster;
// every figure is cited and current as of early 2026.
const SECTIONS: Section[] = [
  {
    body: [
      { type: 'p', text: 'As of early 2026, nine states possess nuclear weapons: the United States, Russia, China, the United Kingdom, France, India, Pakistan, North Korea, and Israel (which has never officially confirmed). Their combined inventory is about 12,187 warheads, down from a Cold War peak of about 70,300 in 1986, but climbing again as China, Russia, and North Korea modernize and expand. {{c:federation-of-american-scientists-status-of-worl;sipri-sipri-yearbook-2026-press-release-increasi;sipri-sipri-yearbook-2023-ch-7-world-nuclear-for}}' },
    ],
  },
  {
    heading: 'The big two: the United States and Russia',
    body: [
      { type: 'p', text: 'The United States and Russia hold about 86% of the world\'s nuclear warheads. Russia\'s inventory is estimated at about 5,420 (1,796 deployed strategic; its non-strategic warheads are in central storage) and the US at about 5,042 (1,670 deployed strategic and about 100 deployed non-strategic), as of early 2026 (FAS). {{c:federation-of-american-scientists-status-of-worl;sipri-sipri-yearbook-2024-ch-7-summary-world-nuc;sipri-sipri-yearbook-2023-ch-7-world-nuclear-for}}' },
      { type: 'p', text: 'Both arsenals follow the classical "triad" structure: land-based intercontinental ballistic missiles (ICBMs), submarine-launched ballistic missiles (SLBMs), and strategic bombers. The United States operates 400 Minuteman III ICBMs, 14 Ohio-class ballistic-missile submarines (each carrying up to 20 Trident II SLBMs), and a fleet of B-2A and B-52H strategic bombers. {{c:federation-of-american-scientists-bulletin-of-th-2;us-air-force-lgm-30g-minuteman-iii-fact-sheet}} Russia operates a similar triad with the Yars and Sarmat ICBMs, Borei-class submarines, and Tu-160 and Tu-95 bombers.' },
    ],
  },
  {
    heading: 'China\'s buildup',
    body: [
      { type: 'p', text: 'China has historically maintained a "minimum deterrence" posture with a relatively small arsenal. That changed in the early 2020s. Satellite imagery in 2021 revealed new missile silo fields near Yumen and Hami; with a third near Yulin, they hold about 320 silos. FAS and SIPRI estimate China had about 620 warheads in early 2026, and the US Defense Department expects more than 1,000 by 2030. {{c:federation-of-american-scientists-china-is-build;bulletin-of-the-atomic-scientists-chinese-nuclea;federation-of-american-scientists-status-of-worl}}' },
      { type: 'p', text: 'China operates six Type 094 (Jin-class) ballistic-missile submarines, which are switching from the JL-2 to the longer-range JL-3, and its H-6N bomber carries a nuclear-capable air-launched ballistic missile. {{c:bulletin-of-the-atomic-scientists-chinese-nuclea}} The expansion appears motivated by perceived US missile-defense capabilities and improvements in conventional precision strike that, in Beijing\'s view, made China\'s previous minimum deterrent insufficient.' },
    ],
  },
  {
    heading: 'United Kingdom and France',
    body: [
      { type: 'p', text: 'Britain and France maintain modest, sea-based-only arsenals. The UK operates four Vanguard-class ballistic-missile submarines (replacement Dreadnought-class entering service in the 2030s) carrying Trident II SLBMs with British-designed warheads. The UK arsenal is approximately 225 warheads, of which 120 are deployed. {{c:federation-of-american-scientists-bulletin-of-th;federation-of-american-scientists-status-of-worl}}' },
      { type: 'p', text: 'France operates four Triomphant-class submarines carrying M51 missiles, plus land- and carrier-based Rafale aircraft armed with ASMPA cruise missiles. Its stockpile is estimated at about 290 warheads (FAS, early 2026). {{c:bulletin-of-the-atomic-scientists-french-nuclear;federation-of-american-scientists-status-of-worl}} Both the UK and France are now committed to gradual increases in stockpile caps, ending the post-Cold-War drawdown.' },
    ],
  },
  {
    heading: 'India and Pakistan',
    body: [
      { type: 'p', text: 'India and Pakistan both conducted nuclear tests in May 1998 and have since built modest arsenals. India is estimated to have about 190 warheads (FAS, early 2026), delivered by aircraft, Agni land-based missiles and Arihant-class submarines with K-15 and K-4 missiles. {{c:ctbto-preparatory-commission-ten-years-since-ind;federation-of-american-scientists-status-of-worl;bulletin-of-the-atomic-scientists-indian-nuclear}} India has historically declared a "no first use" doctrine.' },
      { type: 'p', text: 'Pakistan is estimated to have about 170 warheads (FAS, early 2026), carried by Abdali, Ghaznavi, Shaheen, Ghauri and Nasr ballistic missiles, Babur cruise missiles and Mirage aircraft. {{c:federation-of-american-scientists-status-of-worl;bulletin-of-the-atomic-scientists-pakistan-nucle}} Pakistan has an explicit policy of using tactical nuclear weapons in response to a conventional Indian invasion — a posture often described as "full-spectrum deterrence."' },
    ],
  },
  {
    heading: 'North Korea',
    body: [
      { type: 'p', text: 'North Korea has conducted six nuclear tests since 2006. Its September 2017 test, which it called a hydrogen bomb, was consistent with a thermonuclear or composite design. It has flight-tested ICBMs including the Hwasong-15 (2017) and Hwasong-17 (2022) and is estimated to have about 60 assembled warheads (FAS and SIPRI, early 2026). {{c:bulletin-of-the-atomic-scientists-north-korean-n;federation-of-american-scientists-status-of-worl;sipri-sipri-yearbook-2026-press-release-increasi}}' },
      { type: 'p', text: 'North Korea also maintains a substantial inventory of short and medium-range ballistic missiles. The Hwasong-14, first flight-tested in July 2017, is assessed as North Korea\'s first operational ICBM; the simulator includes it for educational comparison purposes. {{c:bulletin-of-the-atomic-scientists-north-korean-n}}' },
    ],
  },
  {
    heading: 'Israel: the unconfirmed nuclear power',
    body: [
      { type: 'p', text: 'Israel neither confirms nor denies having nuclear weapons; FAS and SIPRI estimate about 90 warheads. Delivery is believed to include Jericho II and III missiles, F-15 and F-16I aircraft, and possibly submarine-launched cruise missiles. {{c:federation-of-american-scientists-status-of-worl;sipri-sipri-yearbook-2024-ch-7-sec-ix-israeli-nu}} Israel maintains a doctrine of strategic ambiguity, neither admitting nor denying its arsenal — a policy known as "amimut."' },
    ],
  },
  {
    heading: 'Total inventory and trends',
    body: [
      { type: 'p', text: 'Adding the official estimates, the global inventory is about 12,187 warheads in early 2026, of which about 9,745 are in military stockpiles and about 4,000 are deployed on missiles or at bomber bases (FAS and SIPRI). {{c:federation-of-american-scientists-status-of-worl;sipri-sipri-yearbook-2026-press-release-increasi;sipri-sipri-yearbook-2023-ch-7-world-nuclear-for}} The remainder are stored as reserves.' },
      { type: 'p', text: 'After three decades of post-Cold-War decline, total numbers stabilized in the late 2010s and have begun rising slightly. The drivers are Chinese expansion, Russian and Pakistani modernization, and a likely North Korean buildup. Combined with the expiration of the New START Treaty in February 2026 and Russia\'s suspension of participation in 2023, the era of US-Russia bilateral arms control is effectively over. {{c:federation-of-american-scientists-the-aftermath;nuclear-threat-initiative-new-start-treaty;un-office-for-disarmament-affairs-cd-2500-russia}}' },
    ],
  },
]

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

      <main className="max-w-3xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">Nuclear Weapons by Country</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-400 leading-tight">
            {pageH1(PATH)}
          </h1>
          <p className="text-lg text-yellow-400 mb-4">
            How many nuclear weapons each country has, with delivery systems and trends, current as of early 2026.
          </p>
          <Byline />
        </header>

        <ArticleBody sections={SECTIONS} cites={cites} />

        <Sources c={cites} />

        <section className="mt-10 text-sm text-green-300/70">
          See individual warhead profiles in the{' '}
          <Link href="/weapons" className="text-yellow-400 hover:underline">Weapons Database</Link>, put any two
          weapons head to head with the{' '}
          <Link href="/compare" className="text-yellow-400 hover:underline">comparison tool</Link>, or see what a
          strike would do to a major city on the{' '}
          <Link href="/examples" className="text-yellow-400 hover:underline">city pages</Link>.
        </section>
      </main>
    </div>
  )
}
