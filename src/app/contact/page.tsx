import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - Feedback, Concerns, and Support',
  description: 'Contact information for the nuclear blast simulator. Report concerns, provide feedback, or request support.'
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-400">Contact Us</h1>
        
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Get in Touch</h2>
          <p className="text-green-300 text-lg">
            We welcome feedback, educational collaboration, and reports of any concerns 
            regarding the use of this simulator.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Primary Contact</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-8">
            <div className="text-center">
              <div className="mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-green-400">Email</h3>
              <p className="text-3xl font-bold text-green-400 mb-4">info@nukeblastsimulator.com</p>
              <p className="text-green-300">
                Our primary communication channel for all inquiries, feedback, and support requests.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">What to Contact Us About</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Educational Collaboration</h3>
              <ul className="list-disc list-inside space-y-2 text-green-300">
                <li>Academic research partnerships</li>
                <li>Classroom integration support</li>
                <li>Educational resource requests</li>
                <li>Guest lecture opportunities</li>
                <li>Documentary and media projects</li>
              </ul>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Technical Feedback</h3>
              <ul className="list-disc list-inside space-y-2 text-green-300">
                <li>Bug reports and technical issues</li>
                <li>Scientific accuracy improvements</li>
                <li>Feature suggestions</li>
                <li>Accessibility enhancements</li>
                <li>Mobile optimization feedback</li>
              </ul>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-400">Security Concerns</h3>
              <ul className="list-disc list-inside space-y-2 text-red-300">
                <li>Suspected misuse of the simulator</li>
                <li>Inappropriate or threatening content</li>
                <li>Violation of terms of service</li>
                <li>Security vulnerabilities</li>
                <li>Emergency situation reports</li>
              </ul>
            </div>

            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-orange-400">Legal and Policy</h3>
              <ul className="list-disc list-inside space-y-2 text-orange-300">
                <li>Terms of service questions</li>
                <li>Privacy policy inquiries</li>
                <li>Content licensing requests</li>
                <li>Takedown requests</li>
                <li>Compliance concerns</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Response Times</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🚨</div>
                <h3 className="font-semibold text-red-400 mb-2">Security Issues</h3>
                <p className="text-red-300">Within 24 hours</p>
                <p className="text-sm text-red-300/70 mt-1">Urgent security concerns receive immediate attention</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🎓</div>
                <h3 className="font-semibold text-yellow-400 mb-2">Educational Inquiries</h3>
                <p className="text-yellow-300">2-3 business days</p>
                <p className="text-sm text-yellow-300/70 mt-1">Academic partnerships and educational support</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💬</div>
                <h3 className="font-semibold text-green-400 mb-2">General Feedback</h3>
                <p className="text-green-300">5-7 business days</p>
                <p className="text-sm text-green-300/70 mt-1">Feature suggestions and general inquiries</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Reporting Guidelines</h2>
          <div className="space-y-6">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-400">🚨 Urgent Security Reports</h3>
              <p className="mb-3 text-red-300">
                For immediate security concerns, include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-red-300">
                <li>Subject line: "URGENT SECURITY REPORT"</li>
                <li>Detailed description of the concern</li>
                <li>Evidence or screenshots if available</li>
                <li>Your contact information for follow-up</li>
                <li>Time-sensitive nature of the issue</li>
              </ul>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">📝 Effective Bug Reports</h3>
              <p className="mb-3 text-green-300">
                Help us resolve technical issues faster:
              </p>
              <ul className="list-disc list-inside space-y-2 text-green-300">
                <li>Browser type and version</li>
                <li>Device type (desktop/mobile)</li>
                <li>Steps to reproduce the issue</li>
                <li>Expected vs. actual behavior</li>
                <li>Screenshots or error messages</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Alternative Resources</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300">
              For immediate assistance or additional resources:
            </p>
            <ul className="space-y-3 text-green-300">
              <li>
                <strong className="text-yellow-400">Educational Support:</strong> 
                <span className="ml-2">Check our <a href="/about" className="text-blue-400 hover:underline">About</a> and <a href="/methodology" className="text-blue-400 hover:underline">Methodology</a> pages</span>
              </li>
              <li>
                <strong className="text-yellow-400">Technical Help:</strong> 
                <span className="ml-2">Review our <a href="/how-it-works" className="text-blue-400 hover:underline">How It Works</a> guide</span>
              </li>
              <li>
                <strong className="text-yellow-400">Legal Questions:</strong> 
                <span className="ml-2">See our <a href="/terms" className="text-blue-400 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a></span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Mission Statement</h2>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <p className="text-green-300 text-lg leading-relaxed">
              We believe that education and awareness are powerful tools for promoting peace and nuclear disarmament. 
              This simulator exists to foster informed discussions about nuclear weapons policy and to demonstrate 
              the humanitarian consequences of these weapons. We welcome collaboration with educators, researchers, 
              and peace advocates who share this mission.
            </p>
            <div className="mt-6 text-center">
              <p className="text-green-400 font-semibold">
                Education • Awareness • Peace • Disarmament
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Professional Network</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300">
              We maintain professional relationships with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-300">
              <li>Nuclear policy research institutes</li>
              <li>Peace and conflict studies departments</li>
              <li>International humanitarian organizations</li>
              <li>Nuclear disarmament advocacy groups</li>
              <li>Educational technology organizations</li>
            </ul>
            <p className="mt-4 text-green-300 text-sm">
              Interested in formal collaboration? Contact us to discuss partnership opportunities.
            </p>
          </div>
        </section>

        <div className="text-center">
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-400">Ready to Connect?</h3>
            <p className="text-2xl font-bold text-green-400 mb-2">info@nukeblastsimulator.com</p>
            <p className="text-green-300">We look forward to hearing from you.</p>
          </div>
        </div>
      </main>
    </div>
  )
}