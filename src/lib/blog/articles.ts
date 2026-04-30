import type { Article } from './types'

// Editorial articles. Authored for general educated audiences. Every claim
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
    author: 'NukeBlastSimulator Editorial',
    category: 'physics',
    readingMinutes: 9,
    body: [
      {
        body: [
          { type: 'p', text: 'Every nuclear weapon ever built falls into one of two categories: pure-fission "atomic" bombs that split heavy atoms, and "hydrogen" bombs that use a small fission stage to ignite a much larger fusion stage. The two designs differ by orders of magnitude in yield — the Hiroshima bomb released about 15 kilotons of energy, while the largest hydrogen bomb ever tested released 50 million tons. The mechanism behind that 3,300× scaling is the subject of this guide.' },
        ],
      },
      {
        heading: 'What "splitting an atom" actually means',
        body: [
          { type: 'p', text: 'A nuclear fission weapon releases energy by splitting heavy nuclei — typically uranium-235 or plutonium-239 — into lighter fragments. When a neutron strikes a U-235 nucleus, the nucleus splits, releasing roughly 200 MeV of energy and two or three new neutrons. Each new neutron can split another nucleus, producing more neutrons, in a self-sustaining chain reaction.' },
          { type: 'p', text: 'For the chain reaction to release usable energy, the fissile material must be assembled into a "supercritical mass" — enough material in a compact enough geometry that more neutrons trigger fissions than escape. Below this threshold (the critical mass) the reaction dies out; above it, the reaction multiplies exponentially in microseconds, releasing all of the bomb\'s energy before it physically blows itself apart.' },
          { type: 'p', text: 'The trick of an atomic bomb is to assemble a supercritical mass of fissile material extremely quickly — too quickly for the early energy release to disassemble the bomb before most of the material has fissioned.' },
        ],
      },
      {
        heading: 'Little Boy: gun-type uranium',
        body: [
          { type: 'p', text: 'The Hiroshima bomb (Little Boy) used the simplest possible design: a "gun-type" device that fired one subcritical mass of uranium-235 down a barrel into another subcritical mass. When the two pieces collided, they formed a single supercritical mass and the chain reaction began.' },
          { type: 'p', text: 'Gun-type assembly is slow but works for U-235, which has a low spontaneous-fission rate. Little Boy used roughly 64 kg of highly enriched uranium and yielded about 15 kilotons. The weapon was so confidently expected to work that it was never tested before being dropped.' },
          { type: 'p', text: 'Gun-type cannot work for plutonium-239 because Pu-239 contains trace Pu-240 that spontaneously fissions, causing premature ignition (a "fizzle") before the masses fully assemble. A different approach was needed for plutonium.' },
        ],
      },
      {
        heading: 'Fat Man: implosion plutonium',
        body: [
          { type: 'p', text: 'The Nagasaki bomb (Fat Man) used implosion: a hollow plutonium sphere surrounded by precisely shaped explosive lenses that, when detonated simultaneously, compress the plutonium inward at supersonic speeds. The compression dramatically increases density, pushing the plutonium past critical mass before predetonation can occur.' },
          { type: 'p', text: 'Implosion is much harder to engineer than gun-type — the explosive lenses must fire within microseconds of each other, and the shock wave must remain spherically symmetric. The Trinity test on July 16, 1945 was a proof-of-concept for the implosion design before Fat Man was used over Nagasaki on August 9. Fat Man yielded about 21 kilotons from roughly 6 kg of plutonium.' },
          { type: 'p', text: 'Implosion remains the standard fission-primary design in modern thermonuclear weapons, where the high yield-per-mass efficiency of plutonium matters.' },
        ],
      },
      {
        heading: 'The leap to hydrogen bombs',
        body: [
          { type: 'p', text: 'Pure-fission weapons cap out at roughly 500 kilotons because of geometry: as the fissile core fissions and heats up, it disassembles before all of the material has reacted. To go higher, you need a fundamentally different energy mechanism. Nuclear fusion — combining light nuclei — releases far more energy per unit mass than fission, but requires temperatures of roughly 100 million degrees to ignite.' },
          { type: 'p', text: 'A hydrogen bomb uses a small fission "primary" as a match to ignite a much larger fusion "secondary." The primary detonates first; its X-ray flux is channeled to the secondary, where it compresses and heats fusion fuel (typically lithium-deuteride) to fusion-ignition conditions. The secondary then releases its energy as fusion neutrons, with a third stage of fission in the surrounding U-238 jacket.' },
        ],
      },
      {
        heading: 'The Teller-Ulam design',
        body: [
          { type: 'p', text: 'The breakthrough that made hydrogen bombs practical was the two-stage radiation-implosion configuration, designed by Stanislaw Ulam and Edward Teller in 1951. In the Teller-Ulam design, the fission primary and fusion secondary sit in a hohlraum (radiation cavity) inside the bomb case. X-rays from the primary travel through the cavity at the speed of light and ablate the outer surface of the secondary, driving it inward by reaction force.' },
          { type: 'p', text: 'This radiation implosion compresses the secondary far more uniformly and powerfully than ordinary explosives could, raising it to fusion-ignition temperature. The first test of the design was Ivy Mike in November 1952 — a 10.4 megaton detonation that vaporized the entire test island. Every operational thermonuclear weapon since uses some variant of the Teller-Ulam configuration.' },
        ],
      },
      {
        heading: 'Boosted fission and modern weapons',
        body: [
          { type: 'p', text: 'Most modern fission primaries are also "boosted": a small amount of deuterium-tritium gas is injected into the plutonium core. When the primary detonates, the D-T undergoes fusion, releasing a flood of high-energy neutrons that drive a much higher fraction of the plutonium to fission. Boosting can multiply the primary\'s yield by 5× or more.' },
          { type: 'p', text: 'The result of these design improvements is that modern strategic warheads are remarkably compact. The W88, deployed on US Trident II SLBMs, packs a 475-kiloton yield into a warhead small enough to fit eight per missile. The B83, the most powerful US weapon currently in active service, yields up to 1.2 megatons.' },
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
    author: 'NukeBlastSimulator Editorial',
    category: 'physics',
    readingMinutes: 8,
    body: [
      {
        body: [
          { type: 'p', text: 'Nuclear weapons are described by a single number — yield, in kilotons or megatons of TNT equivalent. But yield does not translate directly into damage radius. A weapon ten times more powerful than another is only roughly 2.15 times as wide in its blast effects. This counterintuitive scaling shapes everything from arsenal design to targeting strategy.' },
        ],
      },
      {
        heading: 'What "yield" actually measures',
        body: [
          { type: 'p', text: 'Nuclear yield is the total energy released by a weapon, expressed in TNT equivalent: 1 kiloton equals 1,000 tons of TNT, or 4.184 × 10¹² joules. The Hiroshima bomb released 15 kilotons; Tsar Bomba released 50,000 kilotons; modern strategic warheads typically release 100–500 kilotons.' },
          { type: 'p', text: 'But that energy is distributed across multiple effects: roughly 50% goes into blast (the air shock wave), 35% into thermal radiation (the flash of heat and light), 5% into prompt nuclear radiation, and 10% into delayed radiation in fallout. The exact split depends on burst altitude and weapon design.' },
        ],
      },
      {
        heading: 'The cube-root scaling law',
        body: [
          { type: 'p', text: 'Blast overpressure radius scales with the cube root of yield. The reason is geometric: the energy released expands roughly as a sphere, so the volume scales linearly with energy and the radius scales as the cube root of the volume. Specifically, the radius for a given overpressure (5 PSI, 1 PSI, etc.) grows as yield to the one-third power.' },
          { type: 'p', text: 'In practice, this means a 100-kiloton weapon has a 5 PSI radius of about 4.8 km. A 1-megaton weapon (10× more energy) has a 5 PSI radius of about 10.3 km — only 2.15× larger. To double the blast radius, you need to multiply yield by a factor of 8.' },
        ],
      },
      {
        heading: 'Thermal radiation scales differently',
        body: [
          { type: 'p', text: 'Thermal radiation radius scales as yield to the 0.41 power — slightly faster than blast. This is because thermal energy is delivered as a brief flash that radiates more efficiently to longer distances. For very large weapons, the thermal radius can exceed the blast radius. Tsar Bomba is famous for breaking windows 900 km away through its thermal pulse.' },
          { type: 'p', text: 'For most modern strategic weapons (100 kt to 1 Mt), thermal and blast radii are comparable. The differences become noticeable only for very small (sub-kiloton) or very large (multi-megaton) weapons.' },
        ],
      },
      {
        heading: 'Air burst vs surface burst',
        body: [
          { type: 'p', text: 'The same weapon produces different effects depending on detonation altitude. An air burst — detonated above the ground at the optimal altitude — maximizes the area affected by blast and thermal radiation, because the shock wave reflects off the ground and reinforces the direct wave (the "Mach stem" effect). Air bursts produce minimal fallout because the fireball does not touch the ground.' },
          { type: 'p', text: 'A surface burst — detonated at ground level — produces roughly 40-50% smaller blast radius, because much of the bomb\'s energy goes into cratering and ground shock. But the fireball touches the ground and vaporizes soil, lofting it into the upper atmosphere as radioactive fallout. Surface bursts produce massive lethal fallout plumes that can extend hundreds of kilometers downwind.' },
          { type: 'p', text: 'Hiroshima and Nagasaki were both air bursts, optimized for area destruction at the cost of fallout. Surface bursts are typically reserved for hardened targets — missile silos, command bunkers, deep-buried command-and-control nodes.' },
        ],
      },
      {
        heading: 'Why arsenals shrunk in yield',
        body: [
          { type: 'p', text: 'Cold-War arsenals featured single warheads in the multi-megaton range — the W53 warhead on the Titan II missile yielded 9 megatons. Modern arsenals have moved to lower yields (100-500 kt) for two reasons. First, MIRVing — putting multiple warheads on one missile — works better with smaller, lighter warheads. A Trident II can carry 8 W88 (475 kt each) instead of one giant warhead.' },
          { type: 'p', text: 'Second, accuracy improved dramatically. Early ICBMs could land within a kilometer or two of target; modern ICBMs land within 100 meters. With high accuracy, a smaller warhead does the same damage to the target while reducing collateral effects. The cube-root scaling means that the blast radius of a 475 kt warhead is "only" about 6.4 km for the 5 PSI zone — but that is more than enough to destroy any city center if the missile lands accurately.' },
        ],
      },
      {
        heading: 'How the simulator uses these formulas',
        body: [
          { type: 'p', text: 'The Nuclear Blast Simulator uses scaling-law formulas published by Glasstone & Dolan in The Effects of Nuclear Weapons (3rd edition, 1977). The fireball radius is computed as approximately 0.28 × yield_kt^0.33; the 5 PSI moderate blast radius is 1.03 × yield_kt^0.33; the 3rd-degree thermal-burn radius is 0.67 × yield_kt^0.41. See the full methodology page for all formulas.' },
          { type: 'p', text: 'These formulas are calibrated against decades of nuclear test data. They idealize conditions — flat terrain, clear weather, no buildings — but provide a useful first-order picture of nuclear effects. Real-world casualties depend strongly on time of day, sheltering, building construction, and weather. The simulator\'s number should be interpreted as an order-of-magnitude estimate, not a precise prediction.' },
        ],
      },
    ],
  },

  // ── 3. The Four Kill Mechanisms ────────────────────────────────────────
  {
    slug: 'four-kill-mechanisms',
    title: 'The Four Kill Mechanisms: Fireball, Blast, Thermal, Fallout',
    description: 'Nuclear weapons kill through four distinct mechanisms, each with different ranges, timings, and survival windows. Here is what each mechanism does and how to think about them in combination.',
    datePublished: '2026-04-29',
    author: 'NukeBlastSimulator Editorial',
    category: 'effects',
    readingMinutes: 8,
    body: [
      {
        body: [
          { type: 'p', text: 'A nuclear detonation kills people through four distinct physical mechanisms: the fireball, the blast wave, thermal radiation, and radioactive fallout. They have different ranges, different timings, and different survival probabilities. Understanding the four mechanisms separately is the foundation of how the simulator computes effects — and of how civil-defense planning has historically been organized.' },
        ],
      },
      {
        heading: 'The fireball',
        body: [
          { type: 'p', text: 'The fireball is the sphere of plasma created in the first microseconds of detonation. Inside the fireball, temperatures exceed 10 million degrees Celsius — hotter than the surface of the Sun. Everything within the fireball radius is vaporized: humans, buildings, soil. There are no survivors.' },
          { type: 'p', text: 'Fireball radius scales with yield to the 0.4 power. For a 15 kt Hiroshima-class weapon, the fireball is about 0.18 km in radius. For a 1 Mt strategic warhead, it is about 0.74 km. For Tsar Bomba (50 Mt), it was nearly 4 km wide — fireball-large enough to be visible from 1,000 km away.' },
        ],
      },
      {
        heading: 'The blast wave (overpressure)',
        body: [
          { type: 'p', text: 'A nanosecond after detonation, the rapidly expanding fireball drives a shock wave outward through the surrounding air at supersonic speeds. The shock wave is felt as overpressure — an instantaneous spike in air pressure above atmospheric, measured in pounds per square inch (PSI). Overpressure damages structures and kills people through wind effects, building collapse, and direct lung injury.' },
          { type: 'p', text: 'Damage is conventionally categorized by overpressure level. The 20 PSI zone destroys reinforced concrete buildings; the 5 PSI zone collapses most residential structures; the 1 PSI zone shatters windows and causes light injuries from flying glass. A 100 kt weapon produces a 5 PSI radius of about 4.8 km in an air burst — enough to flatten a city center.' },
          { type: 'p', text: 'The blast wave arrives a few seconds after detonation at typical urban ranges — roughly 5 seconds for the 5 PSI shock at 5 km. People who hear or feel the blast have already been exposed to thermal radiation, which travels at the speed of light and arrives instantly.' },
        ],
      },
      {
        heading: 'Thermal radiation',
        body: [
          { type: 'p', text: 'About 35% of a nuclear weapon\'s energy is released as a brief, intense flash of light and infrared radiation lasting a few seconds. At close range this thermal pulse causes fatal burns through clothing; at longer range it causes 3rd-degree burns to exposed skin; at much longer range it can ignite paper, fabric, and wood, starting fires that may merge into a city-wide firestorm.' },
          { type: 'p', text: 'Thermal radiation propagates faster than blast — it scales with yield to the 0.41 power instead of 0.33. For a 1 Mt warhead, the 3rd-degree burn radius is about 13 km; the 2nd-degree burn radius is about 17 km. People looking at the flash within these distances can suffer flash blindness or permanent retinal damage.' },
          { type: 'p', text: 'The Hiroshima firestorm killed tens of thousands of people who survived the initial blast — burned alive in collapsed wooden buildings as fires spread. Modern construction (steel and concrete) reduces firestorm risk, but does not eliminate it.' },
        ],
      },
      {
        heading: 'Fallout',
        body: [
          { type: 'p', text: 'Surface bursts vaporize soil along with everything else in the fireball. The vaporized soil is irradiated by the bomb\'s neutron flux, becoming radioactive. As the fireball cools and rises, this radioactive debris condenses into particles and is lofted to the upper atmosphere, where it drifts downwind and falls back to earth as fallout — anywhere from minutes to weeks after the detonation.' },
          { type: 'p', text: 'Fallout intensity depends strongly on whether the weapon is detonated at the surface or in the air. Air bursts produce essentially no local fallout because the fireball never touches the ground. Surface bursts produce massive fallout plumes — for a 1 Mt surface burst, the lethal fallout zone can extend 200-400 km downwind, depending on wind speed.' },
          { type: 'p', text: 'Fallout dose rates decay rapidly: at one hour after detonation, dose rates may be 1,000 times higher than at one day, and 10,000 times higher than at one week. People who can shelter for the first 48 hours after fallout arrives can avoid most of the lethal dose. The "rule of seven" — a 7-fold increase in time means a 10-fold decrease in dose rate — captures this decay roughly.' },
        ],
      },
      {
        heading: 'Timing and overlap',
        body: [
          { type: 'p', text: 'The four mechanisms arrive in a predictable sequence. At time zero: the prompt nuclear radiation pulse (gamma rays and neutrons) and the thermal flash arrive together at the speed of light. Within a few seconds: the fireball reaches its maximum extent. Within 5-30 seconds: the blast wave arrives at urban ranges. Within minutes to hours: fallout begins to deposit downwind of surface bursts.' },
          { type: 'p', text: 'Survival depends on which mechanisms reach you. Within the fireball: nothing survives. Inside the 20 PSI radius: 98% of unsheltered people die from blast. Inside the 5 PSI radius: 50% die. Inside the 3rd-degree burn radius (often outside the 5 PSI radius): 95% of unsheltered people die from burns.' },
          { type: 'p', text: 'Beyond all of these, survival comes down to fallout. Air bursts mean negligible fallout: the people who survive blast and thermal effects largely survive long-term. Surface bursts mean potentially lethal fallout out to hundreds of kilometers — and surviving the immediate detonation is no guarantee of surviving the radioactive plume that arrives hours later.' },
        ],
      },
      {
        heading: 'Why the simulator visualizes them as concentric circles',
        body: [
          { type: 'p', text: 'The familiar "rings" view of a nuclear blast — fireball, severe blast, moderate blast, light blast, thermal — is an idealization but a useful one. It captures the dominant kill mechanism at each range. Inside the fireball, vaporization. Just outside, severe blast. A bit further, thermal burns dominate. Further still, moderate blast. Out at the edge, glass injuries.' },
          { type: 'p', text: 'In practice the boundaries blur — a building might collapse from blast and then burn from thermal ignition, or a person might survive blast but die later from acute radiation. But the concentric-ring simplification is good enough to give a clear picture of total casualties, which is what the simulator computes. See the methodology page for the underlying formulas.' },
        ],
      },
    ],
  },

  // ── 4. Tsar Bomba ──────────────────────────────────────────────────────
  {
    slug: 'tsar-bomba-largest-test-ever',
    title: 'Tsar Bomba: Inside the Largest Nuclear Test Ever',
    description: 'On October 30, 1961, the Soviet Union detonated a 50-megaton hydrogen bomb over the Arctic — a weapon so powerful it broke windows 900 km away and circled the Earth\'s atmosphere three times.',
    datePublished: '2026-04-29',
    author: 'NukeBlastSimulator Editorial',
    category: 'history',
    readingMinutes: 8,
    body: [
      {
        body: [
          { type: 'p', text: 'On October 30, 1961, a Soviet Tu-95V bomber dropped a single 27-ton bomb over Novaya Zemlya, a remote Arctic island. The detonation released approximately 50 megatons of TNT equivalent — more than 3,300 times the yield of the Hiroshima bomb and more than ten times the combined yield of all explosives used in World War II. To this day no weapon has been detonated bigger.' },
        ],
      },
      {
        heading: 'The 100-megaton design',
        body: [
          { type: 'p', text: 'Tsar Bomba was originally designed to yield 100 megatons. The bomb was a three-stage thermonuclear device with a fission primary, a lithium-deuteride fusion secondary, and a uranium-238 tertiary jacket that would have undergone fast fission from the secondary\'s neutron flux.' },
          { type: 'p', text: 'For the test, the U-238 jacket was replaced with lead. This roughly halved the yield — the U-238 fast-fission stage would have been responsible for about half the original 100 Mt yield — but it also reduced fallout by approximately 97%. Khrushchev personally ordered the substitution: a clean 50 Mt test was politically more useful than a dirty 100 Mt test.' },
          { type: 'p', text: 'Even at 50 Mt, the test was the cleanest in history relative to its yield, with about 97% of the energy coming from fusion rather than fission.' },
        ],
      },
      {
        heading: 'Delivery and detonation',
        body: [
          { type: 'p', text: 'The bomb was so heavy (27 tons) that the modified Tu-95V bomber could not close its bomb-bay doors with the weapon loaded. To survive the detonation, the bomb was suspended from a giant parachute that slowed its descent and gave the Tu-95V time to fly to a safe distance. Even so, the crew\'s estimated probability of survival was given as only 50%.' },
          { type: 'p', text: 'At 11:32 a.m. Moscow time, the bomb detonated at an altitude of about 4,000 m above the test site at Sukhoy Nos on Novaya Zemlya. The yield was later assessed at 50 to 58 megatons, depending on source — the largest nuclear explosion ever produced by humans.' },
        ],
      },
      {
        heading: 'The fireball and mushroom cloud',
        body: [
          { type: 'p', text: 'The fireball reached approximately 8 km in diameter — large enough that its lower edge nearly touched the ground despite the high-altitude burst, and its upper edge reached roughly the altitude of a commercial airliner. The fireball was visible at a distance of more than 1,000 km, and observers in Norway and Finland (north of the test site) reported a brilliant flash of light.' },
          { type: 'p', text: 'The mushroom cloud rose to about 67 km altitude — well into the stratosphere and seven times the height of Mount Everest. The cloud cap reached 95 km in diameter. The Tu-95V crew, who had flown about 50 km from ground zero by detonation time, were briefly knocked out of formation by the shock wave but survived.' },
        ],
      },
      {
        heading: 'Effects at distance',
        body: [
          { type: 'p', text: 'The blast wave from Tsar Bomba was detected three times as it circled the planet. At Dikson, a Soviet weather station 800 km from ground zero, all wooden buildings were destroyed and stone buildings were damaged. At Severny, an island 400 km away, the windows of every building were shattered.' },
          { type: 'p', text: 'On the island of Novaya Zemlya itself, all buildings within 55 km of ground zero were leveled. Wooden houses collapsed, telephone poles snapped, and seismographs as far as 1,000 km away registered the blast as a magnitude 5 earthquake.' },
          { type: 'p', text: 'The thermal pulse from Tsar Bomba was strong enough to cause 3rd-degree burns on exposed skin out to 100 km, and to start fires up to 35 km away.' },
        ],
      },
      {
        heading: 'Why no one tested anything bigger',
        body: [
          { type: 'p', text: 'After Tsar Bomba, no state ever designed or tested a more powerful weapon. The reasons are practical, not political. First, a 100-megaton weapon offers diminishing returns: because blast radius scales with the cube root of yield, doubling the yield from 50 Mt to 100 Mt only multiplies blast radius by about 1.26. The marginal additional damage is not worth the cost.' },
          { type: 'p', text: 'Second, the size and weight of multi-megaton bombs make them impractical to deliver. Tsar Bomba required a specially modified bomber and a parachute system; an ICBM cannot carry such a payload at intercontinental range.' },
          { type: 'p', text: 'Third, by the early 1970s the move was firmly toward lower-yield, higher-accuracy MIRVed warheads. A Trident II SLBM carrying eight 475-kiloton W88 warheads delivers more total destruction than a single 50-megaton weapon — at any chosen set of targets.' },
        ],
      },
      {
        heading: 'Tsar Bomba in modern arsenals',
        body: [
          { type: 'p', text: 'Tsar Bomba was a one-off test article. The Soviet Union never deployed a weapon of comparable yield. Modern Russian strategic warheads (the RS-28 Sarmat, for example) carry warheads of typically 750 kt to a few megatons, comparable to US strategic warheads. The largest currently deployed warhead worldwide is in the low single-digit megatons.' },
          { type: 'p', text: 'Tsar Bomba is best understood as the technological maximum of a particular design philosophy — one that the major nuclear powers ultimately abandoned in favor of accuracy and MIRV. Its main legacy today is symbolic: it remains the loudest demonstration in history of just how much energy a single explosion can release. The simulator includes Tsar Bomba in its weapons database; you can detonate it over any city to see the radii.' },
        ],
      },
    ],
  },

  // ── 5. Hiroshima and Nagasaki ──────────────────────────────────────────
  {
    slug: 'hiroshima-nagasaki-80-years-of-data',
    title: 'Hiroshima and Nagasaki: What 80 Years of Data Tell Us',
    description: 'The atomic bombings of August 1945 produced the only large datasets we have on real nuclear-weapon effects in real cities. Eight decades of follow-up studies have shaped almost everything we now know about radiation safety.',
    datePublished: '2026-04-29',
    author: 'NukeBlastSimulator Editorial',
    category: 'history',
    readingMinutes: 8,
    body: [
      {
        body: [
          { type: 'p', text: 'On August 6 and August 9, 1945, the United States detonated atomic bombs over Hiroshima and Nagasaki. The two attacks killed an estimated 140,000 people in Hiroshima and 70,000 in Nagasaki by the end of 1945. Eighty years of follow-up research on the survivors has produced the most extensive dataset on real nuclear-weapon effects anywhere in the world. Almost everything we now know about acute and long-term radiation effects on humans comes from this work.' },
        ],
      },
      {
        heading: 'August 6, 1945: Little Boy over Hiroshima',
        body: [
          { type: 'p', text: 'At 8:15 a.m. on August 6, 1945, the B-29 Enola Gay dropped Little Boy — a gun-type uranium-235 bomb yielding approximately 15 kilotons — over Hiroshima, Japan. The bomb detonated at 580 m altitude, optimized for maximum blast spread.' },
          { type: 'p', text: 'Hiroshima at the time had a population of roughly 350,000. The detonation point was near the Aioi Bridge in the city center. Within seconds, the fireball had vaporized everyone within about 200 m of ground zero. Within minutes, the blast wave had collapsed nearly every wooden building within 2 km, and thermal radiation had set fires throughout the city. Within a few hours, those fires had merged into a city-wide firestorm.' },
          { type: 'p', text: 'By the end of 1945, an estimated 140,000 people had died — roughly half from the immediate blast and thermal effects, and half from injuries, burns, and acute radiation sickness in the weeks that followed.' },
        ],
      },
      {
        heading: 'August 9, 1945: Fat Man over Nagasaki',
        body: [
          { type: 'p', text: 'Three days later, the B-29 Bockscar dropped Fat Man — an implosion-type plutonium-239 bomb yielding approximately 21 kilotons — over Nagasaki. The original target had been the city of Kokura, but heavy cloud cover forced a diversion to the secondary target.' },
          { type: 'p', text: 'Fat Man detonated at 503 m altitude over the Urakami Valley, about 3 km from the city\'s industrial center. Nagasaki\'s hilly geography somewhat shielded parts of the city from the blast, reducing total casualties relative to the flatter Hiroshima. Even so, an estimated 70,000 people died by the end of 1945.' },
          { type: 'p', text: 'Both bombs were air bursts — chosen specifically to maximize blast spread at the cost of fallout. Local fallout in both cities was minimal. The "black rain" that fell on Hiroshima after the detonation was a mixture of soot, ash, and condensed moisture; it carried some radioactivity but not at lethal levels.' },
        ],
      },
      {
        heading: 'The Atomic Bomb Casualty Commission',
        body: [
          { type: 'p', text: 'In 1947, the United States Atomic Energy Commission and the National Academy of Sciences established the Atomic Bomb Casualty Commission (ABCC) to conduct long-term medical follow-up of the survivors. In 1975 the ABCC was reorganized as the Radiation Effects Research Foundation (RERF), a joint US-Japan institution that continues operations today.' },
          { type: 'p', text: 'The RERF Life Span Study (LSS) is the largest and longest-running epidemiological study of radiation exposure ever conducted. It tracks roughly 120,000 people — survivors and their non-exposed control population — from 1950 to the present. The study\'s findings underpin essentially all modern radiation-protection standards used in medicine, nuclear power, and arms control.' },
        ],
      },
      {
        heading: 'What the data showed',
        body: [
          { type: 'p', text: 'The Life Span Study established the dose-response relationship for radiation-induced cancer. Survivors who received high doses had clearly elevated rates of leukemia (peaking 5-10 years after exposure) and solid cancers (rising over decades). The data fit a roughly linear dose-response model down to the lowest measured doses, which is why modern radiation-protection regulations assume that there is no safe threshold for ionizing radiation.' },
          { type: 'p', text: 'But the study also overturned some pre-1945 assumptions. Earlier expectations had been that radiation effects would be far more catastrophic than they turned out to be — that survivors would suffer mass genetic abnormalities, infertility, or population-level health collapse. The data did not show those effects. Genetic damage was not detected in the children of survivors, and overall survivor mortality from causes other than cancer was not significantly elevated.' },
          { type: 'p', text: 'The implication is dual: nuclear weapons are even more devastating in their immediate effects than feared (the casualty toll matched or exceeded estimates), but their long-term genetic legacy is less catastrophic than feared.' },
        ],
      },
      {
        heading: 'The acute radiation syndrome data',
        body: [
          { type: 'p', text: 'The Hiroshima and Nagasaki survivor cohort also produced the foundational dataset on acute radiation syndrome (ARS). The dose-response curves for ARS — including the LD50/60 (the dose at which 50% of victims die within 60 days) of about 4 sieverts — come almost entirely from the 1945 cohort, supplemented by later accidents at Chernobyl, Tokaimura, and Goiânia.' },
          { type: 'p', text: 'For the simulator\'s casualty calculations, ARS is implicit in the mortality rates assigned to each blast zone. Inside the 20 PSI severe-blast zone, where neutron and gamma fluxes were highest, mortality is essentially 98% — a combination of blast injury, burns, and acute radiation. Outside the blast zones, ARS is rare in air-burst scenarios because the radiation flux drops below the ARS threshold by the time it reaches survivable distances.' },
        ],
      },
      {
        heading: 'What the data does not capture',
        body: [
          { type: 'p', text: 'Hiroshima and Nagasaki are the only two real-world data points we have on nuclear weapons used against real cities. Both bombs were small by modern standards (15 and 21 kt). Both were air bursts in flat or moderately hilly terrain. Both were used against early-1940s wood-and-paper urban construction.' },
          { type: 'p', text: 'A modern strategic warhead (100-500 kt) detonated over a modern city would produce different effects: larger blast zones, greater thermal impact, and — depending on construction type — either reduced firestorm risk (steel-and-concrete buildings) or different patterns of injury. A surface burst, which neither attack used, would also add a major fallout component.' },
          { type: 'p', text: 'The simulator extrapolates from the 1945 calibration data using the Glasstone-Dolan scaling laws, which themselves were validated against test-data at higher yields. The methodology page details the formulas. The bottom line is that we have good first-order knowledge of what nuclear weapons do — but we have not used a nuclear weapon against a city in 80 years, and we hope never to again.' },
        ],
      },
    ],
  },

  // ── 6. Modern Arsenals ─────────────────────────────────────────────────
  {
    slug: 'modern-nuclear-arsenals-2026',
    title: 'Modern Nuclear Arsenals: By the Numbers (2026 Update)',
    description: 'Nine states currently possess nuclear weapons, with a combined inventory of roughly 12,500 warheads. Here is the breakdown by country, delivery system, and yield.',
    datePublished: '2026-04-29',
    author: 'NukeBlastSimulator Editorial',
    category: 'doctrine',
    readingMinutes: 8,
    body: [
      {
        body: [
          { type: 'p', text: 'As of early 2026, nine states are believed to possess nuclear weapons: the United States, Russia, China, the United Kingdom, France, India, Pakistan, North Korea, and Israel (which has never officially confirmed). Their combined warhead inventory is approximately 12,500 — down from a Cold War peak of around 70,000 in 1986, but climbing again as China, Russia, and North Korea modernize and expand. Estimates draw on SIPRI, FAS, and Bulletin of the Atomic Scientists.' },
        ],
      },
      {
        heading: 'The big two: the United States and Russia',
        body: [
          { type: 'p', text: 'The United States and Russia together hold roughly 89% of the world\'s nuclear weapons. Russia\'s arsenal is estimated at about 5,580 warheads (1,710 deployed strategic, 1,070 deployed non-strategic, plus reserves and retired-but-intact). The United States has roughly 5,044 warheads (1,670 deployed strategic, 100 deployed non-strategic, plus reserves).' },
          { type: 'p', text: 'Both arsenals follow the classical "triad" structure: land-based intercontinental ballistic missiles (ICBMs), submarine-launched ballistic missiles (SLBMs), and strategic bombers. The United States operates 400 Minuteman III ICBMs, 14 Ohio-class ballistic-missile submarines (each carrying up to 20 Trident II SLBMs), and a fleet of B-2A and B-52H strategic bombers. Russia operates a similar triad with the Yars and Sarmat ICBMs, Borei-class submarines, and Tu-160 and Tu-95 bombers.' },
        ],
      },
      {
        heading: 'China\'s buildup',
        body: [
          { type: 'p', text: 'China has historically maintained a "minimum deterrence" posture with a relatively small arsenal. That changed in the early 2020s. Satellite imagery first revealed three new ICBM silo fields under construction in 2021, eventually adding capacity for several hundred new missiles. Western intelligence estimates now place China\'s arsenal at roughly 600 warheads in 2026 and project it to exceed 1,000 by 2030.' },
          { type: 'p', text: 'China is also deploying its first credible second-strike submarine force (Type 094 SSBNs carrying JL-2 and JL-3 SLBMs) and a strategic bomber (the H-6N). The expansion appears motivated by perceived US missile-defense capabilities and improvements in conventional precision strike that, in Beijing\'s view, made China\'s previous minimum deterrent insufficient.' },
        ],
      },
      {
        heading: 'United Kingdom and France',
        body: [
          { type: 'p', text: 'Britain and France maintain modest, sea-based-only arsenals. The UK operates four Vanguard-class ballistic-missile submarines (replacement Dreadnought-class entering service in the 2030s) carrying Trident II SLBMs with British-designed warheads. The UK arsenal is approximately 225 warheads, of which 120 are deployed.' },
          { type: 'p', text: 'France operates four Triomphant-class submarines plus a small force of land-based bomber-delivered ASMP-A missiles. The French arsenal is approximately 290 warheads. Both the UK and France are now committed to gradual increases in stockpile caps, ending the post-Cold-War drawdown.' },
        ],
      },
      {
        heading: 'India and Pakistan',
        body: [
          { type: 'p', text: 'India and Pakistan both conducted public nuclear tests in 1998 and have since built modest arsenals. India is estimated to have 172 warheads delivered by short and medium-range missiles, the Agni ICBM family, and the INS Arihant ballistic-missile submarine (with the K-15 SLBM). India has historically declared a "no first use" doctrine.' },
          { type: 'p', text: 'Pakistan is estimated to have 170 warheads, primarily delivered by the Shaheen and Ghauri ballistic-missile families and the Babur cruise missile. Pakistan has an explicit policy of using tactical nuclear weapons in response to a conventional Indian invasion — a posture often described as "full-spectrum deterrence."' },
        ],
      },
      {
        heading: 'North Korea',
        body: [
          { type: 'p', text: 'North Korea conducted its first nuclear test in 2006 and has now demonstrated thermonuclear capability (claimed in 2017) and intercontinental delivery (Hwasong-15 and Hwasong-17 ICBMs, tested in 2017 and 2022 respectively). The arsenal is estimated at about 50 warheads in 2026, growing.' },
          { type: 'p', text: 'North Korea also maintains a substantial inventory of short and medium-range ballistic missiles. The Hwasong-14 was the first nuclear-capable ICBM credibly tested by the country; the simulator includes it for educational comparison purposes.' },
        ],
      },
      {
        heading: 'Israel: the unconfirmed nuclear power',
        body: [
          { type: 'p', text: 'Israel has never publicly confirmed possession of nuclear weapons but is universally assessed to have an arsenal estimated at about 90 warheads. Delivery is believed to include Jericho ballistic missiles (Jericho II and III) and possibly Dolphin-class submarine-launched cruise missiles. Israel maintains a doctrine of strategic ambiguity, neither admitting nor denying its arsenal — a policy known as "amimut."' },
        ],
      },
      {
        heading: 'Total inventory and trends',
        body: [
          { type: 'p', text: 'Adding the official estimates, the global nuclear stockpile is approximately 12,500 warheads in 2026, of which about 9,500 are in active military arsenals. Approximately 3,800 are deployed on missiles or aircraft ready to launch on short notice; the remainder are stored as reserves.' },
          { type: 'p', text: 'After three decades of post-Cold-War decline, total numbers stabilized in the late 2010s and have begun rising slightly. The drivers are Chinese expansion, Russian and Pakistani modernization, and a likely North Korean buildup. Combined with the expiration of the New START Treaty in February 2026 and Russia\'s suspension of participation in 2023, the era of US-Russia bilateral arms control is effectively over.' },
          { type: 'p', text: 'See the full Weapons Database for individual warhead profiles. The "compare" pages let you put any two of these warheads head-to-head; the scenarios pages let you see what each one would do to a major city.' },
        ],
      },
    ],
  },

  // ── 7. Nuclear Winter ──────────────────────────────────────────────────
  {
    slug: 'nuclear-winter-regional-war-cooling',
    title: 'Nuclear Winter: How a Regional War Could Cool the Earth',
    description: 'A 1980s climate hypothesis turned out to be more robust than originally thought — and recent modeling shows that even a regional nuclear war could cause global crop failures.',
    datePublished: '2026-04-29',
    author: 'NukeBlastSimulator Editorial',
    category: 'effects',
    readingMinutes: 8,
    body: [
      {
        body: [
          { type: 'p', text: 'In 1983, atmospheric scientist Carl Sagan and four colleagues published a paper in Science arguing that even a relatively small nuclear war could trigger global climate cooling so severe that crops would fail worldwide. The paper became known as the "TTAPS" study after the authors\' initials. Its central claim — that soot from burning cities could darken the planet for years — was controversial at the time, but recent modeling has confirmed and in some ways strengthened the original conclusions.' },
        ],
      },
      {
        heading: 'The TTAPS hypothesis',
        body: [
          { type: 'p', text: 'The TTAPS authors observed that nuclear weapons detonated over cities would ignite enormous fires. Modern cities contain large amounts of fuel — wood, plastics, asphalt, vehicle fuel — and a single megaton-class detonation could ignite a firestorm covering tens of square kilometers. The resulting plume of soot, lofted by the heat into the upper troposphere, would drift on winds and could be transported globally by stratospheric circulation.' },
          { type: 'p', text: 'The original 1983 paper estimated that a 5,000-megaton war (roughly the deployed yields of the time) would inject 200 million tons of soot into the upper atmosphere. The soot would absorb sunlight, dropping global average surface temperatures by 15-25 °C. It would also remain in the stratosphere for years, because at those altitudes there is no rain to wash it out. Crops would fail across most of the Northern Hemisphere.' },
        ],
      },
      {
        heading: 'Critique and refinement',
        body: [
          { type: 'p', text: 'The TTAPS paper drew immediate criticism. Defense-aligned analysts argued that the soot loading was overestimated, that smoke would not reach the stratosphere, that smoke would rain out faster than predicted, and that warming caused by reduced cloud cover might compensate. By the late 1980s, a more cautious "nuclear autumn" framing had partly displaced the original "nuclear winter" claim.' },
          { type: 'p', text: 'Subsequent modeling — particularly the work of Alan Robock and Owen Brian Toon and collaborators in the 2000s and 2010s — addressed these critiques using modern coupled climate models. The results were closer to TTAPS than to the more cautious revisions: soot from city firestorms does reach the stratosphere, does persist for years, and does cause significant cooling. The original hypothesis has held up remarkably well.' },
        ],
      },
      {
        heading: 'The mechanism, in more detail',
        body: [
          { type: 'p', text: 'The mechanism is straightforward but not intuitive. A nuclear weapon detonated over a city ignites multiple fires that merge into a firestorm — a self-sustaining fire so intense it generates its own weather. The firestorm produces a vertical convective plume that lofts smoke and soot to altitudes of 10-15 km, just at the boundary between troposphere and stratosphere.' },
          { type: 'p', text: 'In the stratosphere, soot absorbs sunlight and re-radiates it as heat. This warms the stratosphere and cools the surface — the opposite of greenhouse gases, which cool the stratosphere and warm the surface. The cooler surface produces less convection, weaker monsoons, and shorter growing seasons. The stratospheric soot is removed only by gradual gravitational settling (months to years) since stratospheric circulation does not include rain.' },
          { type: 'p', text: 'The total effect depends on how much soot reaches the stratosphere. Modern modeling suggests that 100 city firestorms could inject enough soot to drop average surface temperatures by 5 °C for several years, with much larger drops in mid-latitudes during growing season.' },
        ],
      },
      {
        heading: 'Even a regional war causes global cooling',
        body: [
          { type: 'p', text: 'The most striking result of recent modeling is that even a regional nuclear war — say, between India and Pakistan — could cause significant global climate disruption. Robock and Toon\'s 2007 paper modeled an India-Pakistan exchange of about 100 Hiroshima-yield weapons (15 kt each) over each side\'s major cities. The result: 5 million tons of soot lofted to the stratosphere, and global surface cooling of 1.25 °C lasting about a decade.' },
          { type: 'p', text: 'A 2014 follow-up using improved climate models found even stronger effects: ozone depletion of 30-50%, growing-season shortening by 10-40 days across the Northern Hemisphere, and global crop yield reductions of 10-40%. The conclusion is that a "regional" nuclear war is not really regional — its climate effects affect the entire planet.' },
        ],
      },
      {
        heading: 'Crop failure and famine',
        body: [
          { type: 'p', text: 'Research by Lili Xia, Alan Robock, and others in the late 2010s and early 2020s extended the modeling to global food production. The conclusions are sobering: even a regional India-Pakistan exchange could reduce global wheat, corn, and soybean production by 10-15%, sufficient to trigger food shortages, price spikes, and famine in regions that depend on food imports. A larger US-Russia exchange could reduce global production by 50% or more — and the resulting global famine would likely kill more people than the bombs themselves.' },
          { type: 'p', text: 'The 2022 paper by Xia et al. in Nature Food estimated that a US-Russia nuclear war scenario could lead to over 5 billion deaths from famine in the years following the exchange — far more than the few hundred million who would die from the immediate effects of the bombs.' },
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
    description: 'A single nuclear weapon detonated above the atmosphere could disable unprotected electronics across an area larger than the continental United States. Here is how the effect works and how seriously experts take the threat.',
    datePublished: '2026-04-29',
    author: 'NukeBlastSimulator Editorial',
    category: 'effects',
    readingMinutes: 7,
    body: [
      {
        body: [
          { type: 'p', text: 'On July 9, 1962, the United States detonated a 1.4-megaton thermonuclear device 400 km above Johnston Island in the Pacific. The test, codenamed Starfish Prime, was meant to study high-altitude nuclear effects on radar and missile-defense systems. What it actually demonstrated was an unexpectedly powerful electromagnetic pulse: streetlights failed in Honolulu, 1,400 km away, telephones went dead, and equipment in monitoring stations across the Pacific was damaged. The discovery led to a decades-long study of the high-altitude electromagnetic pulse — HEMP — and to the realization that a single nuclear weapon, well-placed, could disable entire continents.' },
        ],
      },
      {
        heading: 'How a nuclear bomb generates EMP',
        body: [
          { type: 'p', text: 'A nuclear detonation releases about 0.3% of its energy as gamma rays — high-energy photons that can penetrate matter. At ground level, gamma rays are absorbed within meters of the detonation, contributing to the prompt radiation pulse. But at high altitude (above 30 km, where the air is thin), the gammas can travel hundreds of kilometers before they interact with anything.' },
          { type: 'p', text: 'When a gamma ray strikes an air molecule, it knocks an electron loose at relativistic speed (the Compton effect). The accelerated electron is then deflected by the Earth\'s magnetic field, producing a brief but intense electromagnetic pulse. Because the gammas spread over a large area before they interact, the pulse covers an enormous footprint — the line-of-sight area from the burst altitude.' },
          { type: 'p', text: 'A burst at 400 km altitude has a line-of-sight footprint of roughly 2,200 km radius — more than enough to cover the continental United States.' },
        ],
      },
      {
        heading: 'E1, E2, and E3 components',
        body: [
          { type: 'p', text: 'The HEMP signal has three temporally distinct components, each with different damage characteristics. E1 is the prompt pulse: a sub-microsecond spike of intense electromagnetic energy. It is fast enough to defeat most surge protectors and induces voltages high enough to destroy semiconductors directly. Modern electronics — phones, computers, vehicle ignitions — are particularly vulnerable.' },
          { type: 'p', text: 'E2 is an intermediate-time pulse, comparable to lightning, lasting microseconds to a millisecond. It is generated by neutrons interacting with the atmosphere. E2 is well within the range that lightning protection can handle, so it is generally not the threat component.' },
          { type: 'p', text: 'E3 is a long, slow magnetohydrodynamic disturbance lasting tens of seconds, caused by the bomb\'s expanding fireball distorting the geomagnetic field. E3 is dangerous to long-distance power lines and transformers, where it can induce ground-induced currents (GIC) similar to those produced by severe geomagnetic storms. E3 is the component most likely to trigger continent-wide power-grid failures.' },
        ],
      },
      {
        heading: 'What gets damaged',
        body: [
          { type: 'p', text: 'Modern unhardened electronics are extremely vulnerable to E1. Computer chips, phones, electronic ignitions, controllers in industrial systems, and the supervisory hardware of power-grid substations can all be damaged or destroyed. Short cables (less than ~10 m) generally do not pick up enough E1 voltage to be a major threat, but the sensitive electronics they connect to often are.' },
          { type: 'p', text: 'The power grid is the most concerning vulnerability. Long transmission lines pick up substantial E3 currents. Large transformers — the slow-to-replace, ten-million-dollar units that step voltage up and down at substations — can be damaged when ground-induced currents drive them into magnetic saturation. Replacement transformers have multi-year lead times, and the US currently has a stockpile measured in dozens, not the hundreds that might be needed.' },
          { type: 'p', text: 'Critical infrastructure — water treatment, hospital systems, emergency services, financial transactions — all depend on electric power. A continent-wide grid outage caused by HEMP could last weeks to months and cause cascading failures across the economy.' },
        ],
      },
      {
        heading: 'How seriously experts take the threat',
        body: [
          { type: 'p', text: 'Assessments of HEMP threat have ranged widely. The 2008 Congressional EMP Commission report described HEMP as one of "few threats" capable of causing damage on a national scale, with potential casualties in the hundreds of thousands or millions. Critics have argued that the report overstates vulnerabilities and understates the difficulty of executing an attack.' },
          { type: 'p', text: 'The technical consensus is somewhere in between: HEMP is a real and serious threat, particularly to the power grid, but the damage is highly dependent on the specifics of the burst (yield, altitude, latitude relative to magnetic field, atmospheric conditions). And executing a HEMP attack requires either a delivery vehicle capable of reaching high altitude over the target — which only nuclear-armed states with ICBMs currently have — or a ship-launched short-range missile lofted from offshore.' },
        ],
      },
      {
        heading: 'Hardening',
        body: [
          { type: 'p', text: 'EMP hardening — designing electronics to survive HEMP — is well understood but expensive. Military systems (strategic bombers, missile silos, command-and-control nodes) are routinely hardened. Civilian infrastructure is mostly not. The cost of hardening the entire US power grid against E3 has been estimated at several billion dollars — large but not impossibly so.' },
          { type: 'p', text: 'The 2019 Federal Energy Regulatory Commission rule requiring grid operators to study GIC vulnerability was a small step in this direction. But comprehensive hardening would require sustained policy attention and funding that has so far not materialized.' },
        ],
      },
      {
        heading: 'EMP in modern threat assessments',
        body: [
          { type: 'p', text: 'HEMP appears in modern threat assessments primarily in the context of North Korean and Russian capabilities. North Korea\'s Hwasong-14 ICBM, tested in 2017, is plausibly capable of lofting a small nuclear warhead to high altitude over US territory. Russia and China both possess clear HEMP-capable delivery systems.' },
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
