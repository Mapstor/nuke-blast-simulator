// Glossary of nuclear weapons / physics / doctrine terms.
// Each entry powers a /glossary/[slug] static page with DefinedTerm schema.
// Definitions are written for general educated audiences and are AI-friendly:
// the first sentence is a self-contained definition that AI engines can quote
// directly, followed by an expanded explanation.

import type { Section, FaqItem } from '@/lib/blog/types'

export type GlossaryCategory = 'effects' | 'weapons' | 'physics' | 'doctrine' | 'treaty'

export type GlossaryEntry = {
  slug: string
  term: string
  category: GlossaryCategory
  short: string  // one-sentence definition (used as meta description)
  long: string   // expanded explanation (1–2 paragraphs); may contain {{c:ids}} / {{r:y:eff}} tokens
  related?: string[] // slugs of related terms
  sourceIds?: string[] // NBS-005 citation source ids (research/sources.csv)
  // NBS-014: when a stub is upgraded to a full page, `sections` carries the
  // long-form, H2-structured body (same Section/Block system as blog articles)
  // and `faq` its FAQPage. When present they render instead of `long`.
  sections?: Section[]
  faq?: FaqItem[]
}

export const glossary: GlossaryEntry[] = [
  // ── Effects ────────────────────────────────────────────────────────────
  {
    slug: 'fireball',
    term: 'Fireball',
    category: 'effects',
    short: 'The sphere of extremely hot gas created by a nuclear detonation, which at the first instant reaches tens of millions of degrees, similar to the center of the Sun.',
    long: 'The sphere of extremely hot gas created by a nuclear detonation; at the first instant it reaches tens of millions of degrees, similar to the center of the Sun. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-3}} The fireball forms within microseconds as the X-ray flux from the bomb superheats the surrounding air into plasma. Within the fireball radius, exposed material is vaporized; the plasma sphere also acts as the source of the thermal radiation pulse and the initial blast wave. Fireball radius scales roughly with yield to the 0.4 power. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-3}}',
    related: ['thermal-radiation', 'overpressure', 'air-burst'],
  },
  {
    slug: 'overpressure',
    term: 'Overpressure',
    category: 'effects',
    short: 'The pressure above atmospheric pressure produced by the blast wave of a nuclear detonation, measured in pounds per square inch (PSI).',
    long: 'Nuclear blast damage is conventionally categorized by overpressure. 20 PSI levels reinforced concrete structures; 5 PSI destroys typical homes and lightly built commercial buildings; 1 PSI shatters windows and endangers people with flying glass. {{c:us-congress-office-of-technology-assessment-via}} Overpressure radius scales with yield to the 1/3 power. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-2}}',
    related: ['psi', 'fireball', 'air-burst', 'surface-burst'],
  },
  {
    slug: 'psi',
    term: 'PSI (Pounds per Square Inch)',
    category: 'effects',
    short: 'The unit used to measure blast overpressure from a nuclear detonation.',
    long: '1 PSI is a small overpressure that breaks windows. 5 PSI collapses most residential buildings and is the standard measurement for nuclear-blast damage zones. 20 PSI destroys reinforced concrete. {{c:us-congress-office-of-technology-assessment-via}} By comparison, normal atmospheric pressure at sea level is about 14.7 PSI. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-2}}',
    related: ['overpressure', 'blast-wave'],
  },
  {
    slug: 'thermal-radiation',
    term: 'Thermal Radiation',
    category: 'effects',
    short: 'The intense pulse of light and infrared radiation emitted by the fireball of a nuclear detonation, capable of causing burns and igniting fires at long distances.',
    long: 'Thermal radiation accounts for roughly 35% of the energy released in an air burst, and less (about 18% effective) in a surface burst. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-8}} It travels at the speed of light and arrives before the blast wave. Third-degree burns can occur out to several kilometers for strategic-yield weapons. Thermal-radiation radius grows roughly as yield to the 0.4 power, faster than blast (yield to the 1/3 power). {{c:wikipedia-effects-of-nuclear-explosions-scaling}}',
    related: ['fireball', 'air-burst', 'second-degree-burns'],
  },
  {
    slug: 'fallout',
    term: 'Fallout',
    category: 'effects',
    short: 'Radioactive material thrown into the atmosphere by a surface-burst nuclear detonation, which then settles back to earth over hours to weeks.',
    long: 'Surface bursts produce massive fallout because the fireball touches the ground, vaporizing soil and irradiating it with neutron flux. The radioactive debris is lofted into the upper atmosphere and drifts downwind, depositing as a long elliptical plume. Air bursts produce minimal fallout because the fireball does not interact with the ground. The lethal fallout zone of a large surface burst can stretch far downwind: after the Bravo test it was a belt about 270 km long. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e}}',
    related: ['surface-burst', 'air-burst', 'half-life', 'acute-radiation-syndrome'],
  },
  {
    slug: 'air-burst',
    term: 'Air Burst',
    category: 'effects',
    short: 'A nuclear detonation above the ground at optimal altitude, maximizing the area affected by blast and thermal radiation while producing minimal fallout.',
    long: 'In an air burst the fireball does not reach the ground, so the bomb cannot vaporize and irradiate soil. This minimizes local fallout but maximizes blast spread because the shock wave reflects off the ground and reinforces the direct wave. Hiroshima and Nagasaki were both air bursts, detonating about 600 m and 503 m above the cities. {{c:radiation-effects-research-foundation-frequently}}',
    related: ['surface-burst', 'fallout', 'fireball'],
  },
  {
    slug: 'surface-burst',
    term: 'Surface Burst',
    category: 'effects',
    short: 'A nuclear detonation at ground level, whose blast reaches less far than an optimum-height air burst but which creates heavy local fallout.',
    long: 'A nuclear detonation at ground level. Its blast reaches less far than an optimum-height air burst, and it creates heavy local fallout. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-2}} A surface burst is used when the target is hardened (silos, command bunkers) or when the attacker wants to maximize fallout. The fireball touches the ground, vaporizing soil and creating a large crater. Part of the energy goes into forming a crater and ground shock, and less thermal radiation reaches a given distance than from an air burst. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-7}} The radioactive plume can render hundreds of square kilometers uninhabitable for years.',
    related: ['air-burst', 'fallout', 'crater'],
  },
  {
    slug: 'emp',
    term: 'EMP (Electromagnetic Pulse)',
    category: 'effects',
    short: 'A burst of electromagnetic energy released by a nuclear detonation, capable of damaging or destroying unhardened electronics over a wide area.',
    long: 'A high-altitude nuclear detonation (above 30 km) produces a particularly strong EMP because gamma rays from the bomb interact with the upper atmosphere to generate a downward-directed electromagnetic wave covering thousands of kilometers. A single high-altitude burst over the central US could disable power grids and unhardened electronics across most of the continent. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-4}}',
    related: ['high-altitude-burst', 'gamma-radiation'],
  },
  {
    slug: 'nuclear-winter',
    term: 'Nuclear Winter',
    category: 'effects',
    short: 'A hypothesized severe global cooling caused by soot from urban firestorms following a large-scale nuclear war.',
    long: 'A 2019 study found that a war in which India and Pakistan used 250 weapons on cities could release 16-36 million tonnes of soot, cut sunlight at the surface by 20-35% and cool the planet by 2-5 °C, with recovery taking more than 10 years. {{c:science-advances-toon-et-al-rapidly-expanding-nu}} The result would be widespread crop failure and famine. Even a regional nuclear war causes significant cooling on these models.',
    related: ['fallout', 'fireball'],
  },
  {
    slug: 'acute-radiation-syndrome',
    term: 'Acute Radiation Syndrome',
    category: 'effects',
    short: 'The constellation of medical symptoms following a high dose of ionizing radiation, including nausea, immune-system failure, hemorrhage, and death.',
    long: 'ARS occurs at whole-body doses above about 0.7 gray. About half of exposed people die within 60 days at roughly 2.5 to 5 gray, and survival is extremely unlikely above about 10 gray. {{c:us-centers-for-disease-control-and-prevention-ac}} Symptoms progress through prodromal, latent, manifest illness, and either recovery or death.',
    related: ['fallout', 'sievert', 'gamma-radiation'],
  },

  // ── Weapons ────────────────────────────────────────────────────────────
  {
    slug: 'atomic-bomb',
    term: 'Atomic Bomb',
    category: 'weapons',
    short: 'A nuclear weapon whose energy comes from nuclear fission of uranium-235 or plutonium-239.',
    long: 'Atomic bombs (also called fission bombs) split heavy nuclei to release energy. Most fission weapons yield under about 100 kilotons, though pure-fission designs have reached 500 kilotons (Ivy King, 1952). Little Boy (uranium-235, gun-type) and Fat Man (plutonium-239, implosion) were both fission weapons. {{c:wikipedia-operation-ivy}}',
    related: ['hydrogen-bomb', 'thermonuclear-weapon', 'nuclear-fission', 'critical-mass'],
  },
  {
    slug: 'hydrogen-bomb',
    term: 'Hydrogen Bomb',
    category: 'weapons',
    short: 'A nuclear weapon that derives most of its energy from nuclear fusion of hydrogen isotopes, ignited by a fission primary stage.',
    long: 'Also called thermonuclear or H-bombs, hydrogen bombs use a fission explosion to ignite fusion in a secondary fuel. Yields are scalable to tens of megatons; the largest weapon ever tested, Tsar Bomba (1961), released about 50 megatons. {{c:atomic-heritage-foundation-national-museum-of-nu}}',
    related: ['thermonuclear-weapon', 'teller-ulam', 'tsar-bomba', 'nuclear-fusion'],
    sourceIds: ['effects-fireball', 'effects-blast-thermal'],
    sections: [
      {
        body: [
          { type: 'p', text: 'A hydrogen bomb is a nuclear weapon that gets most of its energy from fusion — the joining of light atoms — ignited by a fission explosion. Also called a thermonuclear weapon or H-bomb, it can be scaled to far higher yields than a pure fission (atomic) bomb. Seven countries have tested or claimed a thermonuclear device, and the three most powerful nuclear explosions in history were all hydrogen bombs.' },
        ],
      },
      {
        heading: 'How a thermonuclear bomb works',
        body: [
          { type: 'p', text: 'A thermonuclear bomb works by using a fission explosion to set off a much larger fusion reaction. In the words of the American Nuclear Society, "the energy from a fission device could ignite fusion in a secondary fuel." {{c:american-nuclear-society-nuclear-news-the-spark}} That staged arrangement is called the [Teller–Ulam design](/glossary#teller-ulam), after the two physicists who devised it. This page describes only that one-line concept; it carries no device design detail.' },
        ],
      },
      {
        heading: 'Which countries have hydrogen bombs',
        body: [
          { type: 'p', text: 'Five countries have confirmed thermonuclear tests — the United States, Russia, the United Kingdom, China and France — and two more, India and North Korea, have claimed thermonuclear devices that remain disputed.' },
          {
            type: 'table',
            columns: ['Country', 'First thermonuclear test', 'Date', 'Yield'],
            rows: [
              ['[United States](/nuclear-weapons-by-country/united-states)', 'Ivy Mike', '1 Nov 1952', '10.4 Mt {{c:us-doe-nnsa-nevada-field-office-united-states-nu}}'],
              ['[Russia (USSR)](/nuclear-weapons-by-country/russia)', 'Joe-4 (first thermonuclear explosion)', '12 Aug 1953', '400 kt {{c:nuclear-weapon-archive-soviet-atmospheric-tests}}'],
              ['[United Kingdom](/nuclear-weapons-by-country/united-kingdom)', 'Grapple X', '8 Nov 1957', '1.8 Mt {{c:atomic-archive-britain-goes-nuclear;uk-ministry-of-defence-uk-atmospheric-nuclear-te}}'],
              ['[China](/nuclear-weapons-by-country/china)', 'Test No. 6', '17 Jun 1967', '3.3 Mt {{c:atomic-archive-test-no-6-photo-caption}}'],
              ['[France](/nuclear-weapons-by-country/france)', 'Canopus', '24 Aug 1968', '2.6 Mt {{c:atomic-archive-canopus-photo-caption}}'],
              ['[India](/nuclear-weapons-by-country/india)', 'Claimed (Pokhran-II)', '11 May 1998', 'about 43 kt, disputed {{c:government-of-india-dae-drdo-joint-press-stateme;atomic-archive-the-nuclear-club-expands}}'],
              ['[North Korea](/nuclear-weapons-by-country/north-korea)', 'Claimed', '3 Sep 2017', 'about 250 kt, claim {{c:norsar-summing-up-the-nuclear-test-in-north-kore}}'],
            ],
            caption: 'Each country\'s first thermonuclear test. India\'s 1998 device was announced as thermonuclear by the government but is disputed (one of its own scientists later called it a "fizzle"); North Korea\'s 2017 test is a claim — seismic data alone cannot tell a fission bomb from a hydrogen bomb. {{c:deccan-herald-ians-chidambaram-puzzled-over-repo;norsar-summing-up-the-nuclear-test-in-north-kore}}',
          },
          { type: 'svg', id: 'hbomb-test-timeline', caption: 'First thermonuclear test by country, with yield on a logarithmic scale. India (1998) and North Korea (2017) are drawn hollow because their claims are disputed.' },
        ],
      },
      {
        heading: 'Who invented the hydrogen bomb',
        body: [
          { type: 'p', text: 'The two-stage thermonuclear design was devised in the United States by Edward Teller and Stanislaw Ulam, in a report (LAMS-1225) dated 9 March 1951. {{c:american-nuclear-society-nuclear-news-the-spark}} In the Soviet Union, Andrei Sakharov is called "the father of the Soviet hydrogen bomb"; his early "Layer Cake" (Sloika) design was the basis of the first Soviet thermonuclear test. {{c:nobel-prize-outreach-andrei-sakharov-facts;atomic-heritage-foundation-national-museum-of-nu-3}}' },
        ],
      },
      {
        heading: 'The first hydrogen bomb test',
        body: [
          { type: 'p', text: 'The first full-scale thermonuclear test was Ivy Mike, detonated on 1 November 1952 (local time) at Enewetak Atoll with a yield of 10.4 megatons. {{c:us-doe-nnsa-nevada-field-office-united-states-nu;american-nuclear-society-nuclear-news-the-spark}} You can see its effect radii on the [Ivy Mike weapon page](/weapons/ivy-mike). The Soviet Union\'s first thermonuclear explosion, Joe-4, followed on 12 August 1953 at 400 kilotons, and its first true two-stage device, RDS-37, on 22 November 1955 at 1.6 megatons. {{c:nuclear-weapon-archive-soviet-atmospheric-tests;atomic-archive-joe-6-rds-37-photo-caption}}' },
        ],
      },
      {
        heading: 'How powerful hydrogen bombs are',
        body: [
          { type: 'p', text: 'Hydrogen bombs span a huge range. Ivy Mike released 10.4 megatons and Castle Bravo, the largest US test, about 15 megatons, both from the US government test catalogue; {{c:us-doe-nnsa-nevada-field-office-united-states-nu}} Tsar Bomba released about 50 megatons, the largest nuclear explosion ever. {{c:the-national-wwii-museum-tsar-bomba-the-largest}} For a 10.4-megaton air burst the simulator computes a 5 psi moderate-blast radius of about {{r:10400:psi5}}; for 50 megatons it is about {{r:50000:psi5}}. See the full rings for [Ivy Mike](/nuclear-blast-radius?kt=10400), [Castle Bravo](/nuclear-blast-radius?kt=15000) and [Tsar Bomba](/nuclear-blast-radius?kt=50000).' },
          { type: 'svg', id: 'hbomb-ring-comparison', caption: 'The 5 psi moderate-blast radius of three hydrogen-bomb tests, drawn to scale, computed from the engine behind the blast-radius calculator.' },
        ],
      },
    ],
    faq: [
      {
        question: 'How does a hydrogen bomb work?',
        answer: 'A hydrogen bomb uses a fission explosion to ignite fusion in a secondary fuel, the one-line concept the American Nuclear Society gives. The staged arrangement is called the Teller–Ulam design. It lets a hydrogen bomb reach far higher yields than a pure fission bomb; this page carries no device design detail.',
        sourceIds: ['american-nuclear-society-nuclear-news-the-spark'],
      },
      {
        question: 'Which countries have hydrogen bombs?',
        answer: 'Five countries have confirmed thermonuclear tests: the United States (1952), Russia (1953), the United Kingdom (1957), China (1967) and France (1968). India announced a thermonuclear device in 1998 and North Korea claimed one in 2017, but both remain disputed.',
        sourceIds: ['us-doe-nnsa-nevada-field-office-united-states-nu', 'atomic-archive-britain-goes-nuclear', 'atomic-archive-the-nuclear-club-expands'],
      },
      {
        question: 'Who invented the hydrogen bomb?',
        answer: 'The two-stage thermonuclear design was devised in the United States by Edward Teller and Stanislaw Ulam, in a report dated 9 March 1951. In the Soviet Union, Andrei Sakharov is called the father of the Soviet hydrogen bomb.',
        sourceIds: ['american-nuclear-society-nuclear-news-the-spark', 'nobel-prize-outreach-andrei-sakharov-facts'],
      },
      {
        question: 'What was the first hydrogen bomb?',
        answer: 'The first full-scale thermonuclear test was Ivy Mike, detonated on 1 November 1952 at Enewetak Atoll with a yield of 10.4 megatons. The first Soviet thermonuclear explosion, Joe-4, came in 1953, and the first true two-stage Soviet device, RDS-37, in 1955.',
        sourceIds: ['us-doe-nnsa-nevada-field-office-united-states-nu', 'nuclear-weapon-archive-soviet-atmospheric-tests'],
      },
      {
        question: 'How powerful is a hydrogen bomb?',
        answer: 'Hydrogen bombs range from a few hundred kilotons to tens of megatons. Ivy Mike released 10.4 megatons and Tsar Bomba about 50 megatons, the largest nuclear explosion ever. A 50-megaton air burst has a 5 psi moderate-blast radius of about {{r:50000:psi5}}, far larger than any fission bomb.',
        sourceIds: ['us-doe-nnsa-nevada-field-office-united-states-nu', 'the-national-wwii-museum-tsar-bomba-the-largest'],
      },
      {
        question: 'Is a hydrogen bomb stronger than an atomic bomb?',
        answer: 'Yes. An atomic (pure fission) bomb is limited to roughly the low hundreds of kilotons, while a hydrogen bomb adds a fusion stage that can reach tens of megatons — Tsar Bomba was about 50 megatons, more than 3,000 times the 15-kiloton Hiroshima bomb. Both release energy from nuclear reactions, but the hydrogen bomb scales far higher.',
        sourceIds: ['the-national-wwii-museum-tsar-bomba-the-largest', 'us-doe-nnsa-nevada-field-office-united-states-nu'],
      },
    ],
  },
  {
    slug: 'thermonuclear-weapon',
    term: 'Thermonuclear Weapon',
    category: 'weapons',
    short: 'Synonym for hydrogen bomb — a nuclear weapon whose primary energy comes from fusion reactions.',
    long: 'A thermonuclear weapon uses a fission "primary" to drive radiation implosion of a fusion "secondary." This staged design (Teller–Ulam configuration) allows yields scalable from tens of kilotons to tens of megatons.',
    related: ['hydrogen-bomb', 'teller-ulam', 'nuclear-fusion'],
  },
  {
    slug: 'teller-ulam',
    term: 'Teller-Ulam Design',
    category: 'weapons',
    short: 'The two-stage design used in nearly all modern thermonuclear weapons, named after physicists Edward Teller and Stanislaw Ulam.',
    long: 'In the Teller–Ulam configuration, X-rays from a fission primary travel through a hohlraum and ablation-compress a separate fusion secondary, raising it to fusion-ignition temperatures. This radiation-implosion principle made very large yields practical. First proven in Ivy Mike (1952), the Teller-Ulam configuration became the template for later thermonuclear weapons. {{c:american-nuclear-society-nuclear-news-the-spark}}',
    related: ['hydrogen-bomb', 'thermonuclear-weapon', 'nuclear-fusion'],
  },
  {
    slug: 'warhead',
    term: 'Warhead',
    category: 'weapons',
    short: 'The explosive payload of a missile, bomb, or other weapon system; for nuclear weapons, the package containing the fissile or fusion material.',
    long: 'In nuclear arsenals, "warhead" usually refers to the physics package on a delivery vehicle (ICBM reentry vehicle, SLBM RV, cruise missile, gravity bomb). Most modern warheads yield between about 100 and 800 kilotons, though some are much smaller. {{c:federation-of-american-scientists-bulletin-of-th-2;bulletin-of-the-atomic-scientists-fas-russian-nu;bulletin-of-the-atomic-scientists-indian-nuclear}} The W76 and W88 are the most common US warheads; the B61 is a variable-yield gravity bomb.',
    related: ['icbm', 'slbm', 'mirv', 'reentry-vehicle'],
  },
  {
    slug: 'mirv',
    term: 'MIRV',
    category: 'weapons',
    short: 'Multiple Independently-targetable Reentry Vehicle — a single missile carrying several warheads, each able to strike a different target.',
    long: 'MIRV technology, deployed from the early 1970s, allows one ICBM or SLBM to deliver up to 8-10 warheads on different targets. {{c:us-air-force-lgm-30g-minuteman-iii-fact-sheet;federation-of-american-scientists-bulletin-of-th-2;bulletin-of-the-atomic-scientists-fas-russian-nu}} This was originally a counter-ABM measure but became the dominant warhead-multiplier in Cold War arsenals. New START limits MIRV deployments by warhead count, not by missile.',
    related: ['icbm', 'slbm', 'warhead', 'reentry-vehicle'],
  },
  {
    slug: 'icbm',
    term: 'ICBM (Intercontinental Ballistic Missile)',
    category: 'weapons',
    short: 'A long-range ballistic missile (range > 5,500 km) designed to deliver nuclear warheads between continents.',
    long: 'An ICBM is a long-range ballistic missile with a range greater than 5,500 km, designed to deliver nuclear warheads between continents. {{c:federation-of-american-scientists-intercontinent}} ICBMs are typically launched from hardened silos or mobile launchers, follow a ballistic trajectory through space, and reenter the atmosphere to strike targets thousands of kilometers away. US Minuteman III and Russian RS-28 Sarmat are current examples. An ICBM flight between Russia and the United States takes roughly 30 minutes, about 25 of them in midcourse flight. {{c:wikipedia-intercontinental-ballistic-missile}}',
    related: ['slbm', 'mirv', 'warhead', 'nuclear-triad'],
  },
  {
    slug: 'slbm',
    term: 'SLBM (Submarine-Launched Ballistic Missile)',
    category: 'weapons',
    short: 'A ballistic missile launched from a submerged submarine, providing a survivable second-strike nuclear capability.',
    long: 'SLBMs (Trident II, Bulava, etc.) are launched from ballistic-missile submarines (SSBNs) that hide in the ocean, making them nearly impossible to target preemptively. This survivability makes SLBMs the most credible second-strike leg of the nuclear triad. The W76 and W88 warheads ride US Trident II missiles.',
    related: ['icbm', 'second-strike', 'nuclear-triad', 'warhead'],
  },
  {
    slug: 'cruise-missile',
    term: 'Cruise Missile',
    category: 'weapons',
    short: 'A self-propelled jet- or rocket-powered missile that flies a low, terrain-following trajectory to a target.',
    long: 'Unlike ballistic missiles, cruise missiles fly at low altitude using GPS or terrain-contour matching for navigation. Some carry nuclear warheads (e.g., the AGM-86 ALCM with the W80 warhead). They are slower than ICBMs but harder to detect because they fly under radar.',
    related: ['icbm', 'warhead', 'w80'],
  },
  {
    slug: 'tactical-nuclear-weapon',
    term: 'Tactical Nuclear Weapon',
    category: 'weapons',
    short: 'A nuclear weapon designed for battlefield use, with shorter range and yields running from under 1 kt to 100 kt or more.',
    long: 'Tactical (non-strategic) nuclear weapons have shorter ranges; their yields run from under 1 kt to 100 kt or more (the US B61-3 bomb is rated at 0.3–170 kt). {{c:federation-of-american-scientists-bulletin-of-th-2;bulletin-of-the-atomic-scientists-fas-russian-nu}} They include artillery shells, depth charges, short-range missiles, and gravity bombs. Modern tactical weapons like the B61 and Russian Iskander-K warhead have variable yields (sometimes called "dial-a-yield"). The line between tactical and strategic blurs at higher yields.',
    related: ['strategic-nuclear-weapon', 'b61', 'davy-crockett'],
  },
  {
    slug: 'strategic-nuclear-weapon',
    term: 'Strategic Nuclear Weapon',
    category: 'weapons',
    short: 'A nuclear weapon designed for long-range strikes against an adversary\'s population centers, industrial base, or strategic infrastructure.',
    long: 'Strategic warheads typically yield about 100 to 800 kilotons; only a few still deployed exceed one megaton. {{c:federation-of-american-scientists-bulletin-of-th-2;bulletin-of-the-atomic-scientists-fas-russian-nu;bulletin-of-the-atomic-scientists-chinese-nuclea}} They are delivered by ICBMs, SLBMs, or strategic bombers and are governed by treaties such as New START. The US triad consists of Minuteman ICBMs, Trident SLBMs, and B-2 / B-21 bombers carrying B61 / B83 gravity bombs.',
    related: ['tactical-nuclear-weapon', 'icbm', 'slbm', 'nuclear-triad'],
  },
  {
    slug: 'neutron-bomb',
    term: 'Neutron Bomb',
    category: 'weapons',
    short: 'A small thermonuclear weapon designed to maximize neutron radiation output relative to blast and thermal effects.',
    long: 'Also called an "enhanced radiation weapon," a neutron bomb releases a much larger share of its energy as prompt radiation, about 40% compared with about 5% for a fission weapon. {{c:wikipedia-neutron-bomb}} This radiation kills biological targets without destroying buildings. Originally conceived as a battlefield anti-tank weapon, the W70-3 neutron warhead was produced from 1981 and retired in 1992. {{c:wikipedia-neutron-bomb}}',
    related: ['thermonuclear-weapon', 'tactical-nuclear-weapon'],
  },

  // ── Physics ────────────────────────────────────────────────────────────
  {
    slug: 'yield',
    term: 'Yield',
    category: 'physics',
    short: 'The total energy released by a nuclear weapon, expressed in tons (or kilotons / megatons) of TNT equivalent.',
    long: 'Nuclear yield is conventionally measured against TNT explosive energy: 1 kiloton (kt) = 1,000 tons of TNT, 1 megaton (Mt) = 1 million tons. The Hiroshima bomb was about 15 kt, Tsar Bomba 50,000 kt, and modern strategic warheads are typically 100-500 kt. {{c:wikipedia-nuclear-weapon-yield}}',
    related: ['kiloton', 'megaton', 'tnt-equivalent'],
  },
  {
    slug: 'kiloton',
    term: 'Kiloton (kt)',
    category: 'physics',
    short: 'A unit of nuclear yield equal to 1,000 tons of TNT equivalent (4.184 × 10¹² joules).',
    long: 'A kiloton is the standard unit for tactical-yield nuclear weapons, equal to 1,000 tons of TNT or 4.184 × 10¹² joules. The Hiroshima bomb was about 15 kilotons; modern artillery-fired nuclear shells (now retired) were sub-kiloton. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-5}}',
    related: ['yield', 'megaton', 'tnt-equivalent'],
  },
  {
    slug: 'megaton',
    term: 'Megaton (Mt)',
    category: 'physics',
    short: 'A unit of nuclear yield equal to 1,000,000 tons (or 1,000 kilotons) of TNT equivalent.',
    long: 'A megaton equals 1,000 kilotons, or one million tons of TNT. Most modern strategic warheads are below one megaton, typically about 100–800 kt. Tsar Bomba (about 50 Mt, 1961) is the largest weapon ever detonated. {{c:wikipedia-tnt-equivalent;encyclopaedia-britannica-tsar-bomba;federation-of-american-scientists-bulletin-of-th-2}}',
    related: ['yield', 'kiloton', 'tsar-bomba'],
  },
  {
    slug: 'nuclear-fission',
    term: 'Nuclear Fission',
    category: 'physics',
    short: 'The splitting of heavy atomic nuclei (typically uranium-235 or plutonium-239) into lighter fragments, releasing large amounts of energy.',
    long: 'Fission is the energy-release mechanism in atomic bombs and most nuclear power plants. Each fission event releases roughly 200 MeV of energy and 2–3 neutrons, which can sustain a chain reaction if a critical mass of fissile material is assembled. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-11}}',
    related: ['nuclear-fusion', 'critical-mass', 'uranium-235', 'plutonium-239'],
  },
  {
    slug: 'nuclear-fusion',
    term: 'Nuclear Fusion',
    category: 'physics',
    short: 'The combination of light atomic nuclei (typically deuterium and tritium) into heavier nuclei, releasing energy.',
    long: 'Fusion powers stars and is the energy mechanism in thermonuclear weapons. In a hydrogen bomb, a fission primary compresses and heats lithium-deuteride fuel to fusion-ignition temperatures (tens of millions of degrees), releasing far more energy than fission alone. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-5}}',
    related: ['nuclear-fission', 'thermonuclear-weapon', 'deuterium', 'tritium'],
  },
  {
    slug: 'critical-mass',
    term: 'Critical Mass',
    category: 'physics',
    short: 'The minimum amount of fissile material required to sustain a self-propagating nuclear chain reaction.',
    long: 'For a bare sphere, the critical mass is about 10 kg for plutonium-239 and about 46 kg for pure uranium-235. {{c:los-alamos-national-laboratory-nuclear-science-f}} Critical mass is reduced by neutron reflectors (tampers) and by compression. Atomic bombs work by rapidly assembling a supercritical mass before the chain reaction blows itself apart.',
    related: ['nuclear-fission', 'plutonium-239', 'uranium-235', 'atomic-bomb'],
  },
  {
    slug: 'uranium-235',
    term: 'Uranium-235',
    category: 'physics',
    short: 'A fissile isotope of uranium that constitutes the explosive material in many fission weapons.',
    long: 'Natural uranium is about 99.3% U-238 and 0.7% U-235. Weapons-grade uranium is enriched to about 90% U-235 or more, a process requiring centrifuges or gaseous diffusion. Little Boy used about 64 kg of uranium enriched to an average of about 80% U-235. {{c:ieer-uranium-enrichment-just-plain-facts-to-fuel}}',
    related: ['plutonium-239', 'critical-mass', 'nuclear-fission', 'little-boy'],
  },
  {
    slug: 'plutonium-239',
    term: 'Plutonium-239',
    category: 'physics',
    short: 'A fissile isotope of plutonium produced from uranium-238 in nuclear reactors and used in most modern fission weapons.',
    long: 'Pu-239 has a smaller critical mass than U-235 and is the preferred material for compact fission weapons. It cannot be assembled by gun-type designs (it would predetonate), so plutonium weapons use implosion. The Nagasaki bomb (Fat Man) used about 6.2 kg of plutonium. {{c:wikipedia-fat-man}}',
    related: ['uranium-235', 'critical-mass', 'fat-man', 'implosion'],
  },
  {
    slug: 'deuterium',
    term: 'Deuterium',
    category: 'physics',
    short: 'A heavy isotope of hydrogen with one neutron, used as fusion fuel in thermonuclear weapons.',
    long: 'In ocean water, about 1 hydrogen atom in 6,420 is deuterium. {{c:wikipedia-deuterium}} In thermonuclear weapons, lithium-6 deuteride (a solid compound) is the fusion fuel: neutron irradiation of the lithium produces tritium in situ, which then fuses with deuterium to release energy.',
    related: ['tritium', 'nuclear-fusion', 'thermonuclear-weapon'],
  },
  {
    slug: 'tritium',
    term: 'Tritium',
    category: 'physics',
    short: 'A radioactive heavy isotope of hydrogen with two neutrons, used as fusion fuel and in boosted-fission weapons.',
    long: 'Tritium has a half-life of 12.3 years, so warhead arsenals require ongoing tritium production to replace decay. {{c:us-doe-savannah-river-site-environmental-report}} Modern boosted-fission weapons inject tritium-deuterium gas into the fission core to enhance yield. Tritium is produced by irradiating lithium-6 in nuclear reactors.',
    related: ['deuterium', 'nuclear-fusion', 'boosted-fission', 'half-life'],
  },
  {
    slug: 'half-life',
    term: 'Half-Life',
    category: 'physics',
    short: 'The time required for half of a quantity of a radioactive isotope to decay.',
    long: 'Different isotopes have wildly different half-lives: tritium 12.3 years, cesium-137 30 years, plutonium-239 24,100 years, uranium-235 704 million years. {{c:us-doe-savannah-river-site-environmental-report}} Half-life determines fallout persistence: short-lived isotopes dominate early radiation, long-lived isotopes contaminate the environment for decades.',
    related: ['fallout', 'tritium', 'plutonium-239'],
  },
  {
    slug: 'sievert',
    term: 'Sievert (Sv)',
    category: 'physics',
    short: 'The SI unit of equivalent dose of ionizing radiation, accounting for biological effect; natural background averages about 2.4 millisieverts per year worldwide.',
    long: 'The sievert measures equivalent dose, weighting absorbed energy by biological effect. Acute effects are usually stated in gray: a whole-body dose above about 0.7 gray causes acute radiation syndrome; about 2.5 to 5 gray kills roughly half of exposed people within 60 days; survival is extremely unlikely above about 10 gray. {{c:us-centers-for-disease-control-and-prevention-ac}} Natural background radiation averages about 2.4 millisieverts per year worldwide. Aircrew and astronauts receive notably higher doses.',
    related: ['acute-radiation-syndrome', 'gamma-radiation'],
  },
  {
    slug: 'gamma-radiation',
    term: 'Gamma Radiation',
    category: 'physics',
    short: 'High-energy electromagnetic radiation emitted by nuclear processes, capable of penetrating most materials and damaging living tissue.',
    long: 'Gamma rays from a nuclear detonation cause acute radiation injury at close range and contribute to fallout dose at long range. Heavy shielding (lead, concrete) is required to attenuate gamma radiation. The high-altitude EMP effect is initiated by gamma-ray interaction with atmospheric atoms.',
    related: ['emp', 'sievert', 'acute-radiation-syndrome'],
  },
  {
    slug: 'boosted-fission',
    term: 'Boosted Fission',
    category: 'physics',
    short: 'A fission weapon design in which a small amount of deuterium-tritium gas is injected into the fissile core to enhance yield.',
    long: 'Boosting uses neutrons from a small amount of fusion fuel to make roughly twice as much of the fissile material fission, raising the yield; the fusion itself adds only about 1% of the energy. {{c:wikipedia-boosted-fission-weapon}} The fusion neutrons released by D-T reactions cause a much higher fraction of the fissile core to fission before the bomb disassembles. Most modern fission primaries are boosted.',
    related: ['nuclear-fission', 'tritium', 'thermonuclear-weapon'],
  },
  {
    slug: 'second-degree-burns',
    term: 'Second-Degree Burns',
    category: 'physics',
    short: 'Partial-thickness burns affecting both the epidermis and dermis, characterized by blistering and pain.',
    long: 'In a nuclear context, the 2nd-degree burn radius is the distance at which exposed skin receives enough thermal radiation to blister; the energy needed rises with yield. For a Hiroshima-yield bomb this radius is about {{r:15:burn2}}; for a 1 Mt weapon about {{r:1000:burn2}}. {{c:wikipedia-effects-of-nuclear-explosions-scaling}}',
    related: ['thermal-radiation', 'fireball'],
  },

  // ── Doctrine ───────────────────────────────────────────────────────────
  {
    slug: 'mad',
    term: 'MAD (Mutually Assured Destruction)',
    category: 'doctrine',
    short: 'A Cold War strategic doctrine in which two or more nuclear-armed adversaries each possess sufficient retaliatory capability that any nuclear attack would result in their own destruction.',
    long: 'MAD relies on each side maintaining a credible second-strike capability — typically through hardened ICBM silos, strategic bombers, and ballistic-missile submarines. The logic is paradoxical: weapons exist precisely so that they will not be used. MAD is the implicit framework of the post-1960s nuclear standoff.',
    related: ['second-strike', 'first-strike', 'nuclear-deterrence', 'nuclear-triad'],
  },
  {
    slug: 'first-strike',
    term: 'First Strike',
    category: 'doctrine',
    short: 'A nuclear attack intended to disarm an opponent before they can retaliate, by destroying their nuclear forces, command, and control.',
    long: 'A counterforce first strike targets the opponent\'s missile silos, submarine bases, and command bunkers. To succeed it must destroy enough of the opponent\'s forces that the residual second strike is acceptable to the attacker. Modern MIRVed missiles and high accuracy make first-strike scenarios more plausible than during early Cold War.',
    related: ['second-strike', 'mad', 'counterforce'],
  },
  {
    slug: 'second-strike',
    term: 'Second Strike',
    category: 'doctrine',
    short: 'The retaliatory nuclear capability remaining after absorbing an opponent\'s first strike — the foundation of deterrence under MAD.',
    long: 'Second-strike survivability is achieved through redundancy and concealment: hardened ICBM silos that can withstand near-misses, ballistic-missile submarines patrolling the oceans, and dispersed strategic bombers. The submarine leg is generally considered the most survivable.',
    related: ['first-strike', 'mad', 'slbm', 'nuclear-triad'],
  },
  {
    slug: 'nuclear-triad',
    term: 'Nuclear Triad',
    category: 'doctrine',
    short: 'A three-pronged nuclear force structure consisting of land-based ICBMs, submarine-launched ballistic missiles (SLBMs), and strategic bombers.',
    long: 'The triad provides survivability through diversity: each leg has different vulnerabilities. ICBMs are accurate but fixed; SLBMs are survivable but harder to recall; bombers are flexible but slow. The US and Russia operate full triads, and China and India field less mature ones. France relies on submarines and aircraft, and the UK only on submarine-launched Trident missiles. {{c:federation-of-american-scientists-bulletin-of-th;bulletin-of-the-atomic-scientists-french-nuclear;bulletin-of-the-atomic-scientists-chinese-nuclea;bulletin-of-the-atomic-scientists-indian-nuclear}}',
    related: ['icbm', 'slbm', 'second-strike', 'mad'],
  },
  {
    slug: 'counterforce',
    term: 'Counterforce',
    category: 'doctrine',
    short: 'A nuclear targeting strategy aimed at destroying an opponent\'s military forces, especially their nuclear weapons and command-and-control.',
    long: 'Counterforce attacks target missile silos, submarine bases, airfields, and command bunkers. Success requires high accuracy and prompt strike capability — historically associated with the development of MIRVs and improved guidance. Counterforce is paired with first-strike scenarios and is destabilizing because it raises pre-emption incentives.',
    related: ['countervalue', 'first-strike', 'mirv'],
  },
  {
    slug: 'countervalue',
    term: 'Countervalue',
    category: 'doctrine',
    short: 'A nuclear targeting strategy aimed at destroying an opponent\'s population centers, industry, and economic infrastructure.',
    long: 'Countervalue targeting is the classical approach to nuclear deterrence: hold the opponent\'s cities at risk so they cannot survive a war as a nation. It does not require pinpoint accuracy and was the dominant strategy during the early Cold War. MAD is fundamentally a countervalue concept.',
    related: ['counterforce', 'mad', 'nuclear-deterrence'],
  },
  {
    slug: 'nuclear-deterrence',
    term: 'Nuclear Deterrence',
    category: 'doctrine',
    short: 'The strategy of preventing adversary action by maintaining a credible threat of unacceptable nuclear retaliation.',
    long: 'Effective deterrence requires three elements: capability (sufficient survivable forces), credibility (the adversary believes the weapons will be used), and communication (clear signaling of red lines). Deterrence is fragile: misperception, accidents, and crisis instability can break it.',
    related: ['mad', 'first-strike', 'second-strike'],
  },
  {
    slug: 'dead-hand',
    term: 'Dead Hand',
    category: 'doctrine',
    short: 'A semi-automated Soviet (and reportedly current Russian) nuclear-retaliation system that can launch a counterstrike even if national leadership has been killed.',
    long: 'The Soviet Perimeter system, often called Dead Hand, entered service in 1985 after development that began in 1974. {{c:wikipedia-dead-hand}} If sensors detect a nuclear attack and command-and-control has been severed, the system enables surviving officers to authorize a full retaliatory launch. Russia is widely believed to maintain a modernized version.',
    related: ['second-strike', 'mad'],
  },
  {
    slug: 'permissive-action-link',
    term: 'Permissive Action Link (PAL)',
    category: 'doctrine',
    short: 'A security device built into nuclear weapons that prevents unauthorized arming or detonation without the correct code.',
    long: 'A June 1962 presidential order (NSAM 160) required PALs on US nuclear weapons in Europe, to prevent unauthorized arming or detonation. {{c:wikipedia-permissive-action-link}} Modern PALs disable the warhead if tampered with. The Soviet Union and Russia use a different system based on centralized release codes.',
    related: ['warhead', 'first-strike'],
  },

  // ── Treaty / law ───────────────────────────────────────────────────────
  {
    slug: 'npt',
    term: 'NPT (Non-Proliferation Treaty)',
    category: 'treaty',
    short: 'The 1968 Treaty on the Non-Proliferation of Nuclear Weapons, which recognizes five nuclear-weapon states and obligates them to pursue disarmament.',
    long: 'The 1968 Treaty on the Non-Proliferation of Nuclear Weapons recognizes five nuclear-weapon states, defined as those that exploded a nuclear device before 1 January 1967. {{c:un-office-for-disarmament-affairs-treaty-on-the;un-office-for-disarmament-affairs-npt-text-of-th;nus-centre-for-international-law-1968-treaty-on}} These are the US, USSR/Russia, UK, France, and China. All other parties commit not to acquire nuclear weapons in exchange for access to peaceful nuclear technology. India, Pakistan, Israel, and North Korea (which withdrew) operate outside the NPT framework.',
    related: ['tpnw', 'ctbt'],
  },
  {
    slug: 'tpnw',
    term: 'TPNW (Treaty on the Prohibition of Nuclear Weapons)',
    category: 'treaty',
    short: 'A 2017 UN treaty that prohibits all activities related to nuclear weapons — development, possession, testing, threats of use — for state parties.',
    long: 'The TPNW entered into force in January 2021. 75 states are parties to the TPNW as of September 2026. {{c:united-nations-treaty-collection-status-of-treat;hiroshima-prefectural-government-status-of-the-t;nuclear-threat-initiative-treaty-on-the-prohibit}} None of the nine nuclear-armed states have signed; the treaty is intended to stigmatize possession and build pressure toward eventual abolition. ICAN, the lead civil-society coalition behind the TPNW, won the 2017 Nobel Peace Prize. {{c:norwegian-nobel-committee-the-nobel-peace-prize}}',
    related: ['npt', 'ctbt'],
  },
  {
    slug: 'ctbt',
    term: 'CTBT (Comprehensive Test Ban Treaty)',
    category: 'treaty',
    short: 'A 1996 treaty banning all nuclear explosions in all environments, for both military and civilian purposes.',
    long: 'The CTBT cannot enter into force until nine more key states ratify it: China, Egypt, India, Iran, Israel, North Korea, Pakistan, Russia and the United States. {{c:ctbto-preparatory-commission-frequently-asked-qu}} Despite this, all states except North Korea have observed a de-facto testing moratorium since the late 1990s. The CTBTO operates a global monitoring network.',
    related: ['npt', 'tpnw'],
  },
  {
    slug: 'new-start',
    term: 'New START',
    category: 'treaty',
    short: 'A 2010 US–Russia treaty that capped each side at 1,550 deployed strategic warheads, 700 deployed missiles and bombers, and 800 total launchers.',
    long: 'New START replaced the 1991 START I treaty. It capped each side at 1,550 deployed strategic warheads, 700 deployed missiles and bombers, and 800 total launchers. Russia suspended participation in February 2023, and the treaty expired on 5 February 2026 with no replacement. {{c:federation-of-american-scientists-the-aftermath;nuclear-threat-initiative-new-start-treaty;arms-control-association-new-start-expires-as-u;un-office-for-disarmament-affairs-cd-2500-russia}} It was the last remaining bilateral US–Russia nuclear arms control agreement.',
    related: ['icbm', 'slbm', 'mirv'],
  },
]

export function findGlossaryEntry(slug: string): GlossaryEntry | undefined {
  return glossary.find((g) => g.slug === slug)
}

export function categoryLabel(c: GlossaryCategory): string {
  switch (c) {
    case 'effects': return 'Nuclear weapon effects'
    case 'weapons': return 'Weapons & delivery systems'
    case 'physics': return 'Nuclear physics'
    case 'doctrine': return 'Doctrine & strategy'
    case 'treaty': return 'Treaties & arms control'
  }
}
