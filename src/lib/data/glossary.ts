// Glossary of nuclear weapons / physics / doctrine terms.
// Each entry powers a /glossary/[slug] static page with DefinedTerm schema.
// Definitions are written for general educated audiences and are AI-friendly:
// the first sentence is a self-contained definition that AI engines can quote
// directly, followed by an expanded explanation.

export type GlossaryCategory = 'effects' | 'weapons' | 'physics' | 'doctrine' | 'treaty'

export type GlossaryEntry = {
  slug: string
  term: string
  category: GlossaryCategory
  short: string  // one-sentence definition (used as meta description)
  long: string   // expanded explanation (1–2 paragraphs)
  related?: string[] // slugs of related terms
}

export const glossary: GlossaryEntry[] = [
  // ── Effects ────────────────────────────────────────────────────────────
  {
    slug: 'fireball',
    term: 'Fireball',
    category: 'effects',
    short: 'The sphere of plasma created by a nuclear detonation, with internal temperatures exceeding 10 million °C — hotter than the surface of the Sun.',
    long: 'The fireball forms within microseconds of a nuclear detonation as the X-ray flux from the bomb superheats the surrounding air into plasma. Within the fireball radius, everything is vaporized; the plasma sphere also acts as the source of the thermal radiation pulse and the initial blast wave. Fireball radius scales roughly with yield to the 0.4 power.',
    related: ['thermal-radiation', 'overpressure', 'air-burst'],
  },
  {
    slug: 'overpressure',
    term: 'Overpressure',
    category: 'effects',
    short: 'The pressure above atmospheric pressure produced by the blast wave of a nuclear detonation, measured in pounds per square inch (PSI).',
    long: 'Nuclear blast damage is conventionally categorized by overpressure. 20 PSI destroys reinforced concrete buildings; 5 PSI collapses most residential structures and is the canonical "city killing" threshold; 1 PSI shatters windows and causes light injuries. Overpressure radius scales with yield to the 1/3 power.',
    related: ['psi', 'fireball', 'air-burst', 'surface-burst'],
  },
  {
    slug: 'psi',
    term: 'PSI (Pounds per Square Inch)',
    category: 'effects',
    short: 'The unit used to measure blast overpressure from a nuclear detonation.',
    long: '1 PSI is a small overpressure that breaks windows. 5 PSI collapses most residential buildings and is the standard measurement for nuclear-blast damage zones. 20 PSI destroys reinforced concrete. By comparison, normal atmospheric pressure at sea level is about 14.7 PSI.',
    related: ['overpressure', 'blast-wave'],
  },
  {
    slug: 'thermal-radiation',
    term: 'Thermal Radiation',
    category: 'effects',
    short: 'The intense pulse of light and infrared radiation emitted by the fireball of a nuclear detonation, capable of causing burns and igniting fires at long distances.',
    long: 'Thermal radiation accounts for roughly 35% of the energy released by a nuclear weapon. It travels at the speed of light and arrives before the blast wave. Third-degree burns can occur out to several kilometers for strategic-yield weapons. Thermal-radiation radius scales with yield to the 0.41 power, faster than blast.',
    related: ['fireball', 'air-burst', 'second-degree-burns'],
  },
  {
    slug: 'fallout',
    term: 'Fallout',
    category: 'effects',
    short: 'Radioactive material thrown into the atmosphere by a surface-burst nuclear detonation, which then settles back to earth over hours to weeks.',
    long: 'Surface bursts produce massive fallout because the fireball touches the ground, vaporizing soil and irradiating it with neutron flux. The radioactive debris is lofted into the upper atmosphere and drifts downwind, depositing as a long elliptical plume. Air bursts produce minimal fallout because the fireball does not interact with the ground. The lethal fallout zone of a 1 Mt surface burst can extend hundreds of kilometers downwind.',
    related: ['surface-burst', 'air-burst', 'half-life', 'acute-radiation-syndrome'],
  },
  {
    slug: 'air-burst',
    term: 'Air Burst',
    category: 'effects',
    short: 'A nuclear detonation above the ground at optimal altitude, maximizing the area affected by blast and thermal radiation while producing minimal fallout.',
    long: 'In an air burst the fireball does not reach the ground, so the bomb cannot vaporize and irradiate soil. This minimizes local fallout but maximizes blast spread because the shock wave reflects off the ground and reinforces the direct wave. Hiroshima and Nagasaki were both air bursts — the optimal altitudes were 580 m and 503 m respectively.',
    related: ['surface-burst', 'fallout', 'fireball'],
  },
  {
    slug: 'surface-burst',
    term: 'Surface Burst',
    category: 'effects',
    short: 'A nuclear detonation at ground level, producing roughly 40-50% smaller blast radius than an air burst but creating massive radioactive fallout.',
    long: 'A surface burst is used when the target is hardened (silos, command bunkers) or when the attacker wants to maximize fallout. The fireball touches the ground, vaporizing soil and creating a large crater. Roughly half the bomb energy goes into the crater and ground shock instead of blast and thermal effects. The radioactive plume can render hundreds of square kilometers uninhabitable for years.',
    related: ['air-burst', 'fallout', 'crater'],
  },
  {
    slug: 'emp',
    term: 'EMP (Electromagnetic Pulse)',
    category: 'effects',
    short: 'A burst of electromagnetic energy released by a nuclear detonation, capable of damaging or destroying unhardened electronics over a wide area.',
    long: 'A high-altitude nuclear detonation (above 30 km) produces a particularly strong EMP because gamma rays from the bomb interact with the upper atmosphere to generate a downward-directed electromagnetic wave covering thousands of kilometers. A single high-altitude burst over the central US could disable power grids and unhardened electronics across most of the continent.',
    related: ['high-altitude-burst', 'gamma-radiation'],
  },
  {
    slug: 'nuclear-winter',
    term: 'Nuclear Winter',
    category: 'effects',
    short: 'A hypothesized severe global cooling caused by soot from urban firestorms following a large-scale nuclear war.',
    long: 'Nuclear-winter models project that hundreds of city-burning detonations would loft millions of tons of soot into the stratosphere, blocking sunlight for years and dropping global temperatures by 5–10 °C. The result would be widespread crop failure and famine. Even a regional nuclear war (e.g., India–Pakistan) is modeled to cause significant cooling.',
    related: ['fallout', 'fireball'],
  },
  {
    slug: 'acute-radiation-syndrome',
    term: 'Acute Radiation Syndrome',
    category: 'effects',
    short: 'The constellation of medical symptoms following a high dose of ionizing radiation, including nausea, immune-system failure, hemorrhage, and death.',
    long: 'ARS occurs at whole-body doses of about 1 Sievert and above. Doses of 4-6 Sv kill about half of untreated victims within 60 days; doses above 8 Sv are usually fatal even with intensive supportive care. Symptoms progress through prodromal, latent, manifest illness, and either recovery or death.',
    related: ['fallout', 'sievert', 'gamma-radiation'],
  },

  // ── Weapons ────────────────────────────────────────────────────────────
  {
    slug: 'atomic-bomb',
    term: 'Atomic Bomb',
    category: 'weapons',
    short: 'A nuclear weapon whose energy comes from nuclear fission of uranium-235 or plutonium-239.',
    long: 'Atomic bombs (also called fission bombs) split heavy nuclei to release energy. Yields are typically below 100 kilotons because of inefficiency. The Hiroshima bomb (Little Boy, uranium-235, gun-type) and Nagasaki bomb (Fat Man, plutonium-239, implosion) were both fission weapons.',
    related: ['hydrogen-bomb', 'thermonuclear-weapon', 'nuclear-fission', 'critical-mass'],
  },
  {
    slug: 'hydrogen-bomb',
    term: 'Hydrogen Bomb',
    category: 'weapons',
    short: 'A nuclear weapon that derives most of its energy from nuclear fusion of hydrogen isotopes, ignited by a fission primary stage.',
    long: 'Also called thermonuclear or H-bombs, hydrogen bombs use a small fission bomb to compress and heat a fusion fuel (typically lithium deuteride) to fusion-ignition conditions. Yields are scalable to tens of megatons; the largest weapon ever tested, Tsar Bomba (1961), was a 50 Mt three-stage thermonuclear device. Modern strategic warheads are all thermonuclear.',
    related: ['thermonuclear-weapon', 'teller-ulam', 'tsar-bomba', 'nuclear-fusion'],
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
    long: 'In the Teller–Ulam configuration, X-rays from a fission primary travel through a hohlraum and ablation-compress a separate fusion secondary, raising it to fusion-ignition temperatures. This radiation-implosion principle made very large yields practical and is used in every operational H-bomb since Ivy Mike (1952).',
    related: ['hydrogen-bomb', 'thermonuclear-weapon', 'nuclear-fusion'],
  },
  {
    slug: 'warhead',
    term: 'Warhead',
    category: 'weapons',
    short: 'The explosive payload of a missile, bomb, or other weapon system; for nuclear weapons, the package containing the fissile or fusion material.',
    long: 'In nuclear arsenals, "warhead" usually refers to the physics package on a delivery vehicle (ICBM reentry vehicle, SLBM RV, cruise missile, gravity bomb). Modern warheads are typically thermonuclear and yield 100-500 kt. The W76 and W88 are the most common US warheads; the B61 is a variable-yield gravity bomb.',
    related: ['icbm', 'slbm', 'mirv', 'reentry-vehicle'],
  },
  {
    slug: 'mirv',
    term: 'MIRV',
    category: 'weapons',
    short: 'Multiple Independently-targetable Reentry Vehicle — a single missile carrying several warheads, each able to strike a different target.',
    long: 'MIRV technology, deployed from the early 1970s, allows one ICBM or SLBM to deliver up to 8-10 warheads on different targets. This was originally a counter-ABM measure but became the dominant warhead-multiplier in Cold War arsenals. New START limits MIRV deployments by warhead count, not by missile.',
    related: ['icbm', 'slbm', 'warhead', 'reentry-vehicle'],
  },
  {
    slug: 'icbm',
    term: 'ICBM (Intercontinental Ballistic Missile)',
    category: 'weapons',
    short: 'A long-range ballistic missile (range > 5,500 km) designed to deliver nuclear warheads between continents.',
    long: 'ICBMs are typically launched from hardened silos or mobile launchers, follow a ballistic trajectory through space, and reenter the atmosphere to strike targets thousands of kilometers away. US Minuteman III and Russian RS-28 Sarmat are current examples. Flight time from Russia to the US is roughly 30 minutes.',
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
    short: 'A nuclear weapon designed for battlefield use, typically with low yield (sub-kiloton to ~50 kilotons) and short range.',
    long: 'Tactical (or "non-strategic") nuclear weapons include artillery shells, depth charges, short-range missiles, and gravity bombs. Modern tactical weapons like the B61 and Russian Iskander-K warhead have variable yields (sometimes called "dial-a-yield"). The line between tactical and strategic blurs at higher yields.',
    related: ['strategic-nuclear-weapon', 'b61', 'davy-crockett'],
  },
  {
    slug: 'strategic-nuclear-weapon',
    term: 'Strategic Nuclear Weapon',
    category: 'weapons',
    short: 'A nuclear weapon designed for long-range strikes against an adversary\'s population centers, industrial base, or strategic infrastructure.',
    long: 'Strategic weapons are typically high-yield (100 kt to several megatons) and delivered by ICBMs, SLBMs, or strategic bombers. They are governed by treaties such as New START. The US triad consists of Minuteman ICBMs, Trident SLBMs, and B-2 / B-21 bombers carrying B61 / B83 gravity bombs.',
    related: ['tactical-nuclear-weapon', 'icbm', 'slbm', 'nuclear-triad'],
  },
  {
    slug: 'neutron-bomb',
    term: 'Neutron Bomb',
    category: 'weapons',
    short: 'A small thermonuclear weapon designed to maximize neutron radiation output relative to blast and thermal effects.',
    long: 'Also called an "enhanced radiation weapon," the neutron bomb releases roughly 80% of its energy as fast neutrons, which kill biological targets without destroying buildings. Originally conceived as a battlefield anti-tank weapon, the W70 neutron warhead was deployed briefly in the 1980s and retired by 1992.',
    related: ['thermonuclear-weapon', 'tactical-nuclear-weapon'],
  },

  // ── Physics ────────────────────────────────────────────────────────────
  {
    slug: 'yield',
    term: 'Yield',
    category: 'physics',
    short: 'The total energy released by a nuclear weapon, expressed in tons (or kilotons / megatons) of TNT equivalent.',
    long: 'Nuclear yield is conventionally measured against TNT explosive energy: 1 kiloton (kt) = 1,000 tons of TNT, 1 megaton (Mt) = 1 million tons. The Hiroshima bomb was 15 kt, Tsar Bomba 50,000 kt, and modern strategic warheads typically 100-500 kt.',
    related: ['kiloton', 'megaton', 'tnt-equivalent'],
  },
  {
    slug: 'kiloton',
    term: 'Kiloton (kt)',
    category: 'physics',
    short: 'A unit of nuclear yield equal to 1,000 tons of TNT equivalent (4.184 × 10¹² joules).',
    long: 'A kiloton is the standard unit for tactical-yield nuclear weapons. The Hiroshima bomb was about 15 kilotons; modern artillery-fired nuclear shells (now retired) were sub-kiloton.',
    related: ['yield', 'megaton', 'tnt-equivalent'],
  },
  {
    slug: 'megaton',
    term: 'Megaton (Mt)',
    category: 'physics',
    short: 'A unit of nuclear yield equal to 1,000,000 tons (or 1,000 kilotons) of TNT equivalent.',
    long: 'A megaton is a unit for strategic thermonuclear weapons. Most modern strategic warheads are sub-megaton (100-500 kt) for accuracy reasons; only large city-busting weapons exceeded 1 Mt. Tsar Bomba (50 Mt) is the largest weapon ever detonated.',
    related: ['yield', 'kiloton', 'tsar-bomba'],
  },
  {
    slug: 'nuclear-fission',
    term: 'Nuclear Fission',
    category: 'physics',
    short: 'The splitting of heavy atomic nuclei (typically uranium-235 or plutonium-239) into lighter fragments, releasing large amounts of energy.',
    long: 'Fission is the energy-release mechanism in atomic bombs and most nuclear power plants. Each fission event releases roughly 200 MeV of energy and 2–3 neutrons, which can sustain a chain reaction if a critical mass of fissile material is assembled.',
    related: ['nuclear-fusion', 'critical-mass', 'uranium-235', 'plutonium-239'],
  },
  {
    slug: 'nuclear-fusion',
    term: 'Nuclear Fusion',
    category: 'physics',
    short: 'The combination of light atomic nuclei (typically deuterium and tritium) into heavier nuclei, releasing energy.',
    long: 'Fusion powers stars and is the energy mechanism in thermonuclear weapons. In a hydrogen bomb, a fission primary compresses and heats lithium-deuteride fuel to fusion-ignition temperatures (millions of degrees), releasing far more energy than fission alone.',
    related: ['nuclear-fission', 'thermonuclear-weapon', 'deuterium', 'tritium'],
  },
  {
    slug: 'critical-mass',
    term: 'Critical Mass',
    category: 'physics',
    short: 'The minimum amount of fissile material required to sustain a self-propagating nuclear chain reaction.',
    long: 'For a bare sphere of plutonium-239, the critical mass is about 10 kg; for uranium-235 it is about 52 kg. Critical mass is reduced by neutron reflectors (tampers) and by compression. Atomic bombs work by rapidly assembling a supercritical mass before the chain reaction blows itself apart.',
    related: ['nuclear-fission', 'plutonium-239', 'uranium-235', 'atomic-bomb'],
  },
  {
    slug: 'uranium-235',
    term: 'Uranium-235',
    category: 'physics',
    short: 'A fissile isotope of uranium that constitutes the explosive material in many fission weapons.',
    long: 'Natural uranium is 99.3% non-fissile U-238 and only 0.7% U-235. Weapons-grade uranium is enriched to >90% U-235 — a process requiring centrifuges or gaseous diffusion. The Hiroshima bomb (Little Boy) used about 64 kg of highly enriched uranium-235.',
    related: ['plutonium-239', 'critical-mass', 'nuclear-fission', 'little-boy'],
  },
  {
    slug: 'plutonium-239',
    term: 'Plutonium-239',
    category: 'physics',
    short: 'A fissile isotope of plutonium produced from uranium-238 in nuclear reactors and used in most modern fission weapons.',
    long: 'Pu-239 has a smaller critical mass than U-235 and is the preferred material for compact fission weapons. It cannot be assembled by gun-type designs (it would predetonate), so plutonium weapons use implosion. The Nagasaki bomb (Fat Man) used about 6.2 kg of plutonium.',
    related: ['uranium-235', 'critical-mass', 'fat-man', 'implosion'],
  },
  {
    slug: 'deuterium',
    term: 'Deuterium',
    category: 'physics',
    short: 'A heavy isotope of hydrogen with one neutron, used as fusion fuel in thermonuclear weapons.',
    long: 'Deuterium occurs naturally at about 1 atom per 6,420 of normal hydrogen. In thermonuclear weapons, lithium-6 deuteride (a solid compound) is the fusion fuel — neutron irradiation of the lithium produces tritium in situ, which then fuses with deuterium to release energy.',
    related: ['tritium', 'nuclear-fusion', 'thermonuclear-weapon'],
  },
  {
    slug: 'tritium',
    term: 'Tritium',
    category: 'physics',
    short: 'A radioactive heavy isotope of hydrogen with two neutrons, used as fusion fuel and in boosted-fission weapons.',
    long: 'Tritium has a half-life of 12.3 years, so warhead arsenals require ongoing tritium production to replace decay. Modern boosted-fission weapons inject tritium-deuterium gas into the fission core to enhance yield. Tritium is produced by irradiating lithium-6 in nuclear reactors.',
    related: ['deuterium', 'nuclear-fusion', 'boosted-fission', 'half-life'],
  },
  {
    slug: 'half-life',
    term: 'Half-Life',
    category: 'physics',
    short: 'The time required for half of a quantity of a radioactive isotope to decay.',
    long: 'Different isotopes have wildly different half-lives: tritium 12.3 years, cesium-137 30 years, plutonium-239 24,100 years, uranium-235 704 million years. Half-life determines fallout persistence: short-lived isotopes dominate early radiation, long-lived isotopes contaminate the environment for decades.',
    related: ['fallout', 'tritium', 'plutonium-239'],
  },
  {
    slug: 'sievert',
    term: 'Sievert (Sv)',
    category: 'physics',
    short: 'The SI unit of equivalent dose of ionizing radiation, accounting for biological effect.',
    long: 'A whole-body dose of about 1 Sv causes acute radiation syndrome; 4-6 Sv kills roughly half of untreated victims; 8 Sv is usually fatal. Background radiation is about 2-3 millisieverts per year. Aircrew and astronauts receive notably higher doses.',
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
    long: 'Boosting allows a fission bomb to deliver several times its un-boosted yield with the same amount of fissile material. The fusion neutrons released by D-T reactions cause a much higher fraction of the fissile core to fission before the bomb disassembles. Most modern fission primaries are boosted.',
    related: ['nuclear-fission', 'tritium', 'thermonuclear-weapon'],
  },
  {
    slug: 'second-degree-burns',
    term: 'Second-Degree Burns',
    category: 'physics',
    short: 'Partial-thickness burns affecting both the epidermis and dermis, characterized by blistering and pain.',
    long: 'In a nuclear context, the 2nd-degree burn radius is the distance at which exposed skin receives enough thermal radiation (about 5 cal/cm²) to blister but not char. For a Hiroshima-yield bomb, this radius is roughly 2 km; for a 1 Mt weapon it extends to about 12 km.',
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
    long: 'The triad provides survivability through diversity: each leg has different vulnerabilities. ICBMs are accurate but fixed; SLBMs are survivable but harder to recall; bombers are flexible but slow. The US, Russia, China, and India operate full triads; the UK and France rely solely on SLBMs.',
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
    long: 'The Dead Hand system, known as Perimeter, was developed in the early 1980s. If sensors detect a nuclear attack and command-and-control has been severed, the system enables surviving officers to authorize a full retaliatory launch. Russia is widely believed to maintain a modernized version.',
    related: ['second-strike', 'mad'],
  },
  {
    slug: 'permissive-action-link',
    term: 'Permissive Action Link (PAL)',
    category: 'doctrine',
    short: 'A security device built into nuclear weapons that prevents unauthorized arming or detonation without the correct code.',
    long: 'PALs were first deployed by the US in 1962 to prevent rogue or stolen weapons from being used. Modern PALs disable the warhead if tampered with. The Soviet Union and Russia use a different system based on centralized release codes.',
    related: ['warhead', 'first-strike'],
  },

  // ── Treaty / law ───────────────────────────────────────────────────────
  {
    slug: 'npt',
    term: 'NPT (Non-Proliferation Treaty)',
    category: 'treaty',
    short: 'The 1968 Treaty on the Non-Proliferation of Nuclear Weapons, which restricts nuclear-weapon possession to five recognized states and obligates them to pursue disarmament.',
    long: 'The NPT recognizes the US, USSR/Russia, UK, France, and China as nuclear-weapon states. All other parties commit not to acquire nuclear weapons in exchange for access to peaceful nuclear technology. India, Pakistan, Israel, and North Korea (which withdrew) operate outside the NPT framework.',
    related: ['tpnw', 'ctbt'],
  },
  {
    slug: 'tpnw',
    term: 'TPNW (Treaty on the Prohibition of Nuclear Weapons)',
    category: 'treaty',
    short: 'A 2017 UN treaty that prohibits all activities related to nuclear weapons — development, possession, testing, threats of use — for state parties.',
    long: 'The TPNW entered into force in January 2021. Over 70 states have ratified it. None of the nine nuclear-armed states have signed; the treaty is intended to stigmatize possession and build pressure toward eventual abolition. ICAN, the lead civil-society coalition behind the TPNW, won the 2017 Nobel Peace Prize.',
    related: ['npt', 'ctbt'],
  },
  {
    slug: 'ctbt',
    term: 'CTBT (Comprehensive Test Ban Treaty)',
    category: 'treaty',
    short: 'A 1996 treaty banning all nuclear explosions in all environments, for both military and civilian purposes.',
    long: 'The CTBT has not entered into force because eight key states (including the US, China, India, Pakistan, North Korea, Iran, Israel, Egypt) have not ratified it. Despite this, all states except North Korea have observed a de-facto testing moratorium since the late 1990s. The CTBTO operates a global monitoring network.',
    related: ['npt', 'tpnw'],
  },
  {
    slug: 'new-start',
    term: 'New START',
    category: 'treaty',
    short: 'A 2010 US–Russia treaty limiting each side to 1,550 deployed strategic nuclear warheads and 700 deployed delivery systems.',
    long: 'New START replaced the 1991 START I treaty. It expires in February 2026 and Russia suspended participation in February 2023, although both sides have continued to observe the warhead limits informally. New START is currently the only remaining bilateral US–Russia nuclear arms control agreement.',
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
