import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions About Nuclear Effects',
  description: 'Common questions about nuclear weapons effects, blast calculations, and the educational purpose of our simulator.'
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-400">Frequently Asked Questions</h1>
        
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Educational Resource</h2>
          <p className="text-green-300 text-lg">
            This FAQ addresses common questions about nuclear weapons effects, our simulator's methodology, 
            and the educational purpose behind this tool.
          </p>
        </div>

        <div className="space-y-8">
          
          {/* General Questions */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-green-400">General Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">What is the purpose of this simulator?</h3>
                <p className="text-green-300 mb-3">
                  This simulator is an educational tool designed to promote understanding of nuclear weapons effects 
                  and support nuclear disarmament efforts. By visualizing the devastating consequences, we aim to 
                  foster informed discussions about nuclear policy and the urgent need for a nuclear-weapon-free world.
                </p>
                <p className="text-green-300">
                  It is <strong className="text-red-400">not</strong> intended for planning attacks, targeting, 
                  or any military purposes.
                </p>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">How accurate are the calculations?</h3>
                <p className="text-green-300 mb-3">
                  Our calculations are based on scientifically validated formulas from "The Effects of Nuclear Weapons" 
                  by Glasstone & Dolan and other declassified research. However, they provide <em>estimates</em> 
                  based on idealized conditions.
                </p>
                <p className="text-green-300">
                  Real-world effects would vary significantly due to terrain, weather, building construction, 
                  and numerous other factors. These are educational approximations, not precise predictions.
                </p>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Who can use this simulator?</h3>
                <p className="text-green-300 mb-3">
                  This simulator is intended for:
                </p>
                <ul className="list-disc list-inside space-y-1 text-green-300">
                  <li>Educators and students (recommended 16+ with supervision)</li>
                  <li>Researchers and academics</li>
                  <li>Journalists and documentary makers</li>
                  <li>Peace advocates and policy makers</li>
                  <li>Anyone seeking to understand nuclear weapons consequences</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Nuclear Effects Questions */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-green-400">Nuclear Effects Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">What's the difference between air burst and surface burst?</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-orange-500/30 rounded p-4">
                    <h4 className="font-semibold text-orange-400 mb-2">Air Burst</h4>
                    <ul className="text-sm text-green-300 space-y-1">
                      <li>• Detonated above ground (optimal altitude)</li>
                      <li>• Maximum blast damage over wide area</li>
                      <li>• Minimal radioactive fallout</li>
                      <li>• Used on Hiroshima and Nagasaki</li>
                      <li>• Preferred for maximum destruction</li>
                    </ul>
                  </div>
                  <div className="border border-red-500/30 rounded p-4">
                    <h4 className="font-semibold text-red-400 mb-2">Surface Burst</h4>
                    <ul className="text-sm text-green-300 space-y-1">
                      <li>• Detonated at ground level</li>
                      <li>• 40-50% reduced blast radius</li>
                      <li>• Massive radioactive fallout plume</li>
                      <li>• Creates large crater</li>
                      <li>• Long-term area contamination</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">What do the colored circles represent?</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ffff00' }}></div>
                    <div>
                      <span className="font-semibold text-yellow-400">Fireball (Yellow):</span>
                      <span className="text-green-300 ml-2">Complete vaporization zone. 100% fatalities. Temperature exceeds 10 million°C.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff0000' }}></div>
                    <div>
                      <span className="font-semibold text-red-400">Severe Blast (Red):</span>
                      <span className="text-green-300 ml-2">20 PSI overpressure. Reinforced concrete destroyed. 50-90% fatalities.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff8800' }}></div>
                    <div>
                      <span className="font-semibold text-orange-400">Moderate Blast (Orange):</span>
                      <span className="text-green-300 ml-2">5 PSI overpressure. Most buildings collapse. 5-50% fatalities.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#808080' }}></div>
                    <div>
                      <span className="font-semibold text-gray-400">Light Blast (Gray):</span>
                      <span className="text-green-300 ml-2">1 PSI overpressure. Windows shatter. 0-5% fatalities.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff00ff' }}></div>
                    <div>
                      <span className="font-semibold text-purple-400">3rd Degree Burns (Magenta):</span>
                      <span className="text-green-300 ml-2">Severe burns requiring immediate medical care. 50-90% fatalities if untreated.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff99ff' }}></div>
                    <div>
                      <span className="font-semibold text-pink-400">2nd Degree Burns (Pink):</span>
                      <span className="text-green-300 ml-2">Painful blistering burns. 0-5% fatalities.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">How do nuclear weapons cause damage?</h3>
                <p className="text-green-300 mb-3">Nuclear weapons cause damage through multiple mechanisms:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-orange-400 mb-2">Immediate Effects (seconds to minutes)</h4>
                    <ul className="text-sm text-green-300 space-y-1">
                      <li>• <strong>Fireball:</strong> Extreme heat vaporizes everything nearby</li>
                      <li>• <strong>Thermal radiation:</strong> Intense heat causes burns and fires</li>
                      <li>• <strong>Nuclear radiation:</strong> Immediate lethal doses</li>
                      <li>• <strong>Electromagnetic pulse (EMP):</strong> Destroys electronics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-400 mb-2">Delayed Effects (minutes to years)</h4>
                    <ul className="text-sm text-green-300 space-y-1">
                      <li>• <strong>Blast wave:</strong> Destroys buildings and causes injuries</li>
                      <li>• <strong>Radioactive fallout:</strong> Contamination lasting years</li>
                      <li>• <strong>Nuclear winter:</strong> Climate effects from fires/dust</li>
                      <li>• <strong>Long-term radiation:</strong> Cancer, genetic damage</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">How long do the effects last?</h3>
                <div className="space-y-3 text-green-300">
                  <div>
                    <span className="font-semibold text-yellow-400">Immediate (0-1 hour):</span>
                    <span className="ml-2">Fireball, thermal radiation, initial nuclear radiation, EMP</span>
                  </div>
                  <div>
                    <span className="font-semibold text-orange-400">Short-term (hours to weeks):</span>
                    <span className="ml-2">Blast effects, radioactive fallout, acute radiation sickness</span>
                  </div>
                  <div>
                    <span className="font-semibold text-red-400">Long-term (months to decades):</span>
                    <span className="ml-2">Residual radiation, cancer, genetic effects, environmental damage</span>
                  </div>
                  <div>
                    <span className="font-semibold text-purple-400">Generational (decades to centuries):</span>
                    <span className="ml-2">Soil contamination, genetic damage, psychological trauma</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Questions */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-green-400">Technical Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">What does "yield" mean?</h3>
                <p className="text-green-300 mb-3">
                  Yield refers to the amount of energy released by a nuclear weapon, measured in equivalent 
                  tons of TNT explosive:
                </p>
                <ul className="list-disc list-inside space-y-1 text-green-300">
                  <li><strong>1 kiloton (kt)</strong> = 1,000 tons of TNT</li>
                  <li><strong>1 megaton (Mt)</strong> = 1,000,000 tons of TNT</li>
                  <li><strong>Hiroshima bomb:</strong> ~15 kt</li>
                  <li><strong>Modern strategic weapon:</strong> 100-500 kt</li>
                  <li><strong>Largest ever tested (Tsar Bomba):</strong> 50 Mt</li>
                </ul>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">How are blast radii calculated?</h3>
                <p className="text-green-300 mb-3">
                  We use scientifically validated scaling laws based on weapon yield:
                </p>
                <div className="bg-gray-800 rounded p-4 font-mono text-sm">
                  <div className="text-yellow-400">Fireball radius = 0.145 × Yield^0.4 km</div>
                  <div className="text-red-400">Severe blast = 0.482 × Yield^0.33 km</div>
                  <div className="text-orange-400">Moderate blast = 1.03 × Yield^0.33 km</div>
                  <div className="text-gray-400">Light blast = 2.93 × Yield^0.33 km</div>
                  <div className="text-purple-400">Thermal burns = 0.67 × Yield^0.41 km</div>
                </div>
                <p className="text-green-300 mt-3 text-sm">
                  These formulas are derived from extensive nuclear testing data and validated against 
                  historical weapons.
                </p>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Why don't you show casualty numbers?</h3>
                <p className="text-green-300 mb-3">
                  We focus on physical effects rather than specific casualty estimates because:
                </p>
                <ul className="list-disc list-inside space-y-1 text-green-300">
                  <li>Population density varies enormously by location and time</li>
                  <li>Casualty rates depend on warning time, shelter, medical care</li>
                  <li>We want to emphasize the humanitarian consequences conceptually</li>
                  <li>Specific numbers might be misused or misinterpreted</li>
                  <li>The focus should be on prevention, not casualty counting</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Safety and Legal Questions */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-green-400">Safety and Legal Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-red-400">Is this simulator dangerous or illegal?</h3>
                <p className="text-red-300 mb-3">
                  No. This simulator is completely legal and safe:
                </p>
                <ul className="list-disc list-inside space-y-1 text-red-300">
                  <li>All information is based on publicly available, declassified sources</li>
                  <li>No classified or sensitive information is disclosed</li>
                  <li>It cannot be used to build weapons or plan attacks</li>
                  <li>Educational use of nuclear effects data is protected speech</li>
                  <li>Similar tools exist in academic and policy research</li>
                </ul>
                <p className="text-red-300 mt-3">
                  However, <strong>misuse for threats, targeting, or planning violence is strictly prohibited</strong> 
                  and will be reported to authorities.
                </p>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Do you collect data about my simulations?</h3>
                <p className="text-green-300 mb-3">
                  <strong>No.</strong> We prioritize your privacy:
                </p>
                <ul className="list-disc list-inside space-y-1 text-green-300">
                  <li>All calculations run locally in your browser</li>
                  <li>No weapon selections or locations are transmitted to our servers</li>
                  <li>We don't track what you simulate or where you place weapons</li>
                  <li>No user accounts, registration, or personal data collection</li>
                  <li>Standard web server logs only (IP addresses, not simulation data)</li>
                </ul>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Can I use this for my research/classroom?</h3>
                <p className="text-green-300 mb-3">
                  Yes! Educational and research use is encouraged:
                </p>
                <ul className="list-disc list-inside space-y-1 text-green-300">
                  <li>Free to use for educational purposes</li>
                  <li>No registration or permission required</li>
                  <li>Screenshots and data can be used in academic work</li>
                  <li>Please cite our methodology and data sources</li>
                  <li>Contact us for formal educational partnerships</li>
                </ul>
                <p className="text-green-300 mt-3">
                  We recommend adult supervision for users under 18 due to the mature subject matter.
                </p>
              </div>
            </div>
          </section>

          {/* Still Have Questions */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-green-400">Still Have Questions?</h2>
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
              <p className="text-green-300 mb-4">
                We welcome questions, feedback, and educational collaboration:
              </p>
              <div className="text-center">
                <p className="text-green-400 font-semibold text-lg mb-2">📧 info@nukeblastsimulator.com</p>
                <p className="text-green-300 text-sm">
                  Educational inquiries typically receive responses within 2-3 business days
                </p>
              </div>
              <div className="mt-6 grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">📚</div>
                  <div className="text-sm text-green-300">Educational Support</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">🔬</div>
                  <div className="text-sm text-green-300">Research Collaboration</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">🕊️</div>
                  <div className="text-sm text-green-300">Peace Advocacy</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}