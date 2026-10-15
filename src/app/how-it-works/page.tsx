import { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  faqPageSchema,
  breadcrumbSchema,
  SITE_URL,
} from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'How It Works - Nuke Blast Simulator Guide',
  description: 'How to use the nuclear blast simulator to see the fireball, blast and thermal radii of nuclear weapons on any location worldwide.',
  alternates: { canonical: '/how-it-works' },
}

const steps = [
  {
    name: 'Select a Nuclear Weapon',
    text: 'Choose from the database of historical and modern nuclear weapons, from the 15-kiloton Little Boy (Hiroshima) to the 50-megaton Tsar Bomba (largest test ever). You can also pick "Custom Yield" to set any explosive power between 1 and 100,000 kilotons.',
  },
  {
    name: 'Click on the Map',
    text: 'Click anywhere on the interactive world map to set your detonation point. Pan and zoom to any location worldwide.',
  },
  {
    name: 'View Effect Radii',
    text: 'Color-coded effect zones appear instantly: yellow fireball, red 20 psi severe blast, orange 5 psi moderate blast, gray 1 psi light blast, magenta 3rd-degree thermal burn radius, pink 2nd-degree burn radius.',
  },
  {
    name: 'Read the Results Panel',
    text: 'The results panel lists each effect radius for an air burst at optimum height. Radii are computed from published scaling laws (Glasstone & Dolan, "The Effects of Nuclear Weapons"). Casualty and fallout figures are not shown pending a verified model.',
  },
]

const faqEntries = [
  {
    question: 'How accurate are the nuclear blast calculations in this simulator?',
    answer:
      'Radii are computed from declassified nuclear testing data and published scaling laws (Glasstone & Dolan 1977 and the effects scaling table). They are simplified for public use and assume an air burst at optimum height. They should not be used for operational or emergency planning.',
  },
  {
    question: 'Why does the simulator not show radioactive fallout patterns?',
    answer:
      'Fallout is not shown at present. Accurate fallout depends heavily on weather, wind direction and burst height, and the previous simplified fallout radius was unverified. Fallout will return only once a validated model is in place.',
  },
  {
    question: 'Can I use this nuclear blast simulator for emergency planning?',
    answer:
      'No. This is an educational tool only. For real emergency planning, consult official government resources, FEMA, and emergency management agencies in your area.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-howto"
        schema={[
          faqPageSchema(faqEntries),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'How It Works', url: '/how-it-works' },
          ]),
        ]}
      />

      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-400">How to Use the Nuclear Blast Simulator</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Step-by-Step Guide</h2>

          <ol className="space-y-6 list-none">
            {steps.map((step, i) => (
              <li key={step.name} className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-start">
                  <span className="bg-green-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-yellow-400">{step.name}</h3>
                    <p className="text-green-300">{step.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Understanding the Effect Zones</h2>

          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 space-y-4">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full mr-3 shrink-0" style={{ backgroundColor: '#ffff00' }} />
              <div>
                <span className="font-semibold text-yellow-400">Fireball:</span>
                <span className="text-green-300 ml-2">Complete vaporization zone.</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full mr-3 shrink-0" style={{ backgroundColor: '#ff0000' }} />
              <div>
                <span className="font-semibold text-red-400">Severe Blast (20 psi):</span>
                <span className="text-green-300 ml-2">Reinforced concrete buildings destroyed.</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full mr-3 shrink-0" style={{ backgroundColor: '#ff8800' }} />
              <div>
                <span className="font-semibold text-orange-400">Moderate Blast (5 psi):</span>
                <span className="text-green-300 ml-2">Most residential buildings collapse.</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full mr-3 shrink-0" style={{ backgroundColor: '#808080' }} />
              <div>
                <span className="font-semibold text-gray-300">Light Blast (1 psi):</span>
                <span className="text-green-300 ml-2">Windows shatter; debris injuries.</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full mr-3 shrink-0" style={{ backgroundColor: '#ff00ff' }} />
              <div>
                <span className="font-semibold text-pink-400">3rd Degree Burns:</span>
                <span className="text-green-300 ml-2">Severe thermal burns requiring immediate medical care.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Key Features</h2>

          <ul className="bg-black/50 border border-green-500/30 rounded-lg p-6 list-disc list-inside space-y-2 text-green-300">
            <li>Effect radii computed from published scaling laws</li>
            <li>Interactive map with global coverage (Mapbox)</li>
            <li>Fireball, blast overpressure and thermal burn zones (air burst at optimum height)</li>
            <li>Database of historical and modern nuclear weapons</li>
            <li>Custom yield input for hypothetical scenarios</li>
            <li>Mobile-responsive design for phones, tablets, and desktops</li>
            <li>Shareable URLs that re-create your simulation</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Educational Purpose</h2>

          <div className="bg-green-900/20 border-l-4 border-green-400 p-6 rounded-r">
            <p className="text-green-300">
              This simulator is an educational tool. It helps people understand the physical scale of nuclear
              weapon effects by visualizing the radii on a map. See the{' '}
              <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link> page for
              the scaling-law formulas, and the{' '}
              <Link href="/sources" className="text-yellow-400 hover:underline">data sources</Link> page for
              primary references.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {faqEntries.map((entry) => (
              <details key={entry.question} className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                <summary className="font-semibold cursor-pointer text-yellow-400">{entry.question}</summary>
                <p className="mt-3 text-green-300">{entry.answer}</p>
              </details>
            ))}
            <p className="text-sm text-green-300/70 mt-4">
              See the full <Link href="/faq" className="text-yellow-400 hover:underline">FAQ</Link> for more questions.
            </p>
          </div>
        </section>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block bg-green-500 text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition"
          >
            🎯 Try the Simulator
          </Link>
        </div>
      </main>
    </div>
  )
}
