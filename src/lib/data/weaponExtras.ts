// NBS-014: per-weapon long-form sections + FAQ for the three T1 weapon pages
// (little-boy, fat-man, tsar-bomba). Rendered by the weapon template below the
// blast-effects table. Every figure is a verified fact from
// research/retarget-facts-2026-10-28.csv; weight/dimension conflicts are
// disclosed per the sourcing report (state the range with each source). Engine
// radii use {{r:kt:effect}} so they can never drift from the map. Museum
// "20,000-ton" yields and 1,800 ft burst heights are cut per the report.
import type { Section, FaqItem } from '@/lib/blog/types'

export type WeaponExtra = {
  sections: Section[]
  faq: FaqItem[]
  sourceIds: string[] // registered on the page so every citation resolves
}

const DOE = 'us-doe-nnsa-nevada-field-office-united-states-nu'
const AHF2 = 'atomic-heritage-foundation-national-museum-of-nu-2'
const SUBLETTE_US = 'nuclear-weapon-archive-the-first-atomic-weapons'
const NMUSAF_LB = 'national-museum-of-the-us-air-force-little-boy-a'
const NMUSAF_FM = 'national-museum-of-the-us-air-force-fat-man-atom'
const TRUMAN = 'truman-library-statement-by-the-president-announ'
const NAGASAKI = 'nagasaki-city-1945-8-9-at-11-02-a-m-august-9-194'
const NPS = 'us-national-park-service-the-atomic-bombings-of'
const NASM = 'smithsonian-national-air-and-space-museum-boeing'
const RERF = 'radiation-effects-research-foundation-frequently'
const SUBLETTE_USSR = 'nuclear-weapon-archive-the-soviet-weapons-progra'
const AHF_TSAR = 'atomic-heritage-foundation-national-museum-of-nu'
const NWW2M = 'the-national-wwii-museum-tsar-bomba-the-largest'

