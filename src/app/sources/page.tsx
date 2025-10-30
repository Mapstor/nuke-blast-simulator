import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Sources - Nuclear Effects Research References',
  description: 'Scientific references, declassified studies, and authoritative sources used in our nuclear blast effects calculations and methodology.'
}

export default function SourcesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-400">Data Sources & References</h1>
        
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">Scientific Foundation</h2>
          <p className="text-blue-300 text-lg">
            Our simulator is built on decades of scientific research, declassified government studies, 
            and peer-reviewed academic literature. All sources are publicly available and unclassified.
          </p>
        </div>

        {/* Primary Authoritative Sources */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Primary Authoritative Sources</h2>
          
          <div className="space-y-6">
            <div className="bg-black/50 border border-yellow-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">📖 "The Effects of Nuclear Weapons" (3rd Edition, 1977)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-green-300 mb-3">
                    <strong>Authors:</strong> Samuel Glasstone & Philip J. Dolan<br/>
                    <strong>Publisher:</strong> U.S. Department of Defense & Department of Energy<br/>
                    <strong>Status:</strong> Declassified, public domain
                  </p>
                  <p className="text-green-300 mb-3">
                    The definitive reference on nuclear weapons effects, based on extensive testing data 
                    from 1945-1962. Forms the foundation for our blast radius calculations.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-400 mb-2">Key Formulas Used:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>Fireball radius scaling laws</li>
                    <li>Overpressure vs. distance relationships</li>
                    <li>Thermal radiation energy distribution</li>
                    <li>Nuclear radiation dose calculations</li>
                    <li>Fallout pattern modeling</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 bg-gray-800 rounded p-3">
                <p className="text-gray-300 text-sm">
                  <strong>Citation:</strong> Glasstone, S., & Dolan, P. J. (1977). <em>The Effects of Nuclear Weapons</em> (3rd ed.). 
                  United States Department of Defense and Department of Energy.
                </p>
              </div>
            </div>

            <div className="bg-black/50 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">🏛️ Defense Nuclear Agency Publications</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-green-300 mb-3">
                    Declassified technical reports from U.S. nuclear testing programs, 
                    including Operation Crossroads, Operation Ivy, and atmospheric test series.
                  </p>
                  <h4 className="font-semibold text-orange-400 mb-2">Key Reports:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>DNA-EM-1 "Capabilities of Nuclear Weapons"</li>
                    <li>DNA-EM-2 "Effects of Nuclear Weapons on Electronic Systems"</li>
                    <li>DASA-1251 "Nuclear Weapon Test Effects"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-400 mb-2">Data Contributions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>Blast pressure measurements from actual tests</li>
                    <li>Thermal radiation energy recordings</li>
                    <li>Nuclear radiation dose mapping</li>
                    <li>Structural damage assessments</li>
                    <li>Electromagnetic pulse characteristics</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-400">🏥 Medical and Biological Effects Studies</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-orange-400 mb-2">Hiroshima & Nagasaki Research:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>Atomic Bomb Casualty Commission (ABCC) studies</li>
                    <li>Radiation Effects Research Foundation (RERF)</li>
                    <li>Japanese National Peace Memorial Halls</li>
                    <li>Medical records from 1945-present</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-400 mb-2">International Medical Studies:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>WHO radiation health assessments</li>
                    <li>IAEA nuclear accident analyses</li>
                    <li>International Commission on Radiological Protection (ICRP)</li>
                    <li>National Academy of Sciences BEIR reports</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Government and Military Sources */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Government & Military Sources</h2>
          
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            <div className="bg-black/50 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">🇺🇸 United States</h3>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                <li>U.S. Department of Energy (DOE)</li>
                <li>Defense Threat Reduction Agency (DTRA)</li>
                <li>Los Alamos National Laboratory</li>
                <li>Sandia National Laboratories</li>
                <li>Lawrence Livermore National Laboratory</li>
                <li>Oak Ridge National Laboratory</li>
                <li>Brookhaven National Laboratory</li>
              </ul>
            </div>

            <div className="bg-black/50 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-red-400">🇷🇺 Russia (Declassified Soviet)</h3>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                <li>Russian Federal Nuclear Center</li>
                <li>Kurchatov Institute publications</li>
                <li>Declassified Soviet test data</li>
                <li>Post-Cold War scientific cooperation</li>
                <li>Atmospheric test documentation</li>
                <li>Semipalatinsk Test Site records</li>
                <li>Novaya Zemlya test series data</li>
              </ul>
            </div>

            <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">🇬🇧 United Kingdom</h3>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                <li>Atomic Weapons Establishment (AWE)</li>
                <li>UK National Archives</li>
                <li>Operation Hurricane documentation</li>
                <li>Christmas Island test records</li>
                <li>Monte Bello Islands data</li>
                <li>Royal Navy nuclear testing reports</li>
              </ul>
            </div>

            <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">🇫🇷 France</h3>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                <li>Commissariat à l'énergie atomique (CEA)</li>
                <li>French Ministry of Defense archives</li>
                <li>Sahara atmospheric test data</li>
                <li>Pacific test series documentation</li>
                <li>Mururoa Atoll studies</li>
              </ul>
            </div>

            <div className="bg-black/50 border border-yellow-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-yellow-400">🇨🇳 China</h3>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                <li>China Academy of Engineering Physics</li>
                <li>Lop Nur test site documentation</li>
                <li>Scientific publications from CAEP</li>
                <li>International cooperation data</li>
                <li>Atmospheric test records (1964-1980)</li>
              </ul>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-green-400">🌐 International</h3>
              <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                <li>International Atomic Energy Agency (IAEA)</li>
                <li>Comprehensive Test Ban Treaty Organization</li>
                <li>UN Scientific Committee (UNSCEAR)</li>
                <li>International monitoring networks</li>
                <li>Nuclear accident investigation reports</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Academic and Research Institutions */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Academic & Research Institutions</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/50 border border-orange-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-orange-400">🎓 Universities & Research Centers</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Nuclear Policy Research:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>Stanford Center for International Security and Cooperation</li>
                    <li>Harvard Kennedy School Belfer Center</li>
                    <li>Georgetown Security Studies Program</li>
                    <li>Middlebury Institute (James Martin Center)</li>
                    <li>Princeton Program on Science and Global Security</li>
                    <li>University of Chicago Harris School</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Scientific Research:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>MIT Nuclear Science and Engineering</li>
                    <li>UC Berkeley Nuclear Engineering</li>
                    <li>University of Michigan Nuclear Engineering</li>
                    <li>Georgia Tech Nuclear and Radiological Engineering</li>
                    <li>Penn State Mechanical and Nuclear Engineering</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">📊 Independent Research Organizations</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Policy Analysis:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>Federation of American Scientists (FAS)</li>
                    <li>Stockholm International Peace Research Institute (SIPRI)</li>
                    <li>Carnegie Endowment for International Peace</li>
                    <li>Brookings Institution</li>
                    <li>RAND Corporation</li>
                    <li>Arms Control Association</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Scientific Analysis:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>Natural Resources Defense Council (NRDC)</li>
                    <li>Union of Concerned Scientists</li>
                    <li>Bulletin of the Atomic Scientists</li>
                    <li>Nuclear Threat Initiative (NTI)</li>
                    <li>International Physicians for Prevention of Nuclear War</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Peer-Reviewed Literature */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Peer-Reviewed Scientific Literature</h2>
          
          <div className="space-y-6">
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-green-400">📑 Key Scientific Journals</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Nuclear Science & Engineering:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>Nuclear Science and Engineering</li>
                    <li>Nuclear Technology</li>
                    <li>Health Physics</li>
                    <li>Radiation Research</li>
                    <li>Journal of Nuclear Materials</li>
                    <li>Nuclear Engineering and Design</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Policy & Security Studies:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>International Security</li>
                    <li>Security Studies</li>
                    <li>Survival: Global Politics and Strategy</li>
                    <li>Nonproliferation Review</li>
                    <li>Contemporary Security Policy</li>
                    <li>Global Governance</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">📈 Foundational Research Papers</h3>
              <div className="space-y-3 text-green-300 text-sm">
                <div>
                  <span className="font-semibold text-yellow-400">Scaling Laws for Nuclear Weapons:</span>
                  <p>Sedov, L. I. (1959). "Similarity and Dimensional Methods in Mechanics" - Foundation for blast scaling relationships</p>
                </div>
                <div>
                  <span className="font-semibold text-yellow-400">Thermal Radiation Effects:</span>
                  <p>Broido, A. & McAlister, A. J. (1965). "Thermal radiation from nuclear detonations in urban environments"</p>
                </div>
                <div>
                  <span className="font-semibold text-yellow-400">Nuclear Radiation Dose:</span>
                  <p>Evans, R. D. (1955). "The Atomic Nucleus" - Fundamental radiation physics and dose calculations</p>
                </div>
                <div>
                  <span className="font-semibold text-yellow-400">Fallout Modeling:</span>
                  <p>List, R. J. (1963). "Smithsonian Meteorological Tables" - Atmospheric dispersion modeling</p>
                </div>
                <div>
                  <span className="font-semibold text-yellow-400">Blast Wave Physics:</span>
                  <p>Brode, H. L. (1955). "Numerical solutions of spherical blast waves" - RAND Corporation technical reports</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Historical Test Data */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Historical Nuclear Test Data</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/50 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-400">🧪 Critical Test Series</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-orange-400 mb-2">U.S. Atmospheric Tests (1945-1962):</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li><strong>Trinity (1945):</strong> First plutonium implosion device</li>
                    <li><strong>Operation Crossroads (1946):</strong> Bikini Atoll underwater/air burst tests</li>
                    <li><strong>Operation Sandstone (1948):</strong> Improved fission designs</li>
                    <li><strong>Operation Greenhouse (1951):</strong> Thermonuclear principles</li>
                    <li><strong>Operation Ivy (1952):</strong> First full-scale hydrogen bomb</li>
                    <li><strong>Operation Castle (1954):</strong> Deliverable H-bomb designs</li>
                    <li><strong>Operation Redwing (1956):</strong> Clean/dirty bomb studies</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-400 mb-2">Soviet Test Series:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li><strong>RDS-1 (1949):</strong> First Soviet nuclear test</li>
                    <li><strong>RDS-37 (1955):</strong> First Soviet hydrogen bomb</li>
                    <li><strong>Tsar Bomba (1961):</strong> Largest nuclear test ever</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-yellow-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">📊 Measurement Techniques</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-orange-400 mb-2">Instrumentation:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>Pressure gauges and blast meters</li>
                    <li>Thermal radiation detectors</li>
                    <li>Nuclear radiation dosimeters</li>
                    <li>High-speed photography</li>
                    <li>Seismic monitoring equipment</li>
                    <li>Electromagnetic pulse sensors</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-400 mb-2">Test Structures:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>Reinforced concrete bunkers</li>
                    <li>Residential building mockups</li>
                    <li>Military vehicle placements</li>
                    <li>Animal exposure studies</li>
                    <li>Agricultural crop testing</li>
                    <li>Communication equipment arrays</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verification and Validation */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Verification & Validation</h2>
          
          <div className="space-y-6">
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-green-400">✅ Cross-Validation Methods</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Historical Comparison:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>Hiroshima and Nagasaki damage patterns</li>
                    <li>Nevada Test Site measurements</li>
                    <li>Pacific Proving Grounds data</li>
                    <li>Bikini Atoll test results</li>
                    <li>Christmas Island test documentation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Modern Simulation:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                    <li>Computer modeling validation</li>
                    <li>Hydrodynamic code verification</li>
                    <li>Monte Carlo radiation transport</li>
                    <li>Computational fluid dynamics</li>
                    <li>Finite element analysis</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">🔍 Uncertainty Analysis</h3>
              <div className="space-y-3 text-green-300">
                <p>
                  <strong className="text-yellow-400">Known Limitations:</strong> Our calculations include inherent uncertainties due to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                  <li><strong>Terrain effects:</strong> Hills, valleys, and urban canyons modify blast patterns</li>
                  <li><strong>Weather conditions:</strong> Wind, humidity, and temperature affect thermal radiation</li>
                  <li><strong>Atmospheric pressure:</strong> Altitude and barometric pressure influence blast waves</li>
                  <li><strong>Weapon design variations:</strong> Efficiency and design details affect yield distribution</li>
                  <li><strong>Measurement precision:</strong> Historical test data has inherent measurement errors</li>
                </ul>
                <p className="mt-3">
                  <strong className="text-yellow-400">Confidence Intervals:</strong> Most calculations have ±20-30% uncertainty bands, 
                  consistent with the precision of historical nuclear test data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Access and Reproducibility */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Data Access & Reproducibility</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">🔓 Open Access Resources</h3>
              <div className="space-y-3">
                <p className="text-green-300 mb-3">
                  All primary sources used in our calculations are publicly available:
                </p>
                <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                  <li><strong>Internet Archive:</strong> Historical government documents</li>
                  <li><strong>Google Scholar:</strong> Peer-reviewed scientific papers</li>
                  <li><strong>OSTI (Office of Scientific and Technical Information):</strong> DOE reports</li>
                  <li><strong>National Archives:</strong> Declassified military documents</li>
                  <li><strong>IAEA Publications:</strong> International standards and data</li>
                  <li><strong>University libraries:</strong> Academic research databases</li>
                </ul>
              </div>
            </div>

            <div className="bg-black/50 border border-orange-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-orange-400">🔬 Reproducible Science</h3>
              <div className="space-y-3">
                <p className="text-green-300 mb-3">
                  Our methodology promotes scientific reproducibility:
                </p>
                <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                  <li><strong>Open formulas:</strong> All equations publicly documented</li>
                  <li><strong>Clear citations:</strong> Full bibliographic references provided</li>
                  <li><strong>Transparent assumptions:</strong> Limitations clearly stated</li>
                  <li><strong>Independent verification:</strong> Results comparable to other tools</li>
                  <li><strong>Educational focus:</strong> Promotes scientific literacy</li>
                </ul>
                <p className="text-green-300 mt-3 text-sm">
                  Researchers and educators are encouraged to verify our methodology using the same sources.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact for Academic Use */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Academic Collaboration</h2>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-400">Research & Educational Partnerships</h3>
            <p className="text-green-300 mb-4">
              We welcome collaboration with researchers, educators, and institutions working on nuclear policy, 
              security studies, and peace education.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">For Researchers:</h4>
                <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                  <li>Access to detailed calculation methodologies</li>
                  <li>Collaboration on model improvements</li>
                  <li>Data sharing for validation studies</li>
                  <li>Joint publication opportunities</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">For Educators:</h4>
                <ul className="list-disc list-inside space-y-1 text-green-300 text-sm">
                  <li>Curriculum integration support</li>
                  <li>Classroom demonstration materials</li>
                  <li>Student research project guidance</li>
                  <li>Peace education resources</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-green-400 font-semibold text-lg">📧 info@nukeblastsimulator.com</p>
              <p className="text-green-300 text-sm">Academic inquiries welcome • Scientific integrity • Educational mission</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}