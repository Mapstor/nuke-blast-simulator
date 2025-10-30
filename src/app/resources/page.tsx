import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Peace & Education Resources - Nuclear Disarmament Organizations',
  description: 'Educational resources and organizations working toward nuclear disarmament and peace. Links to advocacy groups, research institutes, and educational materials.'
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-400">Peace & Education Resources</h1>
        
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Working Toward a Nuclear-Weapon-Free World</h2>
          <p className="text-green-300 text-lg">
            These organizations, treaties, and educational resources support nuclear disarmament, 
            humanitarian advocacy, and peace education. Knowledge leads to action.
          </p>
        </div>

        {/* International Treaties and Frameworks */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">International Treaties & Frameworks</h2>
          <div className="grid md:grid-cols-2 gap-6">
            
            <div className="bg-black/50 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">🌍 Treaty on the Prohibition of Nuclear Weapons (TPNW)</h3>
              <p className="text-green-300 mb-3">
                The first legally binding international agreement to comprehensively prohibit nuclear weapons.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                <li>Entered into force: January 22, 2021</li>
                <li>122 countries voted to adopt (2017)</li>
                <li>69+ countries have signed, 50+ ratified</li>
                <li>Prohibits development, testing, production, stockpiling</li>
              </ul>
              <div className="mt-4">
                <a href="https://www.icanw.org/the_treaty" 
                   className="text-blue-400 hover:underline text-sm"
                   target="_blank" rel="noopener noreferrer">
                  Learn more about TPNW →
                </a>
              </div>
            </div>

            <div className="bg-black/50 border border-orange-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-orange-400">⚖️ International Court of Justice Advisory Opinion</h3>
              <p className="text-green-300 mb-3">
                1996 landmark ruling on the legality of nuclear weapons.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                <li>Use or threat of nuclear weapons generally illegal</li>
                <li>Violates international humanitarian law</li>
                <li>Obligation to pursue disarmament negotiations</li>
                <li>Foundation for TPNW legal framework</li>
              </ul>
              <div className="mt-4">
                <a href="https://www.icj-cij.org/en/case/95" 
                   className="text-orange-400 hover:underline text-sm"
                   target="_blank" rel="noopener noreferrer">
                  Read ICJ Advisory Opinion →
                </a>
              </div>
            </div>

            <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">📋 Nuclear Non-Proliferation Treaty (NPT)</h3>
              <p className="text-green-300 mb-3">
                1970 treaty to prevent spread of nuclear weapons and achieve disarmament.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                <li>191 countries are parties (nearly universal)</li>
                <li>Three pillars: non-proliferation, disarmament, peaceful use</li>
                <li>Article VI: obligation to pursue disarmament</li>
                <li>Review conferences every 5 years</li>
              </ul>
              <div className="mt-4">
                <a href="https://www.un.org/disarmament/wmd/nuclear/npt/" 
                   className="text-purple-400 hover:underline text-sm"
                   target="_blank" rel="noopener noreferrer">
                  UN NPT Information →
                </a>
              </div>
            </div>

            <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-cyan-400">🚫 Comprehensive Test Ban Treaty (CTBT)</h3>
              <p className="text-green-300 mb-3">
                Prohibits all nuclear explosive tests for military or civilian purposes.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                <li>Opened for signature: 1996</li>
                <li>185 countries signed, 178 ratified</li>
                <li>Not yet in force (needs 8 more Annex 2 states)</li>
                <li>Global monitoring system operational</li>
              </ul>
              <div className="mt-4">
                <a href="https://www.ctbto.org/" 
                   className="text-cyan-400 hover:underline text-sm"
                   target="_blank" rel="noopener noreferrer">
                  CTBT Organization →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Major Advocacy Organizations */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Nuclear Disarmament Organizations</h2>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            
            <div className="bg-black/50 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-red-400">🚫 International Campaign to Abolish Nuclear Weapons (ICAN)</h3>
              <p className="text-green-300 mb-3 text-sm">
                2017 Nobel Peace Prize winner. Coalition of NGOs promoting TPNW.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-xs">
                <li>Led campaign for Treaty on Prohibition</li>
                <li>600+ partner organizations worldwide</li>
                <li>Youth advocacy and education programs</li>
              </ul>
              <div className="mt-3">
                <a href="https://www.icanw.org/" 
                   className="text-red-400 hover:underline text-xs"
                   target="_blank" rel="noopener noreferrer">
                  icanw.org →
                </a>
              </div>
            </div>

            <div className="bg-black/50 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">🏥 International Committee of the Red Cross (ICRC)</h3>
              <p className="text-green-300 mb-3 text-sm">
                Humanitarian perspective on nuclear weapons consequences.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-xs">
                <li>Medical and humanitarian advocacy</li>
                <li>Research on nuclear weapons effects</li>
                <li>Emergency response expertise</li>
              </ul>
              <div className="mt-3">
                <a href="https://www.icrc.org/en/nuclear-weapons" 
                   className="text-blue-400 hover:underline text-xs"
                   target="_blank" rel="noopener noreferrer">
                  ICRC Nuclear Weapons →
                </a>
              </div>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-green-400">☮️ Mayors for Peace</h3>
              <p className="text-green-300 mb-3 text-sm">
                8,000+ cities worldwide working for nuclear abolition.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-xs">
                <li>Led by Hiroshima and Nagasaki mayors</li>
                <li>Local government nuclear policy advocacy</li>
                <li>Peace education initiatives</li>
              </ul>
              <div className="mt-3">
                <a href="http://www.mayorsforpeace.org/" 
                   className="text-green-400 hover:underline text-xs"
                   target="_blank" rel="noopener noreferrer">
                  mayorsforpeace.org →
                </a>
              </div>
            </div>

            <div className="bg-black/50 border border-yellow-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-yellow-400">🕊️ Peace Action</h3>
              <p className="text-green-300 mb-3 text-sm">
                Largest peace organization in the United States.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-xs">
                <li>Nuclear policy advocacy and lobbying</li>
                <li>Grassroots organizing</li>
                <li>Congressional action alerts</li>
              </ul>
              <div className="mt-3">
                <a href="https://www.peaceaction.org/" 
                   className="text-yellow-400 hover:underline text-xs"
                   target="_blank" rel="noopener noreferrer">
                  peaceaction.org →
                </a>
              </div>
            </div>

            <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">🌏 Asia-Pacific Leadership Network (APLN)</h3>
              <p className="text-green-300 mb-3 text-sm">
                Former leaders and experts promoting nuclear disarmament in Asia-Pacific.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-xs">
                <li>High-level policy dialogue</li>
                <li>Regional security expertise</li>
                <li>Nuclear risk reduction advocacy</li>
              </ul>
              <div className="mt-3">
                <a href="https://www.apln.network/" 
                   className="text-purple-400 hover:underline text-xs"
                   target="_blank" rel="noopener noreferrer">
                  apln.network →
                </a>
              </div>
            </div>

            <div className="bg-black/50 border border-orange-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-orange-400">🎓 Nuclear Threat Initiative (NTI)</h3>
              <p className="text-green-300 mb-3 text-sm">
                Bipartisan organization working to reduce nuclear threats.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-xs">
                <li>Policy research and analysis</li>
                <li>Nuclear security initiatives</li>
                <li>Expert dialogue and education</li>
              </ul>
              <div className="mt-3">
                <a href="https://www.nti.org/" 
                   className="text-orange-400 hover:underline text-xs"
                   target="_blank" rel="noopener noreferrer">
                  nti.org →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Research and Policy Institutes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Research & Policy Institutes</h2>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            
            <div className="bg-black/50 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">📊 Stockholm International Peace Research Institute (SIPRI)</h3>
              <p className="text-green-300 mb-3 text-sm">
                Independent research on peace, security, and arms control.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-xs">
                <li>Annual nuclear forces data</li>
                <li>Arms control verification research</li>
                <li>Peace and conflict analysis</li>
              </ul>
              <div className="mt-3">
                <a href="https://www.sipri.org/" 
                   className="text-blue-400 hover:underline text-xs"
                   target="_blank" rel="noopener noreferrer">
                  sipri.org →
                </a>
              </div>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-green-400">🔬 Federation of American Scientists (FAS)</h3>
              <p className="text-green-300 mb-3 text-sm">
                Science-based analysis of nuclear weapons and security policy.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-xs">
                <li>Nuclear Notebook series</li>
                <li>Declassified document analysis</li>
                <li>Policy recommendations</li>
              </ul>
              <div className="mt-3">
                <a href="https://fas.org/" 
                   className="text-green-400 hover:underline text-xs"
                   target="_blank" rel="noopener noreferrer">
                  fas.org →
                </a>
              </div>
            </div>

            <div className="bg-black/50 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-red-400">📰 Bulletin of the Atomic Scientists</h3>
              <p className="text-green-300 mb-3 text-sm">
                Keeper of the Doomsday Clock, analyzing nuclear risks.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-xs">
                <li>Doomsday Clock updates</li>
                <li>Nuclear policy analysis</li>
                <li>Climate and technology risks</li>
              </ul>
              <div className="mt-3">
                <a href="https://thebulletin.org/" 
                   className="text-red-400 hover:underline text-xs"
                   target="_blank" rel="noopener noreferrer">
                  thebulletin.org →
                </a>
              </div>
            </div>

            <div className="bg-black/50 border border-yellow-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-yellow-400">🏛️ Carnegie Endowment for International Peace</h3>
              <p className="text-green-300 mb-3 text-sm">
                Global policy research on nuclear nonproliferation.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-xs">
                <li>Nuclear policy analysis</li>
                <li>Regional security studies</li>
                <li>Multilateral diplomacy research</li>
              </ul>
              <div className="mt-3">
                <a href="https://carnegieendowment.org/" 
                   className="text-yellow-400 hover:underline text-xs"
                   target="_blank" rel="noopener noreferrer">
                  carnegieendowment.org →
                </a>
              </div>
            </div>

            <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">🌐 United Nations Institute for Disarmament Research (UNIDIR)</h3>
              <p className="text-green-300 mb-3 text-sm">
                UN think tank on disarmament and security issues.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-xs">
                <li>Multilateral disarmament research</li>
                <li>Policy dialogue facilitation</li>
                <li>Emerging technology analysis</li>
              </ul>
              <div className="mt-3">
                <a href="https://unidir.org/" 
                   className="text-purple-400 hover:underline text-xs"
                   target="_blank" rel="noopener noreferrer">
                  unidir.org →
                </a>
              </div>
            </div>

            <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">🏫 Harvard Kennedy School Belfer Center</h3>
              <p className="text-green-300 mb-3 text-sm">
                Academic research on nuclear policy and security.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-xs">
                <li>Nuclear security research</li>
                <li>Policy recommendations</li>
                <li>Next-generation training</li>
              </ul>
              <div className="mt-3">
                <a href="https://www.belfercenter.org/" 
                   className="text-cyan-400 hover:underline text-xs"
                   target="_blank" rel="noopener noreferrer">
                  belfercenter.org →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Educational Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Educational Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-green-400">📚 Academic Courses & Materials</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">🎓 Nuclear Studies Programs</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>Middlebury Institute (James Martin Center)</li>
                    <li>Stanford Center for International Security</li>
                    <li>Georgetown Security Studies Program</li>
                    <li>King's College London War Studies</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">📖 Key Textbooks</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>"The Effects of Nuclear Weapons" - Glasstone & Dolan</li>
                    <li>"Nuclear Weapons: The Ultimate Emergency" - Lifton & Falk</li>
                    <li>"The Logic of Nuclear Terror" - Freedman</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">🎥 Documentary Resources</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">🎬 Essential Documentaries</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>"The Day After Trinity" (1981)</li>
                    <li>"Nuclear Nightmare" (1979)</li>
                    <li>"The Bomb" (2015 - BBC)</li>
                    <li>"Countdown to Zero" (2010)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">📺 Educational Series</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>"Chernobyl" (HBO, 2019)</li>
                    <li>"Nuclear Age" (PBS, 1989)</li>
                    <li>"Atomic Cafe" (1982)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">🏛️ Museums & Memorials</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-orange-400">Hiroshima Peace Memorial Museum</span>
                  <p className="text-green-300 text-sm">Hiroshima, Japan - Primary source materials and survivor testimonies</p>
                </div>
                <div>
                  <span className="font-semibold text-orange-400">Nagasaki Atomic Bomb Museum</span>
                  <p className="text-green-300 text-sm">Nagasaki, Japan - Second atomic bombing history and effects</p>
                </div>
                <div>
                  <span className="font-semibold text-orange-400">National Museum of Nuclear Science</span>
                  <p className="text-green-300 text-sm">Albuquerque, USA - Nuclear technology and policy education</p>
                </div>
                <div>
                  <span className="font-semibold text-orange-400">Nevada National Security Site</span>
                  <p className="text-green-300 text-sm">Nevada, USA - Nuclear testing history tours</p>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-400">🌐 Online Educational Tools</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-yellow-400">NUKEMAP by Alex Wellerstein</span>
                  <p className="text-green-300 text-sm">Interactive nuclear weapons effects simulator</p>
                </div>
                <div>
                  <span className="font-semibold text-yellow-400">Atomic Heritage Foundation</span>
                  <p className="text-green-300 text-sm">Manhattan Project and nuclear history resources</p>
                </div>
                <div>
                  <span className="font-semibold text-yellow-400">Nuclear Files (Nuclear Age Peace Foundation)</span>
                  <p className="text-green-300 text-sm">Comprehensive nuclear weapons history archive</p>
                </div>
                <div>
                  <span className="font-semibold text-yellow-400">Global Zero Educational Materials</span>
                  <p className="text-green-300 text-sm">Nuclear policy curriculum and teaching resources</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Youth and Student Organizations */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Youth & Student Organizations</h2>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            
            <div className="bg-black/50 border border-yellow-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-yellow-400">🎓 ICAN Youth</h3>
              <p className="text-green-300 mb-3 text-sm">
                Young campaigners working for nuclear abolition worldwide.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-xs">
                <li>Student organizing and advocacy</li>
                <li>Educational workshops</li>
                <li>Social media campaigns</li>
              </ul>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-green-400">🌱 Nuclear Age Peace Foundation (Youth)</h3>
              <p className="text-green-300 mb-3 text-sm">
                Youth education and engagement on nuclear issues.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-xs">
                <li>Peace leadership training</li>
                <li>Essay contests and scholarships</li>
                <li>Model UN nuclear simulations</li>
              </ul>
            </div>

            <div className="bg-black/50 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">🔗 Students for Nuclear Disarmament</h3>
              <p className="text-green-300 mb-3 text-sm">
                Campus-based advocacy for nuclear disarmament policies.
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-xs">
                <li>University divestment campaigns</li>
                <li>Speaker series and events</li>
                <li>Policy research projects</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Take Action */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Take Action</h2>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-400">How You Can Make a Difference</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-yellow-400 mb-3">🗳️ Political Action</h4>
                <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                  <li>Contact representatives about nuclear policy</li>
                  <li>Support candidates who favor disarmament</li>
                  <li>Advocate for TPNW ratification in your country</li>
                  <li>Join local peace organizations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-3">📚 Education & Awareness</h4>
                <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                  <li>Share educational resources with others</li>
                  <li>Organize campus or community events</li>
                  <li>Support nuclear education in schools</li>
                  <li>Use social media for awareness campaigns</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-3">💰 Financial Support</h4>
                <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                  <li>Donate to disarmament organizations</li>
                  <li>Divest from nuclear weapons companies</li>
                  <li>Support peace research funding</li>
                  <li>Fund educational initiatives</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-3">🤝 Community Building</h4>
                <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                  <li>Start or join local peace groups</li>
                  <li>Participate in commemorative events</li>
                  <li>Build interfaith peace coalitions</li>
                  <li>Connect with international partners</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 text-center bg-black/30 rounded p-4">
              <p className="text-green-300 text-lg font-semibold mb-2">
                "The unleashed power of the atom has changed everything save our modes of thinking, 
                and we thus drift toward unparalleled catastrophe."
              </p>
              <p className="text-green-400">- Albert Einstein</p>
              <p className="text-green-300 mt-4">
                Education leads to understanding. Understanding leads to action. Action leads to change.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}