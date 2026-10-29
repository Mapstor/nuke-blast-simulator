import type { Article } from './types'

// Blog articles by Marko Visic. Authored for general educated audiences. Every claim
// is paraphrased from authoritative public-domain sources (Glasstone & Dolan,
// FAS, SIPRI, NTI, Defense Threat Reduction Agency, Robock et al.). Each
// article is structured for AI citation: the first sentence of each section
// is a self-contained answer, followed by depth.

export const articles: Article[] = [
  // ── 1. How Nuclear Weapons Work ────────────────────────────────────────
  {
    slug: 'how-nuclear-weapons-work',
    title: 'How Nuclear Weapons Work: A Plain-English Guide',
    description: 'A clear walkthrough of how atomic and hydrogen bombs actually work — fission, fusion, gun-type vs implosion designs, and the two-stage Teller-Ulam configuration that powers all modern thermonuclear weapons.',
    datePublished: '2026-04-29',
    author: 'Marko Visic',
    category: 'physics',
    readingMinutes: 9,
    body: [
      {
        body: [
          { type: 'p', text: 'Every nuclear weapon ever built falls into one of two categories: pure-fission "atomic" bombs that split heavy atoms, and "hydrogen" bombs that use a small fission stage to ignite a much larger fusion stage. The two designs differ by orders of magnitude in yield — the Hiroshima bomb released about 15 kilotons of energy, while the largest hydrogen bomb ever tested released 50 million tons. The mechanism behind that 3,300× scaling is the subject of this guide. {{c:us-doe-nevada-operations-office-united-states-nu}}' },
        ],
      },
      {
        heading: 'What "splitting an atom" actually means',
        body: [
          { type: 'p', text: 'A nuclear fission weapon releases energy by splitting heavy nuclei — typically uranium-235 or plutonium-239 — into lighter fragments. When a neutron strikes a U-235 nucleus, the nucleus splits, releasing roughly 200 MeV of energy and two or three new neutrons. Each new neutron can split another nucleus, producing more neutrons, in a self-sustaining chain reaction. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-11}}' },
          { type: 'p', text: 'For the chain reaction to release usable energy, the fissile material must be assembled into a "supercritical mass" — enough material in a compact enough geometry that more neutrons trigger fissions than escape. Below this threshold (the critical mass) the reaction dies out; above it, the chain reaction grows exponentially and releases almost all of its energy in under a microsecond, until the expanding core becomes subcritical and the reaction stops, leaving an appreciable part of the fissile material unfissioned. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-11}}' },
          { type: 'p', text: 'The trick of an atomic bomb is to assemble a supercritical mass of fissile material extremely quickly — too quickly for the early energy release to disassemble the bomb before most of the material has fissioned.' },
        ],
      },
      {
        heading: 'Little Boy: gun-type uranium',
        body: [
          { type: 'p', text: 'The Hiroshima bomb (Little Boy) used the simplest possible design: a "gun-type" device that fired one subcritical mass of uranium-235 down a barrel into another subcritical mass. When the two pieces collided, they formed a single supercritical mass and the chain reaction began.' },
          { type: 'p', text: 'Gun-type assembly is slow but works for U-235, which has a low spontaneous-fission rate. Little Boy used roughly 64 kg of highly enriched uranium and yielded about 15 kilotons. {{c:wikipedia-little-boy}} The weapon was so confidently expected to work that it was never tested before being dropped.' },
          { type: 'p', text: 'Gun-type cannot work for plutonium-239 because Pu-239 contains trace Pu-240 that spontaneously fissions, causing premature ignition (a "fizzle") before the masses fully assemble. A different approach was needed for plutonium.' },
        ],
      },
      {
        heading: 'Fat Man: implosion plutonium',
        body: [
          { type: 'p', text: 'The Nagasaki bomb (Fat Man) used implosion: a hollow plutonium sphere surrounded by precisely shaped explosive lenses that, when detonated simultaneously, compress the plutonium inward at supersonic speeds. The compression dramatically increases density, pushing the plutonium past critical mass before predetonation can occur.' },
          { type: 'p', text: 'Implosion is much harder to engineer than gun-type — the explosive lenses must fire within microseconds of each other, and the shock wave must remain spherically symmetric. The Trinity test on July 16, 1945 was a proof-of-concept for the implosion design before Fat Man was used over Nagasaki on August 9. {{c:wikipedia-trinity-nuclear-test}} Fat Man yielded about 21 kilotons from roughly 6 kg of plutonium. {{c:wikipedia-fat-man}}' },
          { type: 'p', text: 'Implosion remains the standard fission-primary design in modern thermonuclear weapons, where the high yield-per-mass efficiency of plutonium matters.' },
        ],
      },
      {
        heading: 'The leap to hydrogen bombs',
        body: [
          { type: 'p', text: 'The largest pure-fission device ever tested, Ivy King (1952), yielded 500 kilotons. {{c:wikipedia-ivy-king}} As the fissile core fissions and heats up, it disassembles before all of the material has reacted, which limits how far yield can be pushed by fission alone. To go higher, you need a fundamentally different energy mechanism. Nuclear fusion, which combines light nuclei, releases far more energy per unit mass than fission, but requires temperatures of tens of millions of degrees to ignite. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-11}}' },
          { type: 'p', text: 'A hydrogen bomb uses a small fission "primary" as a match to ignite a much larger fusion "secondary." The primary detonates first; its X-ray flux is channeled to the secondary, where it compresses and heats fusion fuel (typically lithium-deuteride) to fusion-ignition conditions. The secondary then releases its energy as fusion neutrons, with a third stage of fission in the surrounding U-238 jacket.' },
        ],
      },
      {
        heading: 'The Teller-Ulam design',
        body: [
          { type: 'p', text: 'The breakthrough that made hydrogen bombs practical was the two-stage radiation-implosion configuration, designed by Stanislaw Ulam and Edward Teller in 1951. {{c:american-nuclear-society-nuclear-news-the-spark}} In the Teller-Ulam design, the fission primary and fusion secondary sit in a hohlraum (radiation cavity) inside the bomb case. X-rays from the primary travel through the cavity at the speed of light and ablate the outer surface of the secondary, driving it inward by reaction force.' },
          { type: 'p', text: 'This radiation implosion compresses the secondary far more uniformly and powerfully than ordinary explosives could, raising it to fusion-ignition temperature. The first test of the design was Ivy Mike in November 1952 — a 10.4 megaton detonation that vaporized the entire test island. {{c:wikipedia-operation-ivy}} Every operational thermonuclear weapon since uses some variant of the Teller-Ulam configuration.' },
        ],
      },
      {
        heading: 'Boosted fission and modern weapons',
        body: [
          { type: 'p', text: 'Most modern fission primaries are also "boosted": a small amount of deuterium-tritium gas is injected into the plutonium core. When the primary detonates, the D-T undergoes fusion, releasing a flood of high-energy neutrons that drive a much higher fraction of the plutonium to fission. Boosting roughly doubled the yield in its first test, Greenhouse Item (1951), which yielded 45.5 kilotons. {{c:wikipedia-greenhouse-item}}' },
          { type: 'p', text: 'The result of these design improvements is that modern strategic warheads are remarkably compact. The W88, deployed on US Trident II SLBMs, has an estimated yield of about 455 kilotons, and each Trident II can carry up to eight warheads. {{c:bulletin-of-the-atomic-scientists-fas-united-sta}} The B83-1, the most powerful US weapon still in the stockpile (slated for retirement), yields up to 1.2 megatons. {{c:bulletin-of-the-atomic-scientists-fas-united-sta}}' },
          { type: 'p', text: 'See the full Weapons Database for individual profiles, the methodology page for the blast scaling laws, and the glossary for definitions of fission, fusion, boosted fission, and the Teller-Ulam design.' },
        ],
      },
    ],
  },

  // ── 2. The Physics of Nuclear Blast ────────────────────────────────────
  {
    slug: 'physics-of-nuclear-blast',
    title: 'The Physics of Nuclear Blast: Yield, Scaling Laws, and Why Doubling Yield Doesn\'t Double the Radius',
    description: 'A walkthrough of the cube-root scaling law that governs nuclear blast effects — why a weapon ten times more powerful is only about twice as wide, and how that math shapes nuclear strategy.',
    datePublished: '2026-04-29',
    author: 'Marko Visic',
    category: 'physics',
    readingMinutes: 8,
    body: [
      {
        body: [
          { type: 'p', text: 'Nuclear weapons are described by a single number — yield, in kilotons or megatons of TNT equivalent. But yield does not translate directly into damage radius. A weapon ten times more powerful than another is only roughly 2.15 times as wide in its blast effects. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-2}} This counterintuitive scaling shapes everything from arsenal design to targeting strategy.' },
        ],
      },
      {
        heading: 'What "yield" actually measures',
        body: [
          { type: 'p', text: 'Nuclear yield is the total energy released by a weapon, expressed in TNT equivalent: 1 kiloton equals 1,000 tons of TNT, or 4.184 × 10¹² joules. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-5}} The Hiroshima bomb released 15 kilotons; Tsar Bomba released 50,000 kilotons; modern strategic warheads typically release 100–500 kilotons. {{c:bulletin-of-the-atomic-scientists-fas-united-sta}}' },
          { type: 'p', text: 'But that energy is distributed across multiple effects. For a fission weapon exploded in the air below about 40,000 ft, roughly 50% of the energy goes into blast, 35% into thermal radiation, 5% into initial nuclear radiation and 10% into residual (delayed) radiation, carried mainly by fallout. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-5}} The exact split depends on burst altitude and weapon design.' },
        ],
      },
      {
        heading: 'The cube-root scaling law',
        body: [
          { type: 'p', text: 'Blast overpressure radius scales with the cube root of yield. The reason is geometric: the energy released expands roughly as a sphere, so the volume scales linearly with energy and the radius scales as the cube root of the volume. Specifically, the radius for a given overpressure (5 PSI, 1 PSI, etc.) grows as yield to the one-third power. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-2}}' },
          { type: 'p', text: 'In practice, this means a 100-kiloton weapon has a 5 PSI radius of about {{r:100:psi5}}. A 1-megaton weapon (10× more energy) has a 5 PSI radius of about {{r:1000:psi5}}, only about 2.15× larger. To double the blast radius, you need to multiply yield by about 8. {{c:wikipedia-effects-of-nuclear-explosions-scaling}}' },
        ],
      },
      {
        heading: 'Thermal radiation scales differently',
        body: [
          { type: 'p', text: 'Thermal radiation radius grows roughly as yield to the 0.4 power, slightly faster than blast (yield to the 1/3 power). {{c:wikipedia-effects-of-nuclear-explosions-scaling}} This is because thermal energy is delivered as a brief flash that radiates more efficiently to longer distances. For very large weapons, the thermal radius can exceed the blast radius. Tsar Bomba\'s blast wave broke windows hundreds of kilometers away, reportedly up to about 900 km. {{c:wilson-center-cold-war-international-history-pro}}' },
          { type: 'p', text: 'For most modern strategic weapons (100 kt to 1 Mt), thermal and blast radii are comparable. The differences become noticeable only for very small (sub-kiloton) or very large (multi-megaton) weapons.' },
        ],
      },
      {
        heading: 'Air burst vs surface burst',
        body: [
          { type: 'p', text: 'The same weapon produces different effects depending on detonation altitude. An air burst — detonated above the ground at the optimal altitude — maximizes the area affected by blast and thermal radiation, because the shock wave reflects off the ground and reinforces the direct wave (the "Mach stem" effect). Air bursts produce minimal fallout because the fireball does not touch the ground.' },
          { type: 'p', text: 'A surface burst — detonated at ground level — produces a smaller blast radius than an air burst at the optimum height, for most overpressures, because much of the bomb\'s energy goes into cratering and ground shock. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-2}} But the fireball touches the ground and vaporizes soil, lofting it into the upper atmosphere as radioactive fallout. Surface bursts produce heavy lethal fallout plumes that drift far downwind; fallout from the Castle Bravo test contaminated an area more than 530 km long. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e}}' },
          { type: 'p', text: 'Hiroshima and Nagasaki were both air bursts, optimized for area destruction at the cost of fallout. Surface bursts are typically reserved for hardened targets — missile silos, command bunkers, deep-buried command-and-control nodes.' },
        ],
      },
      {
        heading: 'Why arsenals shrunk in yield',
        body: [
          { type: 'p', text: 'Cold-War arsenals featured single warheads in the multi-megaton range — the W53 warhead on the Titan II missile yielded 9 megatons. {{c:nuclear-weapon-archive-complete-list-of-all-u-s}} Modern arsenals have moved to lower yields (100-500 kt) for two reasons. First, MIRVing — putting multiple warheads on one missile — works better with smaller, lighter warheads. A Trident II can carry up to eight W88 warheads (about 455 kt each) instead of one large warhead. {{c:bulletin-of-the-atomic-scientists-fas-united-sta}}' },
          { type: 'p', text: 'Second, accuracy improved dramatically. Early ICBMs could land within a kilometer or two of target; modern ICBMs are very accurate, with accuracy given as circular error probable (CEP), the radius within which half the warheads are expected to land. {{c:wikipedia-circular-error-probable}} With high accuracy, a smaller warhead does the same damage to the target while reducing collateral effects. The cube-root scaling means that the blast radius of a 455 kt warhead is "only" about {{r:455:psi5}} for the 5 PSI zone — but that is more than enough to destroy any city center if the missile lands accurately. {{c:wikipedia-effects-of-nuclear-explosions-scaling}}' },
        ],
      },
      {
        heading: 'How the simulator uses these formulas',
        body: [
          { type: 'p', text: 'The radii come from the scaling laws in The Effects of Nuclear Weapons (Glasstone & Dolan, 1977) and the standard scaling-law table derived from it. The fireball radius is computed as about 0.061 × yield_kt^0.4 km (from Glasstone & Dolan §2.127); blast and burn radii are interpolated from a published table of ranges for 1 kt to 20 Mt air bursts. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-3}} See the full methodology page for all formulas.' },
          { type: 'p', text: 'These formulas are calibrated against decades of nuclear test data. They idealize conditions — flat terrain, clear weather, no buildings — but provide a useful first-order picture of nuclear effects. Real-world casualties depend strongly on time of day, sheltering, building construction, and weather. The simulator\'s number should be interpreted as an order-of-magnitude estimate, not a precise prediction.' },
        ],
      },
    ],
  },

  // ── 3. What Happens in a Nuclear Explosion ─────────────────────────────
  {
    slug: 'four-kill-mechanisms',
    title: 'Nuclear Explosion: What Happens, Second by Second',
    description: 'A nuclear explosion unfolds in a fixed order: a flash at the speed of light, a fireball, a shock wave, then the mushroom cloud. What happens second by second, how hot it gets and how far it reaches, every figure cited.',
    datePublished: '2026-04-29',
    author: 'Marko Visic',
    category: 'effects',
    readingMinutes: 9,
    body: [
      {
        body: [
          { type: 'p', text: 'A nuclear explosion is the very rapid release of a large amount of energy in a small space, {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}} and it unfolds in a fixed order. A fireball forms in under a millionth of a second; a flash of light and heat races out at the speed of light; a shock wave follows through the air; and a mushroom cloud rises for about ten minutes. The times and distances below are for a 1-megaton air burst, from the standard reference The Effects of Nuclear Weapons (Glasstone & Dolan).' },
        ],
      },
      {
        heading: 'What happens, in order',
        body: [
          { type: 'p', text: 'In the first instant, the weapon\'s energy forms a fireball — a spherical mass of incandescent air and bomb residues — in less than a millionth of a second. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}} Within about 0.7 millisecond the fireball of a 1-megaton burst is roughly 440 feet across; by 10 seconds it has grown to about 5,700 feet. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}} The flash of light and heat leaves at the speed of light, {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}} so it reaches the eyes before anything else.' },
          { type: 'p', text: 'A shock front races ahead of the fireball: about 3 miles out at 10 seconds and about 12 miles out at 50 seconds, by then moving at roughly 1,150 feet per second, a little faster than sound at sea level. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}} Initial nuclear radiation — the gamma rays and neutrons released in roughly the first minute — arrives over the same interval. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}} The cloud top reaches about 3 miles at 30 seconds and about 5 miles within a minute, climbing to its maximum height after about 10 minutes. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}}' },
          { type: 'svg', id: 'explosion-timeline', caption: 'A 1-megaton air burst, from the fireball forming in under a millionth of a second to the cloud reaching maximum height at about 10 minutes. Times and distances from Glasstone & Dolan. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}}' },
        ],
      },
      {
        heading: 'How hot it gets',
        body: [
          { type: 'p', text: 'At the first instant the weapon residues reach several tens of millions of degrees — hotter than the centre of the Sun. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}} That heat is what forms the fireball and drives the thermal flash. As the fireball expands and cools it radiates most of its energy as light and infrared, the pulse that causes burns and starts fires at a distance.' },
        ],
      },
      {
        heading: 'How big it gets',
        body: [
          { type: 'p', text: 'The fireball of a 1-megaton burst grows to about 5,700 feet across within 10 seconds, {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}} but the destructive radii reach much further. How far the blast and heat extend depends on yield, and for that the [nuclear blast radius calculator](/nuclear-blast-radius) computes the fireball, blast and thermal rings for any weapon from 1 kiloton to 50 megatons on a map of any city.' },
        ],
      },
      {
        heading: 'The sound and the shock wave',
        body: [
          { type: 'p', text: 'The shock wave is what people hear as the explosion, and it arrives well after the flash because it travels at roughly the speed of sound rather than the speed of light. By 50 seconds after a 1-megaton burst the shock front is about 12 miles out and moving at about 1,150 feet per second. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}} Closer in, it arrives in seconds: roughly 1.4 seconds at 1 mile and 4.5 seconds at 2 miles. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}} Because the flash arrives first, someone a few miles away sees the light, then feels the blast seconds later.' },
        ],
      },
      {
        heading: 'Underwater and in space',
        body: [
          { type: 'p', text: 'Not every nuclear explosion is an air burst over a city. In the 1946 Crossroads Baker test, a 21-kiloton device was detonated 90 feet underwater at Bikini Atoll on 25 July (local time), throwing up a column of water and a base surge of radioactive spray. {{c:us-doe-nnsa-nevada-field-office-united-states-nu;naval-history-and-heritage-command-operation-cro}} (The US Navy history office gives the yield as 23 kilotons; this page uses the 21-kiloton figure from the DOE test catalogue. {{c:us-doe-history-program-operation-crossroads-biki}})' },
          { type: 'p', text: 'A nuclear explosion in space behaves differently again. On 9 July 1962 (UTC) the Starfish Prime test detonated a 1.4-megaton warhead about 400 km above Johnston Island in the Pacific. {{c:us-defense-nuclear-agency-operation-dominic-i-19;wikipedia-starfish-prime}} With almost no air to carry a shock wave, the main effect was a powerful electromagnetic pulse — the subject of the [EMP article](/blog/emp-high-altitude-nuclear-burst), which covers a nuclear explosion in space in detail.' },
        ],
      },
      {
        heading: 'How bright the flash is',
        body: [
          { type: 'p', text: 'The flash of a nuclear explosion is briefly brighter than the Sun and, because light travels at the speed of light, {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}} it reaches an observer the instant the fireball forms — long before the sound. At close range the flash can cause temporary flash blindness or permanent retinal burns in anyone looking toward it, which is why it can be seen and felt at far greater distances than the blast damage itself.' },
        ],
      },
      {
        heading: 'What causes a nuclear explosion',
        body: [
          { type: 'p', text: 'A nuclear explosion is powered by one of two nuclear reactions: fission, the splitting of heavy atoms, or fusion, the joining together of light ones. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}} In a fission weapon the energy comes from a self-sustaining chain reaction in uranium or plutonium; {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}} a hydrogen bomb adds a fusion stage. For how the two designs work, see [how nuclear weapons work](/blog/how-nuclear-weapons-work). This page describes only the one-line concept, not any weapon design detail.' },
        ],
      },
      {
        heading: 'Where the energy goes',
        body: [
          { type: 'p', text: 'For a fission weapon exploded in the air, the energy divides into about 50% blast, 35% thermal radiation, 5% initial nuclear radiation and 10% residual radiation. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}} That split is why blast and heat dominate the effects of an air burst, while the residual radiation that becomes fallout is a larger factor for a surface burst.' },
          { type: 'svg', id: 'energy-split', caption: 'How the energy of a fission air burst divides, per Glasstone & Dolan §1.25–1.26. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12}}' },
        ],
      },
    ],
    faq: [
      {
        question: 'What happens in a nuclear explosion?',
        answer: 'A fireball forms in under a millionth of a second and reaches tens of millions of degrees; a flash of light and heat leaves at the speed of light; a shock wave follows through the air, about 12 miles out by 50 seconds; and a mushroom cloud rises to its maximum height over about 10 minutes. The figures are for a 1-megaton air burst.',
        sourceIds: ['us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12'],
      },
      {
        question: 'How hot is a nuclear explosion?',
        answer: 'At the first instant the weapon residues reach several tens of millions of degrees, hotter than the centre of the Sun, according to Glasstone & Dolan. That heat forms the fireball and drives the thermal flash of light and infrared that causes burns and starts fires at a distance.',
        sourceIds: ['us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12'],
      },
      {
        question: 'How fast is a nuclear explosion?',
        answer: 'The flash of light and heat travels at the speed of light, so it arrives essentially instantly. The shock wave is much slower: by 50 seconds after a 1-megaton air burst it is about 12 miles out and moving at roughly 1,150 feet per second, a little faster than the speed of sound at sea level.',
        sourceIds: ['us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12'],
      },
      {
        question: 'How long does a nuclear explosion last?',
        answer: 'The fireball forms in under a millionth of a second and keeps growing for about 10 seconds. The shock wave passes a given point in seconds, initial radiation is emitted over roughly the first minute, and the mushroom cloud takes about 10 minutes to reach its maximum height. Fallout from a surface burst can keep arriving for hours.',
        sourceIds: ['us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12'],
      },
      {
        question: 'What causes a nuclear explosion?',
        answer: 'A nuclear explosion is caused by fission, the splitting of heavy atoms such as uranium or plutonium, or by fusion, the joining of light atoms, sustained by a chain reaction. This releases a large amount of energy in a very small space almost instantly. A hydrogen bomb uses a fission stage to ignite a larger fusion stage.',
        sourceIds: ['us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-12'],
      },
      {
        question: 'Can there be a nuclear explosion underwater or in space?',
        answer: 'Yes. The 1946 Crossroads Baker test detonated a 21-kiloton device 90 feet underwater at Bikini Atoll. In space, the 1962 Starfish Prime test detonated a 1.4-megaton warhead about 400 km above the Pacific; with almost no air to carry a blast wave, its main effect was a powerful electromagnetic pulse.',
        sourceIds: ['us-doe-nnsa-nevada-field-office-united-states-nu', 'us-defense-nuclear-agency-operation-dominic-i-19'],
      },
    ],
  },

  // ── 4. Tsar Bomba ──────────────────────────────────────────────────────
  {
    slug: 'tsar-bomba-largest-test-ever',
    title: 'Tsar Bomba: The Largest Nuclear Test Ever',
    description: 'Tsar Bomba, the 50-megaton Soviet test of 30 October 1961, was the largest nuclear explosion ever. The flash, the mushroom cloud, the bomb, where it was tested and the 100-megaton design behind it, every figure cited.',
    datePublished: '2026-04-29',
    author: 'Marko Visic',
    category: 'history',
    readingMinutes: 8,
    body: [
      {
        body: [
          { type: 'p', text: 'Tsar Bomba was a Soviet hydrogen bomb detonated on 30 October 1961, and at about 50 megatons it remains the largest nuclear explosion ever produced. {{c:the-national-wwii-museum-tsar-bomba-the-largest}} Rosatom, the Russian state nuclear corporation, released declassified test footage of it in August 2020. {{c:bulletin-of-the-atomic-scientists-an-unearthly-s;the-barents-observer-rosatom-releases-previously}} For how it compares with the Hiroshima bomb, see [Tsar Bomba vs Little Boy](/compare/tsar-bomba-vs-little-boy).' },
        ],
      },
      {
        heading: 'The explosion',
        body: [
          { type: 'p', text: 'The flash of the detonation was seen about 1,000 km away. {{c:nuclear-weapon-archive-the-soviet-weapons-progra}} The pressure wave was so strong that it was detected circling the Earth three times. {{c:nuclear-weapon-archive-the-soviet-weapons-progra;atomic-heritage-foundation-national-museum-of-nu}} The fireball was large enough that it reached down to the ground and up to nearly the height from which the bomb had been released. {{c:nuclear-weapon-archive-the-soviet-weapons-progra}} Rosatom\'s declassified footage, released in August 2020, shows the fireball and the rising cloud from several camera positions. {{c:the-barents-observer-rosatom-releases-previously}}' },
        ],
      },
      {
        heading: 'How big the bomb was',
        body: [
          { type: 'p', text: 'The bomb itself was about 8 metres long and 2.1 metres across, and weighed roughly 27 tonnes, with sources giving a range of 24.5 to 27.5 tonnes. {{c:nuclear-weapon-archive-the-soviet-weapons-progra}} It was too big to fit inside the bomb bay, so it was carried partly recessed, with more than half of it protruding, and lowered on a specially developed parachute that slowed its fall and gave the aircraft time to fly clear. {{c:nuclear-weapon-archive-the-soviet-weapons-progra}} By the time the bomb detonated, the aircraft was about 45 km away. {{c:nuclear-weapon-archive-the-soviet-weapons-progra}}' },
        ],
      },
      {
        heading: 'Where and when it was tested',
        body: [
          { type: 'p', text: 'Tsar Bomba was tested at 11:32 Moscow time on 30 October 1961 at the Mityushikha Bay test site on the west coast of Novaya Zemlya, test field D-2 near Cape Sukhoy Nos. {{c:nuclear-weapon-archive-the-soviet-weapons-progra;atomic-heritage-foundation-national-museum-of-nu}} It was carried by a Tu-95V bomber (Carey Sublette designates the aircraft a Tu-95N) flown by Major Andrei Durnovtsev. {{c:atomic-heritage-foundation-national-museum-of-nu;nuclear-weapon-archive-the-soviet-weapons-progra}} The bomb was released from about 10,500 m and burst at about 4,000 m above the test field. {{c:nuclear-weapon-archive-the-soviet-weapons-progra}}' },
        ],
      },
      {
        heading: 'The mushroom cloud',
        body: [
          { type: 'p', text: 'The mushroom cloud rose into the stratosphere. Estimates of its height range from about 64 km (Sublette) to 67 km (the Bulletin of the Atomic Scientists), with the Atomic Heritage Foundation and the National WWII Museum giving about 40 miles. {{c:nuclear-weapon-archive-the-soviet-weapons-progra;bulletin-of-the-atomic-scientists-an-unearthly-s;atomic-heritage-foundation-national-museum-of-nu}} Within about ten minutes the cloud cap had spread roughly 60 miles across. {{c:bulletin-of-the-atomic-scientists-an-unearthly-s}}' },
        ],
      },
      {
        heading: '50 megatons tested against a 100-megaton design',
        body: [
          { type: 'p', text: 'Tsar Bomba was designed for about 100 megatons, {{c:atomic-heritage-foundation-national-museum-of-nu}} but it was tested at roughly half that. For the test the uranium tamper was replaced with lead, which roughly halved the yield and cut the fallout; about 97% of the energy released came from fusion, making it one of the cleanest large explosions relative to its yield. {{c:nuclear-weapon-archive-the-soviet-weapons-progra}} Later US assessments put the yield as high as about 57 megatons. {{c:nuclear-weapon-archive-the-soviet-weapons-progra}} No more powerful weapon has been tested since. You can detonate Tsar Bomba over any city on the [nuclear blast radius calculator](/nuclear-blast-radius?kt=50000) or its [weapon page](/weapons/tsar-bomba).' },
        ],
      },
    ],
    faq: [
      {
        question: 'Where was Tsar Bomba tested?',
        answer: 'Tsar Bomba was tested at the Mityushikha Bay test site on the west coast of Novaya Zemlya, a remote Arctic island, at test field D-2 near Cape Sukhoy Nos. It was dropped from a bomber and burst about 4,000 m above the ground.',
        sourceIds: ['nuclear-weapon-archive-the-soviet-weapons-progra', 'atomic-heritage-foundation-national-museum-of-nu'],
      },
      {
        question: 'How big was Tsar Bomba?',
        answer: 'The bomb was about 8 metres long and 2.1 metres in diameter and weighed roughly 27 tonnes, with published figures ranging from 24.5 to 27.5 tonnes. It was too large to fit inside the aircraft\'s bomb bay and was carried partly protruding, lowered on a parachute.',
        sourceIds: ['nuclear-weapon-archive-the-soviet-weapons-progra'],
      },
      {
        question: 'When was Tsar Bomba tested?',
        answer: 'Tsar Bomba was detonated at 11:32 Moscow time on 30 October 1961. Russia\'s state nuclear corporation, Rosatom, released declassified footage of the test in August 2020, nearly 59 years later.',
        sourceIds: ['atomic-heritage-foundation-national-museum-of-nu', 'the-barents-observer-rosatom-releases-previously'],
      },
      {
        question: 'How much did Tsar Bomba weigh?',
        answer: 'About 27 tonnes, with sources giving a range of 24.5 to 27.5 tonnes. The weight and size meant it could not fit inside the bomb bay of its carrier aircraft, which flew with the weapon partly protruding and the bomb bay doors removed.',
        sourceIds: ['nuclear-weapon-archive-the-soviet-weapons-progra'],
      },
      {
        question: 'How powerful was Tsar Bomba?',
        answer: 'It was tested at about 50 megatons, the largest nuclear explosion ever. It was designed for roughly 100 megatons but tested at half that after a lead tamper replaced the uranium one; later US assessments put the yield as high as about 57 megatons.',
        sourceIds: ['the-national-wwii-museum-tsar-bomba-the-largest', 'atomic-heritage-foundation-national-museum-of-nu', 'nuclear-weapon-archive-the-soviet-weapons-progra'],
      },
      {
        question: 'Did Tsar Bomba leave a crater?',
        answer: 'No. Tsar Bomba was an air burst, detonated about 4,000 m above the ground, so it did not form the kind of crater a surface or underground burst leaves. The fireball was large enough to reach down to the ground, but the bomb never touched the surface.',
        sourceIds: ['nuclear-weapon-archive-the-soviet-weapons-progra'],
      },
      {
        question: 'How high was the Tsar Bomba mushroom cloud?',
        answer: 'Estimates range from about 64 km (Sublette) to 67 km (the Bulletin of the Atomic Scientists), with the Atomic Heritage Foundation and the National WWII Museum giving about 40 miles. The cloud reached well into the stratosphere and spread roughly 60 miles across within ten minutes.',
        sourceIds: ['nuclear-weapon-archive-the-soviet-weapons-progra', 'bulletin-of-the-atomic-scientists-an-unearthly-s', 'atomic-heritage-foundation-national-museum-of-nu'],
      },
    ],
  },

  // ── 5. Hiroshima and Nagasaki ──────────────────────────────────────────
  {
    slug: 'hiroshima-nagasaki-80-years-of-data',
    title: 'How Many People Died in Hiroshima and Nagasaki?',
    description: 'About 140,000 people died in Hiroshima and more than 70,000 in Nagasaki by the end of 1945. The sourced death tolls, the bombings, why the cities were chosen, and the survivors today.',
    datePublished: '2026-04-29',
    author: 'Marko Visic',
    category: 'history',
    readingMinutes: 9,
    body: [
      {
        body: [
          { type: 'p', text: 'About 140,000 people are estimated to have died in Hiroshima by the end of December 1945, give or take 10,000 — the official estimate of the city\'s Peace Memorial Museum. {{c:city-of-hiroshima-q-how-many-people-died-because;hiroshima-peace-memorial-museum-virtual-museum-e-2}} In Nagasaki more than 70,000 died, with a city report putting the end-of-1945 toll at 73,884 killed. {{c:nagasaki-city-1945-8-9-at-11-02-a-m-august-9-194;nagasaki-city-damage-caused-by-atomic-bombing}} The exact numbers will never be known, as both cities say; the figures below are the best-sourced estimates, shown with the definition each one uses.' },
        ],
      },
      {
        heading: 'The death toll in each city',
        body: [
          { type: 'p', text: 'There is no single official death toll, because the deaths were counted in different ways. The most-cited figures are the number of deaths by the end of 1945 and the Radiation Effects Research Foundation\'s estimate of acute deaths within two to four months of the bombings.' },
          {
            type: 'table',
            columns: ['City', 'Deaths by end of 1945', 'Acute deaths within 2–4 months (RERF)'],
            rows: [
              ['Hiroshima', 'About 140,000 (±10,000) {{c:city-of-hiroshima-q-how-many-people-died-because;hiroshima-peace-memorial-museum-virtual-museum-e-2}}', '90,000–166,000 {{c:radiation-effects-research-foundation-frequently}}'],
              ['Nagasaki', '73,884 killed; 74,909 injured {{c:nagasaki-city-damage-caused-by-atomic-bombing}}', '60,000–80,000 {{c:radiation-effects-research-foundation-frequently}}'],
            ],
            caption: 'Hiroshima\'s end-of-1945 figure is the Peace Memorial Museum\'s official estimate; Nagasaki\'s is from a 1950 city report. The RERF ranges count deaths within two to four months of the bombings.',
          },
          { type: 'p', text: 'The US National Park Service describes "eighty thousand killed or grievously wounded instantly" at Hiroshima and "over 100,000 more in the coming months." {{c:us-national-park-service-the-atomic-bombings-of}} Those figures combine deaths and injuries, so they are not a death count and should not be added together. Both cities also keep a register of the names of the dead — 353,639 names at Hiroshima by August 2026 and 202,053 at Nagasaki — but these are cumulative lists of names added on application over 80 years, not a tally of deaths in 1945. {{c:stars-and-stripes-hiroshima-atomic-bomb-annivers;jiji-press-nippon-com-register-of-nagasaki-a-bom;hiroshima-peace-culture-foundation-cenotaph-for}}' },
        ],
      },
      {
        heading: 'When the bombs were dropped',
        body: [
          { type: 'p', text: 'Hiroshima was bombed at 8:15 a.m. on 6 August 1945. The B-29 Superfortress Enola Gay, commanded by Colonel Paul W. Tibbets, Jr., dropped Little Boy, a 15-kiloton gun-type uranium bomb; {{c:city-of-hiroshima-1-the-atomic-bombing-and-the-s;us-national-park-service-the-atomic-bombings-of;smithsonian-national-air-and-space-museum-boeing;us-doe-nnsa-nevada-field-office-united-states-nu}} it exploded 43 seconds later, about 600 m above the city. {{c:city-of-hiroshima-the-realities-of-the-atomic-bo}}' },
          { type: 'p', text: 'Nagasaki was bombed at 11:02 a.m. on 9 August 1945. The B-29 Bockscar, commanded by Major Charles W. Sweeney, dropped Fat Man, a 21-kiloton implosion-type plutonium bomb, {{c:nagasaki-city-1945-8-9-at-11-02-a-m-august-9-194;us-national-park-service-the-atomic-bombings-of;us-doe-nnsa-nevada-field-office-united-states-nu}} which detonated about 503 m above the Urakami district. {{c:radiation-effects-research-foundation-frequently}} Both weapons were air bursts, detonated high above the ground to spread the blast, so neither city received heavy local fallout.' },
        ],
      },
      {
        heading: 'Why the US bombed Hiroshima',
        body: [
          { type: 'p', text: 'The stated justification was to end the war without an invasion of Japan. The Potsdam Declaration of 26 July 1945 warned Japan of "prompt and utter destruction" if it did not surrender. {{c:national-diet-library-potsdam-declaration}} Announcing the bombing on 6 August, President Truman called Hiroshima "an important Japanese Army base," said the Potsdam ultimatum had been issued "to spare the Japanese people from utter destruction," and framed the attack as an answer to Pearl Harbor: "They have been repaid many fold." {{c:truman-library-statement-by-the-president-announ}}' },
          { type: 'p', text: 'Nagasaki was not the intended target on 9 August. The primary target was Kokura; the Bockscar crew turned to the secondary target, Nagasaki, after the primary was obscured. Sources differ on the obscurant — Nagasaki City records smoke, the National Park Service haze, and the US Air Force museum clouds. {{c:nagasaki-city-events-leading-up-to-atomic-bombin;us-national-park-service-the-atomic-bombings-of;national-museum-of-the-us-air-force-the-mission}} This page describes the history in neutral terms and takes no view on whether the bombings were justified.' },
        ],
      },
      {
        heading: 'The survivors',
        body: [
          { type: 'p', text: 'As of the end of March 2026, 91,105 survivors of the bombings were still living, with an average age of 86.66. {{c:japan-ministry-of-health-labour-and-welfare-hiba}} The count is the number of holders of the Atomic Bomb Survivor\'s Health Handbook issued by Japan\'s Ministry of Health, Labour and Welfare; it fell below 100,000 for the first time the previous year. {{c:jiji-press-nippon-com-number-of-hibakusha-drops}} The survivors are known in Japanese as hibakusha. The ministry updates the figure each year in July, so it is rechecked annually.' },
        ],
      },
      {
        heading: 'Are Hiroshima and Nagasaki radioactive today?',
        body: [
          { type: 'p', text: 'No — not at any level that affects health. RERF\'s answer to whether the cities are still radioactive is, in its words, "The practical answer is, \'No.\'": the residual radioactivity is now so small it is hard to distinguish from the trace fallout found worldwide, and most of the neutron-induced activity decayed within a day. {{c:radiation-effects-research-foundation-frequently}} The City of Hiroshima puts present-day radiation "on a par with extremely low background levels," with no effect on the body. {{c:city-of-hiroshima-q-is-there-still-radiation-in}} Both cities were rebuilt and are home to well over a million people between them.' },
        ],
      },
      {
        heading: 'What 80 years of RERF data show',
        body: [
          { type: 'p', text: 'Hiroshima and Nagasaki produced the only large datasets on nuclear-weapon effects in real cities, and 80 years of follow-up has shaped modern radiation safety. The Atomic Bomb Casualty Commission began studying survivors in 1947 and was reorganized as the Radiation Effects Research Foundation in 1975. {{c:radiation-effects-research-foundation-objective}} Its Life Span Study tracks roughly 120,000 people and underpins essentially all modern radiation-protection standards. {{c:radiation-effects-research-foundation-life-span}}' },
          { type: 'p', text: 'The data established the dose-response relationship for radiation-induced cancer: survivors with high doses had clearly elevated rates of leukemia, which rose about two years after exposure and peaked six to eight years later, and of solid cancers, whose excess risk persisted for life. {{c:radiation-effects-research-foundation-leukemia-r}} It also showed that some feared effects did not appear — no detectable increase in genetic abnormalities in survivors\' children. The foundational figure for acute radiation syndrome, the dose that kills about half of those exposed within 60 days, is roughly 2.5 to 5 gray. {{c:us-centers-for-disease-control-and-prevention-ac}}' },
          { type: 'p', text: 'These were the only two nuclear weapons ever used in war, {{c:un-office-for-disarmament-affairs-nuclear-weapon-2}} and both were small by modern standards at 15 and 21 kilotons. {{c:us-doe-nnsa-nevada-field-office-united-states-nu}} No nuclear weapon has been used in war since 9 August 1945. {{c:norwegian-nobel-committee-the-nobel-peace-prize-2}} You can see the blast radii of each bomb on the [Little Boy](/weapons/little-boy) and [Fat Man](/weapons/fat-man) pages.' },
        ],
      },
    ],
    faq: [
      {
        question: 'When was Hiroshima bombed?',
        answer: 'Hiroshima was bombed at 8:15 a.m. local time on 6 August 1945. The B-29 Enola Gay, commanded by Colonel Paul W. Tibbets, Jr., dropped the uranium bomb Little Boy, which exploded about 43 seconds later roughly 600 metres above the city. Nagasaki was bombed three days later, on 9 August.',
        sourceIds: ['city-of-hiroshima-1-the-atomic-bombing-and-the-s', 'city-of-hiroshima-the-realities-of-the-atomic-bo', 'us-national-park-service-the-atomic-bombings-of'],
      },
      {
        question: 'Why did the US bomb Hiroshima?',
        answer: 'The stated aim was to force Japan\'s surrender and avoid an invasion. The Potsdam Declaration of 26 July 1945 had warned of "prompt and utter destruction," and President Truman described Hiroshima as "an important Japanese Army base" when he announced the bombing on 6 August. This page reports the official statements and takes no view on whether the decision was justified.',
        sourceIds: ['national-diet-library-potsdam-declaration', 'truman-library-statement-by-the-president-announ'],
      },
      {
        question: 'How many hibakusha are still alive?',
        answer: 'As of the end of March 2026, 91,105 survivors of the Hiroshima and Nagasaki bombings were still living, with an average age of 86.66, according to Japan\'s Ministry of Health, Labour and Welfare. The figure, which counts holders of the official survivor\'s health handbook, dropped below 100,000 for the first time the year before.',
        sourceIds: ['japan-ministry-of-health-labour-and-welfare-hiba', 'jiji-press-nippon-com-number-of-hibakusha-drops'],
      },
      {
        question: 'How many nuclear weapons have been used in war?',
        answer: 'Two: the bombs dropped on Hiroshima on 6 August 1945 and Nagasaki on 9 August 1945. No nuclear weapon has been used in war in the 80 years since, a point the UN Office for Disarmament Affairs and the Norwegian Nobel Committee both make.',
        sourceIds: ['un-office-for-disarmament-affairs-nuclear-weapon-2', 'norwegian-nobel-committee-the-nobel-peace-prize-2'],
      },
      {
        question: 'Is Hiroshima still radioactive?',
        answer: 'No. RERF\'s answer is that "the practical answer is, \'No.\'" — the residual radioactivity is now so small it is hard to tell from the trace fallout found worldwide, and most of it decayed within a day of the bombing. The City of Hiroshima describes present-day levels as on a par with extremely low background radiation, with no effect on health.',
        sourceIds: ['radiation-effects-research-foundation-frequently', 'city-of-hiroshima-q-is-there-still-radiation-in'],
      },
      {
        question: 'Why was Nagasaki chosen?',
        answer: 'Nagasaki was the secondary target on 9 August 1945. The primary target was Kokura, but the Bockscar crew diverted to Nagasaki after the primary was obscured; sources variously describe smoke, haze or cloud over Kokura. Nagasaki was a port city with shipyards and war industry.',
        sourceIds: ['nagasaki-city-events-leading-up-to-atomic-bombin', 'us-national-park-service-the-atomic-bombings-of'],
      },
      {
        question: 'Is Nagasaki radioactive today?',
        answer: 'No. Like Hiroshima, Nagasaki was struck by an air burst, which produced little local fallout, and the residual radioactivity has long since decayed to background levels. RERF reports that the cities are not radioactive in any way that affects health. Both cities were rebuilt and are home to hundreds of thousands of people.',
        sourceIds: ['radiation-effects-research-foundation-frequently', 'city-of-hiroshima-q-is-there-still-radiation-in'],
      },
    ],
  },

  // ── 7. Nuclear Winter ──────────────────────────────────────────────────
  {
    slug: 'nuclear-winter-regional-war-cooling',
    title: 'Nuclear Winter: How a Regional War Could Cool the Earth',
    description: 'A 1980s climate hypothesis turned out to be more robust than originally thought — and recent modeling shows that even a regional nuclear war could cause global crop failures.',
    datePublished: '2026-04-29',
    author: 'Marko Visic',
    category: 'effects',
    readingMinutes: 8,
    body: [
      {
        body: [
          { type: 'p', text: 'In 1983, Turco, Toon, Ackerman, Pollack and Sagan published "Nuclear Winter: Global Consequences of Multiple Nuclear Explosions" in Science, known as the TTAPS study after their initials. {{c:nasa-technical-reports-server-turco-toon-ackerma}} It argued that even a relatively small nuclear war could trigger global climate cooling so severe that crops would fail worldwide. Its central claim — that soot from burning cities could darken the planet for years — was controversial at the time, but recent modeling has confirmed and in some ways strengthened the original conclusions.' },
        ],
      },
      {
        heading: 'The TTAPS hypothesis',
        body: [
          { type: 'p', text: 'The TTAPS authors observed that nuclear weapons detonated over cities would ignite enormous fires. Modern cities contain large amounts of fuel — wood, plastics, asphalt, vehicle fuel. A single 300-kiloton airburst over a city could start a mass fire covering roughly 100 to 170 square kilometers within tens of minutes. {{c:national-security-archive-george-washington-univ}} The resulting plume of soot, lofted by the heat into the upper troposphere, would drift on winds and could be transported globally by stratospheric circulation.' },
          { type: 'p', text: 'The 1983 TTAPS paper estimated that a nuclear war would likely exceed 5,000 megatons and that as little as 100 megatons could plunge the Northern Hemisphere summer into subfreezing temperatures lasting months. {{c:nasa-technical-reports-server-turco-toon-ackerma}} Soot would remain in the stratosphere for years, because at those altitudes there is no rain to wash it out. Crops would fail across most of the Northern Hemisphere.' },
        ],
      },
      {
        heading: 'Critique and refinement',
        body: [
          { type: 'p', text: 'The TTAPS paper drew immediate criticism. Defense-aligned analysts argued that the soot loading was overestimated, that smoke would not reach the stratosphere, that smoke would rain out faster than predicted, and that warming caused by reduced cloud cover might compensate. By the late 1980s, a more cautious "nuclear autumn" framing had partly displaced the original "nuclear winter" claim.' },
          { type: 'p', text: 'Subsequent modeling — particularly the work of Alan Robock and Owen Brian Toon and collaborators in the 2000s and 2010s — addressed these critiques using modern coupled climate models. {{c:atmospheric-chemistry-and-physics-robock-et-al-2}} The results were closer to TTAPS than to the more cautious revisions: soot from city firestorms does reach the stratosphere, does persist for years, and does cause significant cooling. The original hypothesis has held up remarkably well.' },
        ],
      },
      {
        heading: 'The mechanism, in more detail',
        body: [
          { type: 'p', text: 'The mechanism is straightforward but not intuitive. A nuclear weapon detonated over a city ignites multiple fires that merge into a firestorm — a self-sustaining fire so intense it generates its own weather. A firestorm can carry smoke into the upper troposphere, roughly 9-14 km up, where sunlight heats it and lifts it into the stratosphere. {{c:atmospheric-chemistry-and-physics-robock-oman-st}}' },
          { type: 'p', text: 'In the stratosphere, soot absorbs sunlight and re-radiates it as heat. This warms the stratosphere and cools the surface — the opposite of greenhouse gases, which cool the stratosphere and warm the surface. The cooler surface produces less convection, weaker monsoons, and shorter growing seasons. The stratospheric soot is removed only by gradual gravitational settling (months to years) since stratospheric circulation does not include rain.' },
          { type: 'p', text: 'The total effect depends on how much soot reaches the stratosphere. Modeling by Robock and colleagues (2007) found that fires from 100 Hiroshima-size weapons could inject about 5 million tonnes of soot and cool the global average surface by about 1.25 °C for several years. {{c:atmospheric-chemistry-and-physics-robock-oman-st}}' },
        ],
      },
      {
        heading: 'Even a regional war causes global cooling',
        body: [
          { type: 'p', text: 'The most striking result of recent modeling is that even a regional nuclear war — say, between India and Pakistan — could cause significant global climate disruption. A 2007 study by Robock, Toon and colleagues modeled a regional war using 100 Hiroshima-size (15 kt) weapons. About 5 million tonnes of soot rose into the stratosphere, cooling the global average surface by 1.25 °C for several years, with 0.5 °C of cooling left after a decade. {{c:atmospheric-chemistry-and-physics-robock-oman-st}}' },
          { type: 'p', text: 'A 2014 follow-up by Mills, Toon, Lee-Taylor and Robock in Earth\'s Future found global ozone losses of 20-50% over populated areas, growing seasons shortened by 10-40 days a year for five years, and surface cooling lasting more than 25 years. {{c:earth-s-future-mills-toon-lee-taylor-robock-2014}} The conclusion is that a "regional" nuclear war is not really regional — its climate effects affect the entire planet.' },
        ],
      },
      {
        heading: 'Crop failure and famine',
        body: [
          { type: 'p', text: 'Research by Jägermeyr, Robock, Xia and colleagues found that a regional India-Pakistan war could cut global maize, wheat and soybean production by 13%, 11% and 17% over five years, sufficient to trigger food shortages, price spikes, and famine in regions that depend on food imports. A 2022 study led by Xia found a full US-Russia war could cut global calorie production by about 90% — and the resulting global famine would likely kill more people than the bombs themselves. {{c:nasa-goddard-institute-for-space-studies-publica}}' },
          { type: 'p', text: 'The 2022 paper by Xia et al. in Nature Food estimated that a US-Russia nuclear war scenario could lead to over 5 billion deaths from famine in the years following the exchange — far more than the few hundred million who would die from the immediate effects of the bombs. {{c:rutgers-university-nuclear-war-would-cause-a-glo}}' },
        ],
      },
      {
        heading: 'Why the implications matter',
        body: [
          { type: 'p', text: 'Nuclear winter changes the strategic calculus of nuclear weapons in important ways. A "limited" nuclear exchange may not be limited in its consequences. A nuclear war between two countries on the other side of the world could cause harvest failures in countries that have nothing to do with the conflict. The traditional concept of nuclear sovereignty — that a nuclear-armed state\'s decisions are its own — breaks down when the climate effects are global.' },
          { type: 'p', text: 'The simulator does not model nuclear-winter effects directly. Its calculations are limited to the immediate physical effects of single detonations. But for context: the global consequences of even a regional nuclear war would, on current modeling, dwarf the local effects shown in any individual scenario page on this site. See the resources page for nuclear-disarmament organizations and the sources page for primary references.' },
        ],
      },
    ],
  },

  // ── 8. EMP ─────────────────────────────────────────────────────────────
  {
    slug: 'emp-high-altitude-nuclear-burst',
    title: 'EMP: How a High-Altitude Nuclear Burst Could Disable a Continent',
    description: 'A single nuclear burst about 200 miles (320 km) above the central United States could expose almost the entire country, plus parts of Canada and Mexico, to EMP. Here is how the effect works and how seriously experts take the threat.',
    datePublished: '2026-04-29',
    author: 'Marko Visic',
    category: 'effects',
    readingMinutes: 7,
    body: [
      {
        body: [
          { type: 'p', text: 'On July 9, 1962, the United States detonated a 1.4-megaton thermonuclear device 400 km above Johnston Island in the Pacific. The test, codenamed Starfish Prime, was meant to study high-altitude nuclear effects on radar and missile-defense systems. {{c:wikipedia-starfish-prime}} What it actually demonstrated was an unexpectedly powerful electromagnetic pulse. Street lights failed on Oahu, about 1,300 km away, hundreds of burglar alarms rang in Honolulu and circuit breakers on power lines opened. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-4}} The discovery led to a decades-long study of the high-altitude electromagnetic pulse — HEMP — and to the realization that a single nuclear weapon, well-placed, could disable entire continents.' },
        ],
      },
      {
        heading: 'How a nuclear bomb generates EMP',
        body: [
          { type: 'p', text: 'A nuclear detonation releases about 0.3% of its energy as prompt gamma rays — high-energy photons that can penetrate matter. At ground level, gamma rays are absorbed within meters of the detonation, contributing to the prompt radiation pulse. But at high altitude (above 30 km, where the air is thin), the gammas can travel hundreds of kilometers before they interact with anything. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-4}}' },
          { type: 'p', text: 'When a gamma ray strikes an air molecule, it knocks an electron loose at relativistic speed (the Compton effect). The accelerated electron is then deflected by the Earth\'s magnetic field, producing a brief but intense electromagnetic pulse. Because the gammas spread over a large area before they interact, the pulse covers an enormous footprint — the line-of-sight area from the burst altitude.' },
          { type: 'p', text: 'A burst at 400 km altitude has a line-of-sight footprint of roughly 2,200 km radius, enough to cover almost all of the continental United States. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-4}}' },
        ],
      },
      {
        heading: 'E1, E2, and E3 components',
        body: [
          { type: 'p', text: 'The HEMP signal has three temporally distinct components, each with different damage characteristics. E1 is the prompt pulse: a sub-microsecond spike of intense electromagnetic energy. It is fast enough to defeat most surge protectors and induces voltages high enough to destroy semiconductors directly. Modern electronics — phones, computers, vehicle ignitions — are particularly vulnerable.' },
          { type: 'p', text: 'E2 is an intermediate-time pulse, similar to lightning, lasting from about one microsecond to one second after the burst. {{c:wikipedia-nuclear-electromagnetic-pulse}} It is generated by neutrons interacting with the atmosphere. E2 is well within the range that lightning protection can handle, so it is generally not the threat component.' },
          { type: 'p', text: 'E3 is a much slower pulse, lasting tens to hundreds of seconds, caused by the bomb\'s expanding fireball distorting the geomagnetic field. {{c:wikipedia-nuclear-electromagnetic-pulse}} E3 is dangerous to long-distance power lines and transformers, where it can induce ground-induced currents (GIC) similar to those produced by severe geomagnetic storms. E3 is the component most likely to trigger continent-wide power-grid failures.' },
        ],
      },
      {
        heading: 'What gets damaged',
        body: [
          { type: 'p', text: 'Modern unhardened electronics are extremely vulnerable to E1. Computer chips, phones, electronic ignitions, controllers in industrial systems, and the supervisory hardware of power-grid substations can all be damaged or destroyed. Long cables and power lines collect far more E1 energy than short ones, though even short cables can carry some of the pulse into equipment. {{c:us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-4}}' },
          { type: 'p', text: 'The power grid is the most concerning vulnerability. Long transmission lines pick up substantial E3 currents. Large transformers that step voltage up and down at substations can be damaged when ground-induced currents drive them into magnetic saturation. EMP damage to grid protection systems could extend to large power transformers. {{c:us-house-committee-on-armed-services-via-gpo-gov}}' },
          { type: 'p', text: 'Critical infrastructure — water treatment, hospital systems, emergency services, financial transactions — all depend on electric power. A continent-wide grid outage caused by HEMP could last weeks to months and cause cascading failures across the economy.' },
        ],
      },
      {
        heading: 'How seriously experts take the threat',
        body: [
          { type: 'p', text: 'Assessments of HEMP threat have ranged widely. Presenting the EMP Commission\'s 2008 findings to Congress, its chairman called EMP "one of a small number of threats that can hold our society at risk of catastrophic consequences." {{c:us-house-committee-on-armed-services-via-gpo-gov}} Critics have argued that the report overstates vulnerabilities and understates the difficulty of executing an attack.' },
          { type: 'p', text: 'The technical consensus is somewhere in between: HEMP is a real and serious threat, particularly to the power grid, but the damage is highly dependent on the specifics of the burst (yield, altitude, latitude relative to magnetic field, atmospheric conditions). And executing a HEMP attack requires either a delivery vehicle capable of reaching high altitude over the target — which only nuclear-armed states with ICBMs currently have — or a ship-launched short-range missile lofted from offshore.' },
        ],
      },
      {
        heading: 'Hardening',
        body: [
          { type: 'p', text: 'EMP hardening — designing electronics to survive HEMP — is well understood but expensive. Military systems (strategic bombers, missile silos, command-and-control nodes) are routinely hardened. Civilian infrastructure is mostly not.' },
          { type: 'p', text: 'FERC Order No. 830 (2016), which approved a standard requiring grid planners to assess their vulnerability to geomagnetic disturbances every five years, was a small step in this direction. {{c:federal-energy-regulatory-commission-federal-reg}} But comprehensive hardening would require sustained policy attention and funding that has so far not materialized.' },
        ],
      },
      {
        heading: 'EMP in modern threat assessments',
        body: [
          { type: 'p', text: 'HEMP appears in modern threat assessments primarily in the context of North Korean and Russian capabilities. North Korea\'s Hwasong-14 ICBM, first flight-tested in July 2017, showed a potential range of more than 10,000 km. {{c:bulletin-of-the-atomic-scientists-north-korean-n}} Russia and China both possess clear HEMP-capable delivery systems.' },
          { type: 'p', text: 'The simulator does not model HEMP effects directly — its scenarios show ground-level blast and thermal effects, which are the dominant kill mechanisms for surface and low-altitude air bursts. HEMP is a different attack profile entirely, optimized to disable infrastructure rather than to destroy targets. See the glossary entry on EMP for a definition, and the sources page for primary references.' },
        ],
      },
    ],
  },
]

export function findArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

export function categoryLabel(c: Article['category']): string {
  switch (c) {
    case 'physics': return 'Physics'
    case 'history': return 'History'
    case 'doctrine': return 'Doctrine'
    case 'effects': return 'Effects'
  }
}
