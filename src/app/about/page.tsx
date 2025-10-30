import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - Educational Nuclear Blast Simulator',
  description: 'Learn about the educational purpose and scientific mission behind our nuclear blast effects simulator. Promoting nuclear awareness and disarmament through education.'
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-400">About Nuclear Blast Simulator</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Educational Mission</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 mb-6">
            <p className="mb-4 text-green-300 text-lg">
              Our nuclear blast simulator serves as an educational tool to promote understanding of nuclear weapons effects 
              and support global nuclear disarmament efforts.
            </p>
            <p className="mb-4 text-green-300">
              By visualizing the devastating consequences of nuclear weapons, we aim to foster informed discussions 
              about nuclear policy, arms control, and the urgent need for a nuclear-weapon-free world.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Scientific Approach</h2>
          <div className="space-y-6">
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Blast Effects Modeling</h3>
              <p className="text-green-300 mb-3">
                Our calculations are based on declassified scientific research and the authoritative work 
                "The Effects of Nuclear Weapons" by Glasstone & Dolan (U.S. Department of Defense).
              </p>
              <ul className="list-disc list-inside space-y-2 text-green-300">
                <li>Fireball radius and temperature effects</li>
                <li>Air blast overpressure zones (20 PSI, 5 PSI, 1 PSI)</li>
                <li>Thermal radiation burn zones</li>
                <li>Radioactive fallout patterns</li>
              </ul>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Air Burst vs Surface Burst</h3>
              <p className="text-green-300 mb-3">
                The simulator accurately models the critical differences between detonation types:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-orange-500/30 rounded p-4">
                  <h4 className="font-semibold text-orange-400 mb-2">Air Burst</h4>
                  <ul className="text-sm text-green-300 space-y-1">
                    <li>• Maximum blast damage over wide area</li>
                    <li>• Optimal for military targets</li>
                    <li>• Minimal radioactive fallout</li>
                    <li>• Used on Hiroshima and Nagasaki</li>
                  </ul>
                </div>
                <div className="border border-red-500/30 rounded p-4">
                  <h4 className="font-semibold text-red-400 mb-2">Surface Burst</h4>
                  <ul className="text-sm text-green-300 space-y-1">
                    <li>• Reduced blast radius (40-50%)</li>
                    <li>• Massive radioactive fallout plume</li>
                    <li>• Ground shock and crater formation</li>
                    <li>• Long-term area contamination</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Historical Context</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300">
              Since the atomic bombings of Hiroshima and Nagasaki in 1945, the world has lived under the shadow 
              of nuclear weapons. Today, nine nations possess approximately 13,000 nuclear warheads.
            </p>
            <p className="mb-4 text-green-300">
              Our simulator includes historical weapons from the nuclear age, from the first atomic bombs 
              to modern thermonuclear weapons, demonstrating the exponential increase in destructive capability.
            </p>
            <div className="bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="text-yellow-300 font-semibold">
                "The unleashed power of the atom has changed everything save our modes of thinking, 
                and we thus drift toward unparalleled catastrophe." - Albert Einstein
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Limitations & Disclaimers</h2>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-red-400">Important Notice</h3>
            <p className="mb-4 text-green-300">
              This simulator provides estimates based on idealized conditions. Actual nuclear weapon effects 
              would vary significantly based on numerous factors:
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-300">
              <li>Terrain, buildings, and geographic features</li>
              <li>Weather conditions and atmospheric density</li>
              <li>Time of day and population distribution</li>
              <li>Emergency response and medical infrastructure</li>
              <li>Weapon design variations and delivery method</li>
            </ul>
            <p className="mt-4 text-red-300 font-semibold">
              This tool is for educational purposes only and must never be used for planning or targeting.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Call for Nuclear Disarmament</h2>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300 text-lg">
              Knowledge of nuclear weapons effects should inspire action toward a nuclear-weapon-free world.
            </p>
            <p className="mb-4 text-green-300">
              We support international efforts for nuclear disarmament, including the Treaty on the 
              Prohibition of Nuclear Weapons, and organizations working toward nuclear abolition.
            </p>
            <div className="mt-6 text-center">
              <p className="text-green-400 font-semibold text-lg">
                Education • Awareness • Action • Peace
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Data Sources</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <ul className="space-y-3 text-green-300">
              <li>• Glasstone, S., & Dolan, P. J. (1977). <em>The Effects of Nuclear Weapons</em> (3rd ed.)</li>
              <li>• Federation of American Scientists - Nuclear Weapons Database</li>
              <li>• Nuclear Threat Initiative - Research and Analysis</li>
              <li>• Stockholm International Peace Research Institute (SIPRI)</li>
              <li>• Defense Threat Reduction Agency - Nuclear Weapons Effects</li>
              <li>• Oak Ridge National Laboratory - Nuclear Physics Research</li>
              <li>• International Committee of the Red Cross - Nuclear Weapons Reports</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}