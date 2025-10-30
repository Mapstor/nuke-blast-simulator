import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nuclear Weapons Database - Historical Arsenal Data',
  description: 'Comprehensive database of nuclear weapons from 1945 to present. Historical yields, countries, and technical specifications for educational purposes.'
}

export default function WeaponsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-400">Nuclear Weapons Database</h1>
        
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-red-400">Historical Educational Data</h2>
          <p className="text-red-300 text-lg">
            This database contains historical information about nuclear weapons for educational purposes only. 
            Data is compiled from declassified sources and public research.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Nuclear Powers Timeline</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-blue-500/30 rounded p-4">
                <h3 className="font-semibold text-blue-400 mb-2">🇺🇸 United States</h3>
                <p className="text-sm text-blue-300">First test: July 16, 1945 (Trinity)</p>
                <p className="text-sm text-blue-300">Peak arsenal: ~31,000 (1967)</p>
                <p className="text-sm text-blue-300">Current: ~5,550</p>
              </div>
              
              <div className="border border-red-500/30 rounded p-4">
                <h3 className="font-semibold text-red-400 mb-2">🇷🇺 Russia (USSR)</h3>
                <p className="text-sm text-red-300">First test: August 29, 1949</p>
                <p className="text-sm text-red-300">Peak arsenal: ~40,000 (1986)</p>
                <p className="text-sm text-red-300">Current: ~6,000</p>
              </div>
              
              <div className="border border-blue-500/30 rounded p-4">
                <h3 className="font-semibold text-blue-400 mb-2">🇬🇧 United Kingdom</h3>
                <p className="text-sm text-blue-300">First test: October 3, 1952</p>
                <p className="text-sm text-blue-300">Peak arsenal: ~520 (1970s)</p>
                <p className="text-sm text-blue-300">Current: ~225</p>
              </div>
              
              <div className="border border-blue-500/30 rounded p-4">
                <h3 className="font-semibold text-blue-400 mb-2">🇫🇷 France</h3>
                <p className="text-sm text-blue-300">First test: February 13, 1960</p>
                <p className="text-sm text-blue-300">Peak arsenal: ~540 (1990s)</p>
                <p className="text-sm text-blue-300">Current: ~290</p>
              </div>
              
              <div className="border border-yellow-500/30 rounded p-4">
                <h3 className="font-semibold text-yellow-400 mb-2">🇨🇳 China</h3>
                <p className="text-sm text-yellow-300">First test: October 16, 1964</p>
                <p className="text-sm text-yellow-300">Estimated current: ~350</p>
                <p className="text-sm text-yellow-300">Rapidly expanding</p>
              </div>
              
              <div className="border border-orange-500/30 rounded p-4">
                <h3 className="font-semibold text-orange-400 mb-2">🇮🇳 India</h3>
                <p className="text-sm text-orange-300">First test: May 18, 1974</p>
                <p className="text-sm text-orange-300">Estimated current: ~160</p>
                <p className="text-sm text-orange-300">Growing arsenal</p>
              </div>
              
              <div className="border border-green-500/30 rounded p-4">
                <h3 className="font-semibold text-green-400 mb-2">🇵🇰 Pakistan</h3>
                <p className="text-sm text-green-300">First test: May 28, 1998</p>
                <p className="text-sm text-green-300">Estimated current: ~165</p>
                <p className="text-sm text-green-300">Fastest growing arsenal</p>
              </div>
              
              <div className="border border-purple-500/30 rounded p-4">
                <h3 className="font-semibold text-purple-400 mb-2">🇰🇵 North Korea</h3>
                <p className="text-sm text-purple-300">First test: October 9, 2006</p>
                <p className="text-sm text-purple-300">Estimated current: ~30-50</p>
                <p className="text-sm text-purple-300">Unverified capabilities</p>
              </div>
              
              <div className="border border-cyan-500/30 rounded p-4">
                <h3 className="font-semibold text-cyan-400 mb-2">🇮🇱 Israel</h3>
                <p className="text-sm text-cyan-300">Undeclared program</p>
                <p className="text-sm text-cyan-300">Estimated: 80-400</p>
                <p className="text-sm text-cyan-300">Neither confirms nor denies</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Historical Weapons by Era</h2>
          
          {/* First Generation (1945-1955) */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">First Generation Nuclear Weapons (1945-1955)</h3>
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-green-500/30">
                      <th className="text-left py-2 text-green-400">Weapon</th>
                      <th className="text-left py-2 text-green-400">Country</th>
                      <th className="text-left py-2 text-green-400">Year</th>
                      <th className="text-left py-2 text-green-400">Yield</th>
                      <th className="text-left py-2 text-green-400">Type</th>
                      <th className="text-left py-2 text-green-400">Historical Use</th>
                    </tr>
                  </thead>
                  <tbody className="text-green-300">
                    <tr className="border-b border-green-500/20">
                      <td className="py-2 font-semibold">Little Boy</td>
                      <td>🇺🇸 United States</td>
                      <td>1945</td>
                      <td className="text-yellow-400">15 kt</td>
                      <td>Gun-type uranium</td>
                      <td className="text-red-400">Hiroshima, August 6, 1945</td>
                    </tr>
                    <tr className="border-b border-green-500/20">
                      <td className="py-2 font-semibold">Fat Man</td>
                      <td>🇺🇸 United States</td>
                      <td>1945</td>
                      <td className="text-yellow-400">21 kt</td>
                      <td>Implosion plutonium</td>
                      <td className="text-red-400">Nagasaki, August 9, 1945</td>
                    </tr>
                    <tr className="border-b border-green-500/20">
                      <td className="py-2 font-semibold">Trinity Test</td>
                      <td>🇺🇸 United States</td>
                      <td>1945</td>
                      <td className="text-yellow-400">22 kt</td>
                      <td>Implosion plutonium</td>
                      <td>First nuclear test, New Mexico</td>
                    </tr>
                    <tr className="border-b border-green-500/20">
                      <td className="py-2 font-semibold">Mark 1 (Little Boy type)</td>
                      <td>🇺🇸 United States</td>
                      <td>1947</td>
                      <td className="text-yellow-400">15 kt</td>
                      <td>Gun-type uranium</td>
                      <td>Stockpile weapon (never used)</td>
                    </tr>
                    <tr className="border-b border-green-500/20">
                      <td className="py-2 font-semibold">RDS-1 "First Lightning"</td>
                      <td>🇷🇺 Soviet Union</td>
                      <td>1949</td>
                      <td className="text-yellow-400">22 kt</td>
                      <td>Implosion plutonium</td>
                      <td>Soviet first nuclear test</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Thermonuclear Era (1950s-1960s) */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">Thermonuclear Era (1950s-1960s)</h3>
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-green-500/30">
                      <th className="text-left py-2 text-green-400">Weapon</th>
                      <th className="text-left py-2 text-green-400">Country</th>
                      <th className="text-left py-2 text-green-400">Year</th>
                      <th className="text-left py-2 text-green-400">Yield</th>
                      <th className="text-left py-2 text-green-400">Type</th>
                      <th className="text-left py-2 text-green-400">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-green-300">
                    <tr className="border-b border-green-500/20">
                      <td className="py-2 font-semibold">Ivy Mike</td>
                      <td>🇺🇸 United States</td>
                      <td>1952</td>
                      <td className="text-red-400">10.4 Mt</td>
                      <td>H-bomb test</td>
                      <td>First thermonuclear device</td>
                    </tr>
                    <tr className="border-b border-green-500/20">
                      <td className="py-2 font-semibold">Castle Bravo</td>
                      <td>🇺🇸 United States</td>
                      <td>1954</td>
                      <td className="text-red-400">15 Mt</td>
                      <td>H-bomb test</td>
                      <td>Largest US nuclear test</td>
                    </tr>
                    <tr className="border-b border-green-500/20">
                      <td className="py-2 font-semibold">RDS-37</td>
                      <td>🇷🇺 Soviet Union</td>
                      <td>1955</td>
                      <td className="text-red-400">1.6 Mt</td>
                      <td>H-bomb test</td>
                      <td>First Soviet thermonuclear</td>
                    </tr>
                    <tr className="border-b border-green-500/20">
                      <td className="py-2 font-semibold">Tsar Bomba</td>
                      <td>🇷🇺 Soviet Union</td>
                      <td>1961</td>
                      <td className="text-red-400">50 Mt</td>
                      <td>H-bomb test</td>
                      <td>Largest nuclear weapon ever tested</td>
                    </tr>
                    <tr className="border-b border-green-500/20">
                      <td className="py-2 font-semibold">W53 Warhead</td>
                      <td>🇺🇸 United States</td>
                      <td>1962</td>
                      <td className="text-red-400">9 Mt</td>
                      <td>ICBM warhead</td>
                      <td>Titan I missile warhead</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modern Era (1970s-Present) */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">Modern Era (1970s-Present)</h3>
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-green-500/30">
                      <th className="text-left py-2 text-green-400">Weapon</th>
                      <th className="text-left py-2 text-green-400">Country</th>
                      <th className="text-left py-2 text-green-400">Year</th>
                      <th className="text-left py-2 text-green-400">Yield</th>
                      <th className="text-left py-2 text-green-400">Delivery</th>
                      <th className="text-left py-2 text-green-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-green-300">
                    <tr className="border-b border-green-500/20">
                      <td className="py-2 font-semibold">W76</td>
                      <td>🇺🇸 United States</td>
                      <td>1978</td>
                      <td className="text-yellow-400">100 kt</td>
                      <td>SLBM (Trident)</td>
                      <td className="text-green-400">Active</td>
                    </tr>
                    <tr className="border-b border-green-500/20">
                      <td className="py-2 font-semibold">W87</td>
                      <td>🇺🇸 United States</td>
                      <td>1986</td>
                      <td className="text-yellow-400">300 kt</td>
                      <td>ICBM (Minuteman III)</td>
                      <td className="text-green-400">Active</td>
                    </tr>
                    <tr className="border-b border-green-500/20">
                      <td className="py-2 font-semibold">B61 (Mod 12)</td>
                      <td>🇺🇸 United States</td>
                      <td>2020</td>
                      <td className="text-yellow-400">0.3-50 kt</td>
                      <td>Gravity bomb</td>
                      <td className="text-green-400">Modern variable yield</td>
                    </tr>
                    <tr className="border-b border-green-500/20">
                      <td className="py-2 font-semibold">R-36M2 "Satan"</td>
                      <td>🇷🇺 Russia</td>
                      <td>1988</td>
                      <td className="text-red-400">20 Mt</td>
                      <td>ICBM</td>
                      <td className="text-orange-400">Being replaced</td>
                    </tr>
                    <tr className="border-b border-green-500/20">
                      <td className="py-2 font-semibold">RS-28 "Sarmat"</td>
                      <td>🇷🇺 Russia</td>
                      <td>2022</td>
                      <td className="text-red-400">10+ Mt</td>
                      <td>Heavy ICBM</td>
                      <td className="text-green-400">New deployment</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Yield Comparison Scale</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span className="text-gray-400">Conventional (TNT): 0.000001 kt</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-4 bg-yellow-500 rounded"></div>
                <span className="text-yellow-400">Tactical Nuclear: 0.1-10 kt</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-4 bg-orange-500 rounded"></div>
                <span className="text-orange-400">Strategic Nuclear: 100-500 kt</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-4 bg-red-500 rounded"></div>
                <span className="text-red-400">Thermonuclear: 1-50+ Mt</span>
              </div>
            </div>
            <p className="mt-4 text-green-300 text-sm">
              1 kiloton (kt) = 1,000 tons of TNT equivalent<br/>
              1 megaton (Mt) = 1,000,000 tons of TNT equivalent
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Data Sources & Methodology</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300">
              This database is compiled from publicly available, declassified sources:
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-300">
              <li>Federation of American Scientists (FAS) Nuclear Notebook</li>
              <li>Stockholm International Peace Research Institute (SIPRI)</li>
              <li>Natural Resources Defense Council (NRDC) Nuclear Database</li>
              <li>Bulletin of the Atomic Scientists</li>
              <li>Declassified U.S. Department of Energy documents</li>
              <li>International nuclear test monitoring organizations</li>
              <li>Peer-reviewed academic research on nuclear weapons</li>
            </ul>
            <div className="mt-6 bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
              <p className="text-yellow-300 font-semibold">
                Note: Yield estimates for classified weapons may vary between sources. 
                This data represents best available unclassified estimates for educational purposes.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Nuclear Testing History</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Total Nuclear Tests</h3>
              <div className="space-y-2 text-green-300">
                <div className="flex justify-between">
                  <span>🇺🇸 United States:</span>
                  <span className="font-semibold">1,032</span>
                </div>
                <div className="flex justify-between">
                  <span>🇷🇺 Soviet Union:</span>
                  <span className="font-semibold">715</span>
                </div>
                <div className="flex justify-between">
                  <span>🇫🇷 France:</span>
                  <span className="font-semibold">210</span>
                </div>
                <div className="flex justify-between">
                  <span>🇬🇧 United Kingdom:</span>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex justify-between">
                  <span>🇨🇳 China:</span>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex justify-between">
                  <span>🇮🇳 India:</span>
                  <span className="font-semibold">6</span>
                </div>
                <div className="flex justify-between">
                  <span>🇵🇰 Pakistan:</span>
                  <span className="font-semibold">6</span>
                </div>
                <div className="flex justify-between">
                  <span>🇰🇵 North Korea:</span>
                  <span className="font-semibold">6</span>
                </div>
                <div className="border-t border-green-500/30 pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-red-400">
                    <span>Total:</span>
                    <span>2,065</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Testing Timeline</h3>
              <div className="space-y-3 text-green-300">
                <div>
                  <div className="font-semibold text-blue-400">Atmospheric Era (1945-1980)</div>
                  <div className="text-sm">543 atmospheric tests</div>
                  <div className="text-sm text-red-300">Massive radioactive fallout</div>
                </div>
                <div>
                  <div className="font-semibold text-green-400">Underground Era (1957-1998)</div>
                  <div className="text-sm">1,522 underground tests</div>
                  <div className="text-sm text-green-300">Reduced environmental impact</div>
                </div>
                <div>
                  <div className="font-semibold text-orange-400">CTBT Era (1996-Present)</div>
                  <div className="text-sm">Comprehensive Test Ban Treaty</div>
                  <div className="text-sm text-orange-300">Moratorium on testing (not fully ratified)</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}