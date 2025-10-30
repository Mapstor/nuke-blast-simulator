import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How It Works - Nuclear Blast Simulator Guide',
  description: 'Learn how to use the nuclear blast simulator to understand the devastating effects of nuclear weapons on any location worldwide.'
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-900 text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold hover:text-gray-300">
            NukeBlastSimulator.com
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="hover:text-gray-300">Simulator</Link>
            <Link href="/how-it-works" className="text-gray-300">How It Works</Link>
            <Link href="/methodology" className="hover:text-gray-300">Methodology</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">How to Use the Nuclear Blast Simulator</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Step-by-Step Guide</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">1</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Select a Nuclear Weapon</h3>
                  <p className="text-gray-700">
                    Choose from our database of 30+ historical and modern nuclear weapons, ranging from the 
                    15-kiloton Little Boy to the massive 50-megaton Tsar Bomba. You can also select "Custom Yield" 
                    to input any explosive power.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">2</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Click on the Map</h3>
                  <p className="text-gray-700">
                    Click anywhere on the interactive map to set your detonation point. The map uses OpenStreetMap 
                    data and allows you to zoom in/out and pan to any location worldwide.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">3</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">View Blast Effects</h3>
                  <p className="text-gray-700">
                    Instantly see color-coded blast zones appear on the map. Each circle represents a different 
                    effect zone with varying levels of destruction and casualties.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">4</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Analyze Results</h3>
                  <p className="text-gray-700">
                    Review detailed casualty estimates and damage assessments in the results panel. Numbers are 
                    calculated based on population density and scientifically-validated damage models.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Understanding the Blast Zones</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-600 rounded-full mr-3"></div>
              <div>
                <span className="font-semibold">Fireball (Red):</span>
                <span className="text-gray-600 ml-2">Complete vaporization. Nothing survives.</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-6 h-6 bg-orange-600 rounded-full mr-3"></div>
              <div>
                <span className="font-semibold">Heavy Blast Damage (Orange):</span>
                <span className="text-gray-600 ml-2">5 PSI overpressure. Most buildings collapse.</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <span className="font-semibold">Moderate Blast Damage (Yellow):</span>
                <span className="text-gray-600 ml-2">1 PSI overpressure. Windows shatter, injuries from debris.</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-6 h-6 bg-purple-600 rounded-full mr-3"></div>
              <div>
                <span className="font-semibold">Thermal Radiation (Purple):</span>
                <span className="text-gray-600 ml-2">3rd degree burns to exposed skin.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Real-time calculations based on weapon yield</li>
            <li>Interactive map with global coverage</li>
            <li>Scientifically accurate blast effect modeling</li>
            <li>Population-based casualty estimates</li>
            <li>Mobile-responsive design for any device</li>
            <li>Database of 30+ historical nuclear weapons</li>
            <li>Custom yield input for hypothetical scenarios</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Educational Purpose</h2>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-gray-700">
              This simulator is designed for educational purposes to help people understand the devastating 
              humanitarian consequences of nuclear weapons. By visualizing the scale of destruction, we hope 
              to contribute to informed discussions about nuclear disarmament and international security.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow-md">
              <summary className="font-semibold cursor-pointer">How accurate are the calculations?</summary>
              <p className="mt-2 text-gray-600">
                Our calculations are based on declassified nuclear testing data and peer-reviewed scientific 
                studies. While simplified for public use, they provide reasonable estimates of blast effects.
              </p>
            </details>
            
            <details className="bg-white rounded-lg p-4 shadow-md">
              <summary className="font-semibold cursor-pointer">Why don't you show radioactive fallout?</summary>
              <p className="mt-2 text-gray-600">
                Fallout patterns are highly dependent on weather conditions and wind patterns, making accurate 
                predictions extremely complex. We show a simplified fallout radius for reference only.
              </p>
            </details>
            
            <details className="bg-white rounded-lg p-4 shadow-md">
              <summary className="font-semibold cursor-pointer">Can I use this for emergency planning?</summary>
              <p className="mt-2 text-gray-600">
                No. This is an educational tool only. For emergency planning, consult official government 
                resources and emergency management agencies in your area.
              </p>
            </details>
          </div>
        </section>

        <div className="text-center mt-12">
          <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            Try the Simulator
          </Link>
        </div>
      </main>
    </div>
  )
}