export const WEAPON_EXTRAS: Record<string, WeaponExtra> = {
  'little-boy': {
    sections: [
      {
        heading: 'How big was the Hiroshima bomb?',
        body: [
          {
            type: 'p',
            text: 'Little Boy was about 10 feet long and 28 inches across. {{c:atomic-heritage-foundation-national-museum-of-nu-2}} Carey Sublette\'s specification table gives the same figures, 120 inches by 28 inches. {{c:nuclear-weapon-archive-the-first-atomic-weapons}} Published weights differ by source: Sublette lists 8,900 lb, {{c:nuclear-weapon-archive-the-first-atomic-weapons}} the National Museum of the US Air Force rounds it to about 9,000 lb, {{c:national-museum-of-the-us-air-force-little-boy-a}} and the National Museum of Nuclear Science & History gives 9,700 lb. {{c:atomic-heritage-foundation-national-museum-of-nu-2}}',
          },
          {
            type: 'p',
            text: 'It was a gun-type uranium weapon {{c:national-museum-of-the-us-air-force-little-boy-a}} with a yield of 15 kilotons. {{c:us-doe-nnsa-nevada-field-office-united-states-nu}} When President Truman announced the bombing he described "more power than 20,000 tons of TNT," {{c:truman-library-statement-by-the-president-announ}} but that was a 1945 estimate; the figure in the US government\'s own test catalogue is 15 kt.',
          },
          {
            type: 'p',
            text: 'On the ground, a 15-kiloton air burst at optimum height produces a fireball about {{r:15:fireball}} in radius, a 5 psi moderate-blast zone of about {{r:15:psi5}} (the level at which most houses would collapse), and a 1 psi light-damage radius of about {{r:15:psi1}}, where windows shatter. Thermal radiation can cause third-degree burns out to about {{r:15:burn3}}. [See every radius for 15 kt on the blast-radius chart.](/nuclear-blast-radius?kt=15)',
          },
        ],
      },
    ],
    faq: [
      {
        question: 'How big was the Hiroshima bomb?',
        answer:
          'Little Boy, the bomb dropped on Hiroshima, was about 10 feet long and 28 inches in diameter. Published weights range from 8,900 lb (Sublette) to about 9,000 lb (US Air Force museum) and 9,700 lb (National Museum of Nuclear Science & History). It was a gun-type uranium weapon with a yield of 15 kilotons.',
        sourceIds: [AHF2, SUBLETTE_US, DOE],
      },
      {
        question: 'How powerful was the Hiroshima bomb?',
        answer:
          'The Hiroshima bomb had a yield of 15 kilotons, or 15,000 tons of TNT equivalent, according to the US government test catalogue DOE/NV-209. In an air burst at optimum height that is enough to collapse most houses to a radius of roughly two kilometres and to shatter windows several kilometres further out.',
        sourceIds: [DOE],
      },
      {
        question: 'How far did the Hiroshima blast reach?',
        answer:
          'For a 15-kiloton air burst the simulator computes a fireball radius of about {{r:15:fireball}}, a 5 psi moderate-blast radius of about {{r:15:psi5}} (the level at which most houses would collapse) and a 1 psi light-damage radius of about {{r:15:psi1}}, where windows break. Thermal radiation reaches third-degree-burn range at about {{r:15:burn3}}.',
        sourceIds: ['effects-fireball', 'effects-blast-thermal'],
      },
      {
        question: "What was the Hiroshima bomb's yield in TNT?",
        answer:
          'Fifteen kilotons, which is 15,000 tons of TNT equivalent (DOE/NV-209). The 1945 White House announcement spoke of "more power than 20,000 tons of TNT," a wartime estimate; the measured figure settled at 15 kt.',
        sourceIds: [DOE, TRUMAN],
      },
    ],
    sourceIds: [AHF2, SUBLETTE_US, NMUSAF_LB, DOE, TRUMAN, 'effects-fireball', 'effects-blast-thermal'],
  },

  'fat-man': {
    sections: [
      {
        heading: 'When was Fat Man dropped?',
        body: [
          {
            type: 'p',
            text: 'Fat Man was dropped on Nagasaki at 11:02 a.m. local time on 9 August 1945. {{c:nagasaki-city-1945-8-9-at-11-02-a-m-august-9-194}} It was carried by the B-29 Superfortress Bockscar {{c:us-national-park-service-the-atomic-bombings-of}} commanded by Major Charles W. Sweeney, who was 25. {{c:smithsonian-national-air-and-space-museum-boeing;nagasaki-city-1945-8-9-at-11-02-a-m-august-9-194}} Kokura was the primary target that morning; the crew turned to the secondary target, Nagasaki, after the city was obscured (Nagasaki City records smoke, the National Park Service haze). {{c:nagasaki-city-events-leading-up-to-atomic-bombin;us-national-park-service-the-atomic-bombings-of}} Released from about 9,600 m, {{c:nagasaki-city-1945-8-9-at-11-02-a-m-august-9-194}} the bomb detonated roughly 503 m above the Urakami district {{c:radiation-effects-research-foundation-frequently}} (the NPS timeline gives 1,650 ft). {{c:us-national-park-service-the-atomic-bombings-of}}',
          },
        ],
      },
      {
        heading: 'Physical description',
        body: [
          {
            type: 'p',
            text: 'Fat Man was about 10 feet 8 inches long and 60 inches across {{c:atomic-heritage-foundation-national-museum-of-nu-2}} (Sublette: 128 inches by 60.25 inches). {{c:nuclear-weapon-archive-the-first-atomic-weapons}} Reported weights again differ: about 10,000 lb (US Air Force museum), {{c:national-museum-of-the-us-air-force-fat-man-atom}} 10,300 lb (Sublette) {{c:nuclear-weapon-archive-the-first-atomic-weapons}} and 10,800 lb (National Museum of Nuclear Science & History). {{c:atomic-heritage-foundation-national-museum-of-nu-2}} It was an implosion-type plutonium weapon {{c:national-museum-of-the-us-air-force-fat-man-atom}} with a yield of 21 kilotons. {{c:us-doe-nnsa-nevada-field-office-united-states-nu}}',
          },
          {
            type: 'p',
            text: 'A 21-kiloton air burst at optimum height produces a fireball about {{r:21:fireball}} in radius, a 5 psi moderate-blast zone of about {{r:21:psi5}} and a 1 psi light-damage radius of about {{r:21:psi1}}. [See every radius for 21 kt on the blast-radius chart.](/nuclear-blast-radius?kt=21)',
          },
        ],
      },
    ],
    faq: [
      {
        question: 'When was Fat Man dropped?',
        answer:
          'Fat Man was dropped on Nagasaki at 11:02 a.m. local time on 9 August 1945, three days after the Hiroshima bombing. The primary target had been Kokura, but the crew diverted to the secondary target, Nagasaki, after the primary was obscured.',
        sourceIds: [NAGASAKI, NPS],
      },
      {
        question: 'Who dropped Fat Man?',
        answer:
          'Fat Man was released by the B-29 Superfortress Bockscar, commanded by Major Charles W. Sweeney, who was 25 at the time. It took off from the island of Tinian in the Mariana Islands.',
        sourceIds: [NPS, NASM, NAGASAKI],
      },
      {
        question: 'How big was Fat Man?',
        answer:
          'Fat Man was about 10 feet 8 inches long and 60 inches in diameter (Sublette gives 128 by 60.25 inches). Reported weights range from about 10,000 lb (US Air Force museum) to 10,300 lb (Sublette) and 10,800 lb (National Museum of Nuclear Science & History).',
        sourceIds: [AHF2, SUBLETTE_US, NMUSAF_FM],
      },
      {
        question: 'How much did Fat Man weigh?',
        answer:
          'Published figures differ: about 10,000 lb per the National Museum of the US Air Force, 10,300 lb per Carey Sublette\'s specification table, and 10,800 lb per the National Museum of Nuclear Science & History. The spread reflects different source documents rather than different bombs.',
        sourceIds: [NMUSAF_FM, SUBLETTE_US, AHF2],
      },
      {
        question: 'How powerful was Fat Man?',
        answer:
          'Fat Man had a yield of 21 kilotons, or 21,000 tons of TNT equivalent, according to DOE/NV-209. That is about 40% more than the 15-kiloton Hiroshima bomb, although Nagasaki\'s hilly terrain limited the area actually destroyed.',
        sourceIds: [DOE],
      },
      {
        question: 'What was Fat Man made of?',
        answer:
          'Fat Man was an implosion-type plutonium weapon: a plutonium core compressed by surrounding high explosives. That is the one-phrase description given by the National Museum of the US Air Force; this page carries no internal design detail.',
        sourceIds: [NMUSAF_FM],
      },
    ],
    sourceIds: [NAGASAKI, NPS, NASM, RERF, AHF2, SUBLETTE_US, NMUSAF_FM, DOE, 'nagasaki-city-events-leading-up-to-atomic-bombin', 'effects-fireball', 'effects-blast-thermal'],
  },

  'tsar-bomba': {
    sections: [
      {
        heading: 'Where and when Tsar Bomba was tested',
        body: [
          {
            type: 'p',
            text: 'Tsar Bomba was detonated at 11:32 Moscow time on 30 October 1961 at the Mityushikha Bay test site on the west coast of Novaya Zemlya, test field D-2 near Cape Sukhoy Nos. {{c:nuclear-weapon-archive-the-soviet-weapons-progra;atomic-heritage-foundation-national-museum-of-nu}} It was dropped by a Tu-95V bomber flown by Major Andrei Durnovtsev {{c:atomic-heritage-foundation-national-museum-of-nu}} (Sublette designates the carrier aircraft a Tu-95N). {{c:nuclear-weapon-archive-the-soviet-weapons-progra}} Released from 10,500 m on a parachute, the bomb burst at about 4,000 m. {{c:nuclear-weapon-archive-the-soviet-weapons-progra}}',
          },
          {
            type: 'p',
            text: 'The bomb was about 8 m long and 2.1 m in diameter and weighed roughly 27 tonnes (sources give a 24.5–27.5 tonne range). {{c:nuclear-weapon-archive-the-soviet-weapons-progra}} The device tested at 50 megatons against a 100-megaton design; for the test a lead tamper replaced the uranium one, roughly halving the yield. {{c:the-national-wwii-museum-tsar-bomba-the-largest;atomic-heritage-foundation-national-museum-of-nu}} For the full story of the test, the flash, the shock wave and the mushroom cloud, see [Tsar Bomba: The Largest Nuclear Test Ever](/blog/tsar-bomba-largest-test-ever).',
          },
        ],
      },
    ],
    faq: [],
    sourceIds: [SUBLETTE_USSR, AHF_TSAR, NWW2M],
  },
}
