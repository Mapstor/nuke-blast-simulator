import { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { faqPageSchema, breadcrumbSchema, SITE_URL } from '@/lib/seo/schemas'
import { Cite, Sources, createCitations } from '@/components/seo/Cite'
import { seoMetadata, pageH1 } from '@/lib/seo/pageMeta'

export const metadata: Metadata = seoMetadata('/faq')

// Source of truth for the FAQPage schema. Keep entries in sync with the
// visible Q&A blocks below. Each answer is plain text — Google strips inline
// HTML from FAQ schema answers, so prefer prose here and use the JSX for
// formatting in the visible page.
const faqEntries = [
  {
    question: 'What is the purpose of this simulator?',
    answer:
      'Nuke Blast Simulator is an educational tool for understanding the physical scale of nuclear weapon effects. It visualizes fireball, blast and thermal radii on a map so the numbers are concrete. It is not intended for planning attacks, targeting, or any military purposes.',
  },
  {
    question: 'How accurate are the nuclear blast calculations?',
    answer:
      'The radii come from the scaling laws in The Effects of Nuclear Weapons (Glasstone & Dolan, 1977) and the standard scaling-law table derived from it. They provide estimates based on idealized conditions. Real-world effects vary significantly due to terrain, weather, building construction, and many other factors. These are educational approximations, not precise predictions.',
  },
  {
    question: 'Who can use this nuclear blast simulator?',
    answer:
      'The simulator is intended for educators and students (recommended 16+ with supervision), researchers and academics, journalists and documentary makers, peace advocates and policy makers, and anyone seeking to understand nuclear weapons consequences. It is free, requires no account, and is suitable for classroom use.',
  },
  {
    question: 'What is the difference between an air burst and a surface burst?',
    answer:
      'An air burst is detonated above ground at optimal altitude, producing maximum blast damage over a wide area with minimal radioactive fallout. This is how Hiroshima and Nagasaki were attacked. A surface burst is detonated at ground level; its blast reaches less far than an optimum-height air burst, but it creates heavy radioactive fallout, a large crater, and long-term contamination of the surrounding area.',
  },
  {
    question: 'What do the colored circles on the map represent?',
    answer:
      'Each colored circle is a nuclear weapon effect zone. The fireball (yellow) is the hot, luminous sphere at the burst point. Severe blast (red) is the 20 psi overpressure zone where reinforced concrete is leveled. Moderate blast (orange) is the 5 psi zone where typical homes and lightly built commercial buildings are destroyed. Light blast (gray) is the 1 psi zone where windows shatter. Magenta and pink show third-degree and second-degree thermal burn radii. All radii assume an air burst at optimum height.',
  },
  {
    question: 'How do nuclear weapons cause damage?',
    answer:
      'Nuclear weapons cause damage through multiple mechanisms. Immediate effects (seconds to about a minute) include the fireball, thermal radiation that causes burns and fires, the blast wave that destroys buildings, initial nuclear radiation, and an electromagnetic pulse that destroys electronics. Delayed effects include radioactive fallout and possible climate effects from soot ("nuclear winter").',
  },
  {
    question: 'How long do nuclear weapon effects last?',
    answer:
      'Initial effects arrive within about a minute: the flash, fireball, blast wave and initial radiation. Residual fallout radiation is most intense in the first hours and days, then declines over weeks to years.',
  },
  {
    question: 'What does "yield" mean for a nuclear weapon?',
    answer:
      'Yield is the amount of energy released by a nuclear weapon, measured in TNT-equivalent tons. 1 kiloton (kt) equals 1,000 tons of TNT. 1 megaton (Mt) equals 1,000,000 tons of TNT. The Hiroshima bomb was about 15 kt. A modern strategic warhead is about 100 to 800 kt, and a few exceed 1 Mt. The largest weapon ever tested, the Soviet Tsar Bomba, was 50 Mt.',
  },
  {
    question: 'How are nuclear blast radii calculated?',
    answer:
      'Fireball radius (km) ≈ 0.061 × yield_kt^0.4 — the maximum air-burst fireball from Glasstone & Dolan 1977 §2.127. Blast overpressure (20/5/1 psi) and thermal burn radii are read from the published effects scaling table and log-log interpolated for intermediate yields, so they are not single power laws. For example, a 100 kt air burst gives roughly 1.06 km (20 psi), 2.89 km (5 psi), 7.98 km (1 psi) and 4.77 km (3rd-degree burns). All radii assume an air burst at optimum height. See the methodology page for the full table and sources.',
  },
  {
    question: 'Why does the simulator focus on physical effects rather than casualty totals?',
    answer:
      'Casualty, fallout and radiation outputs are currently withdrawn. The earlier model estimated deaths from a single flat population density summed over overlapping damage rings, which double-counted people and produced unreliable numbers. Those figures stay off until a verified gridded-population and fallout model is in place. The site shows physical effect radii only.',
  },
  {
    question: 'Is this nuclear blast simulator dangerous or illegal?',
    answer:
      'No. The simulator is completely legal and safe. All information is based on publicly available, declassified sources. No classified or sensitive information is disclosed. It cannot be used to build weapons or plan attacks. Educational use of nuclear effects data is protected speech, and similar tools are used in academic and policy research. Misuse for threats, targeting, or planning violence is strictly prohibited.',
  },
  {
    question: 'Does the simulator collect data about my simulations?',
    answer:
      'Your map clicks, weapon selections and target locations are not stored or sent to our servers. The pre-built weapon and city pages compute their radii at build time; detonations you place on the interactive map are computed in your browser. We do use Google Analytics to understand overall site traffic, and map tiles are served by Mapbox — both are described on the Privacy page. There are no user accounts.',
  },
  {
    question: 'Can I use this nuclear blast simulator for research or classroom teaching?',
    answer:
      'Yes — educational and research use is encouraged. The simulator is free for educational purposes, requires no registration or permission, and screenshots and data may be used in academic work. Please cite the methodology page and listed data sources. Adult supervision is recommended for users under 18 due to the mature subject matter.',
  },
]

export default function FAQPage() {
  const cites = createCitations()
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id="ld-faq"
        schema={[
          faqPageSchema(faqEntries),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'FAQ', url: '/faq' },
          ]),
        ]}
      />
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-400">{pageH1('/faq')}</h1>
        
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
                  This is an educational tool for understanding the physical scale of nuclear weapon effects. It
                  visualizes the fireball, blast and thermal radii on a map so the numbers are concrete and easy
                  to compare.
                </p>
                <p className="text-green-300">
                  It is <strong className="text-red-400">not</strong> intended for planning attacks, targeting, 
                  or any military purposes.
                </p>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">How accurate are the calculations?</h3>
                <p className="text-green-300 mb-3">
                  The radii come from the scaling laws in The Effects of Nuclear Weapons (Glasstone &amp; Dolan, 1977)
                  and the standard scaling-law table derived from it.<Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-3" /> They provide <em>estimates</em>
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
                      <li>• Shorter blast range than an optimum-height air burst<Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-2" /></li>
                      <li>• Heavy local radioactive fallout</li>
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
                      <span className="text-green-300 ml-2">The hot, luminous sphere at the burst point; at the first instant it reaches tens of millions of degrees.<Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-3" /></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff0000' }}></div>
                    <div>
                      <span className="font-semibold text-red-400">Severe Blast (Red):</span>
                      <span className="text-green-300 ml-2">20 psi overpressure. Reinforced concrete structures are leveled.<Cite c={cites} ids="us-congress-office-of-technology-assessment-via" /></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff8800' }}></div>
                    <div>
                      <span className="font-semibold text-orange-400">Moderate Blast (Orange):</span>
                      <span className="text-green-300 ml-2">5 psi overpressure. Typical homes and lightly built commercial buildings are destroyed.<Cite c={cites} ids="us-congress-office-of-technology-assessment-via" /></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#808080' }}></div>
                    <div>
                      <span className="font-semibold text-gray-400">Light Blast (Gray):</span>
                      <span className="text-green-300 ml-2">1 psi overpressure. Windows shatter.<Cite c={cites} ids="us-congress-office-of-technology-assessment-via" /></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff00ff' }}></div>
                    <div>
                      <span className="font-semibold text-purple-400">3rd Degree Burns (Magenta):</span>
                      <span className="text-green-300 ml-2">Severe burns requiring immediate medical care.<Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-6" /></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff99ff' }}></div>
                    <div>
                      <span className="font-semibold text-pink-400">2nd Degree Burns (Pink):</span>
                      <span className="text-green-300 ml-2">Painful blistering burns.<Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-6" /></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">How do nuclear weapons cause damage?</h3>
                <p className="text-green-300 mb-3">Nuclear weapons cause damage through multiple mechanisms:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-orange-400 mb-2">Immediate Effects (seconds to about a minute)<Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-2" /></h4>
                    <ul className="text-sm text-green-300 space-y-1">
                      <li>• <strong>Fireball:</strong> Extreme heat vaporizes nearby material</li>
                      <li>• <strong>Thermal radiation:</strong> Intense heat causes burns and fires</li>
                      <li>• <strong>Blast wave:</strong> Destroys buildings and causes injuries</li>
                      <li>• <strong>Nuclear radiation:</strong> Immediate lethal doses</li>
                      <li>• <strong>Electromagnetic pulse (EMP):</strong> Destroys electronics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-400 mb-2">Delayed Effects</h4>
                    <ul className="text-sm text-green-300 space-y-1">
                      <li>• <strong>Radioactive fallout:</strong> Contamination lasting years</li>
                      <li>• <strong>Nuclear winter:</strong> Climate effects from fires and soot</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">How long do the effects last?</h3>
                <div className="space-y-3 text-green-300">
                  <div>
                    <span className="font-semibold text-yellow-400">Initial (within about a minute):</span>
                    <span className="ml-2">Flash, fireball, blast wave and initial radiation</span>
                  </div>
                  <div>
                    <span className="font-semibold text-orange-400">Residual fallout (hours to years):</span>
                    <span className="ml-2">Most intense in the first hours and days, then declining over weeks to years<Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-5" /></span>
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
                  <li><strong>1 kiloton (kt)</strong> = 1,000 tons of TNT<Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-5" /></li>
                  <li><strong>1 megaton (Mt)</strong> = 1,000,000 tons of TNT<Cite c={cites} ids="us-dod-erda-the-effects-of-nuclear-weapons-3rd-e-5" /></li>
                  <li><strong>Hiroshima bomb:</strong> ~15 kt<Cite c={cites} ids="us-doe-nevada-operations-office-united-states-nu" /></li>
                  <li><strong>Modern strategic warhead:</strong> about 100-800 kt (a few exceed 1 Mt)<Cite c={cites} ids="federation-of-american-scientists-bulletin-of-th-2;bulletin-of-the-atomic-scientists-fas-russian-nu;bulletin-of-the-atomic-scientists-chinese-nuclea" /></li>
                  <li><strong>Largest ever tested (Tsar Bomba):</strong> 50 Mt<Cite c={cites} ids="nuclear-weapon-archive-the-soviet-weapons-progra" /></li>
                </ul>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">How are blast radii calculated?</h3>
                <p className="text-green-300 mb-3">
                  All radii assume an air burst at optimum height. The fireball uses a single relation; blast
                  and thermal radii are read from a published scaling table and log-log interpolated:
                </p>
                <div className="bg-gray-800 rounded p-4 font-mono text-sm">
                  <div className="text-yellow-400">Fireball radius = 0.061 × Yield^0.4 km</div>
                  <div className="text-green-300">Blast (20/5/1 psi) &amp; thermal burns: interpolated from the effects scaling table</div>
                  <div className="text-gray-400">e.g. 100 kt → 1.06 / 2.89 / 7.98 km (20/5/1 psi), 4.77 km (3rd-degree)</div>
                </div>
                <p className="text-green-300 mt-3 text-sm">
                  The fireball relation is from Glasstone &amp; Dolan 1977 §2.127; the scaling table is the
                  published &ldquo;Effects of nuclear explosions&rdquo; data. Full table on the{' '}
                  <a href="/methodology" className="text-yellow-400 hover:underline">methodology page</a>.
                </p>
              </div>

              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Why don&apos;t you show casualty numbers?</h3>
                <p className="text-green-300 mb-3">
                  Casualty, fallout and radiation figures are currently withdrawn. The earlier model
                  estimated deaths from a single flat population density summed over overlapping damage rings,
                  which double-counted people and produced unreliable numbers.
                </p>
                <ul className="list-disc list-inside space-y-1 text-green-300">
                  <li>Those figures stay off until a verified gridded-population and fallout model is in place</li>
                  <li>The site shows physical effect radii only (air burst at optimum height)</li>
                  <li>See the methodology page for exactly what is and isn&apos;t computed</li>
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
                  Your simulations are not stored:
                </p>
                <ul className="list-disc list-inside space-y-1 text-green-300">
                  <li>Your map clicks, weapon selections and target locations are never stored or sent to our servers</li>
                  <li>Pre-built pages compute radii at build time; map detonations compute in your browser</li>
                  <li>No user accounts or registration</li>
                  <li>We use Google Analytics for overall traffic and Mapbox for map tiles — see the{' '}
                    <a href="/privacy" className="text-yellow-400 hover:underline">Privacy page</a></li>
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

          <Sources c={cites} />
        </div>
      </main>
    </div>
  )
}