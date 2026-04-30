import { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  howToSchema,
  faqPageSchema,
  breadcrumbSchema,
  SITE_URL,
} from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'How It Works - Nuclear Blast Simulator Guide',
  description: 'Learn how to use the nuclear blast simulator to understand the devastating effects of nuclear weapons on any location worldwide.',
  alternates: { canonical: '/how-it-works' }
}

const steps = [
  {
    name: 'Select a Nuclear Weapon',
    text: 'Choose from the database of 45+ historical and modern nuclear weapons, ranging from the 15-kiloton Little Boy (Hiroshima) to the 50-megaton Tsar Bomba (largest test ever). You can also pick "Custom Yield" to set any explosive power between 1 and 100,000 kilotons.',
  },
  {
    name: 'Click on the Map',
    text: 'Click anywhere on the interactive world map to set your detonation point. Pan and zoom to any location worldwide; the map covers every populated area on Earth.',
  },
  {
    name: 'View Blast Effects',
    text: 'Color-coded blast zones appear instantly: yellow fireball, red 20 PSI severe blast, orange 5 PSI moderate blast, gray 1 PSI light blast, magenta 3rd-degree thermal burn radius, pink 2nd-degree burn radius.',
  },
  {
    name: 'Analyze Results',
    text: 'Review casualty estimates and damage assessments in the results panel. Numbers are calculated from local population density and scientifically validated damage models (Glasstone & Dolan, "The Effects of Nuclear Weapons").',
  },
]

const faqEntries = [
  {
    question: 'How accurate are the nuclear blast calculations in this simulator?',
    answer:
      'Calculations are based on declassified nuclear testing data and peer-reviewed scientific studies. They are simplified for public use but provide reasonable estimates of blast effects. They should not be used for operational or emergency planning.',
  },
  {
    question: 'Why does the simulator not show full radioactive fallout patterns?',
    answer:
      'Fallout patterns depend heavily on weather, wind direction, and altitude of detonation, making accurate predictions extremely complex. The simulator shows a simplified fallout radius for reference only — real fallout plumes are elongated downwind and asymmetric.',
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
          howToSchema({
            name: 'How to Use the Nuclear Blast Simulator',
            description:
              'A step-by-step guide to running a nuclear blast simulation, including weapon selection, target placement, and interpreting the resulting effect zones.',
            totalTime: 'PT2M',
            steps,
          }),
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
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Understanding the Blast Zones</h2>

          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 space-y-4">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full mr-3 shrink-0" style={{ backgroundColor: '#ffff00' }} />
              <div>
                <span className="font-semibold text-yellow-400">Fireball:</span>
                <span className="text-green-300 ml-2">Complete vaporization. Temperatures over 10 million°C. 100% fatalities.</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full mr-3 shrink-0" style={{ backgroundColor: '#ff0000' }} />
              <div>
                <span className="font-semibold text-red-400">Severe Blast (20 PSI):</span>
                <span className="text-green-300 ml-2">Reinforced concrete buildings destroyed. 50–90% fatalities.</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full mr-3 shrink-0" style={{ backgroundColor: '#ff8800' }} />
              <div>
                <span className="font-semibold text-orange-400">Moderate Blast (5 PSI):</span>
                <span className="text-green-300 ml-2">Most residential buildings collapse. 5–50% fatalities.</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full mr-3 shrink-0" style={{ backgroundColor: '#808080' }} />
              <div>
                <span className="font-semibold text-gray-300">Light Blast (1 PSI):</span>
                <span className="text-green-300 ml-2">Windows shatter, debris injuries. 0–5% fatalities.</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full mr-3 shrink-0" style={{ backgroundColor: '#ff00ff' }} />
              <div>
                <span className="font-semibold text-pink-400">3rd Degree Burns:</span>
                <span className="text-green-300 ml-2">Severe burns through clothing. 50–90% fatalities without immediate medical care.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Key Features</h2>

          <ul className="bg-black/50 border border-green-500/30 rounded-lg p-6 list-disc list-inside space-y-2 text-green-300">
            <li>Real-time calculations based on weapon yield</li>
            <li>Interactive map with global coverage (OpenStreetMap and Mapbox)</li>
            <li>Scientifically accurate blast effect modeling</li>
            <li>Population-based casualty estimates</li>
            <li>Mobile-responsive design for phones, tablets, and desktops</li>
            <li>Database of 45+ historical and modern nuclear weapons</li>
            <li>Custom yield input for hypothetical scenarios</li>
            <li>Air burst vs. surface burst toggle</li>
            <li>Shareable URLs that re-create your simulation</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Educational Purpose</h2>

          <div className="bg-green-900/20 border-l-4 border-green-400 p-6 rounded-r">
            <p className="text-green-300">
              This simulator is designed for educational purposes to help people understand the devastating
              humanitarian consequences of nuclear weapons. By visualizing the scale of destruction, we hope
              to contribute to informed discussions about nuclear disarmament and international security.
              See the <Link href="/methodology" className="text-yellow-400 hover:underline">methodology</Link> page
              for the scientific formulas, and the <Link href="/sources" className="text-yellow-400 hover:underline">data sources</Link> page
              for primary references.
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
