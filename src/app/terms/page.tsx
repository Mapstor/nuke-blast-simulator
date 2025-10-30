import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Educational Use Only',
  description: 'Terms of service for the nuclear blast simulator. Educational purposes only, not for planning or targeting.'
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-400">Terms of Service</h1>
        
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-red-400">Educational Use Only</h2>
          <p className="text-red-300 text-lg font-semibold">
            This simulator is strictly for educational and awareness purposes. Any use for planning, targeting, 
            or facilitating actual attacks is strictly prohibited and illegal.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Acceptance of Terms</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300">
              By accessing and using the Nuke Blast Simulator ("the Service"), you agree to be bound by these 
              Terms of Service. If you do not agree to these terms, you must not use this service.
            </p>
            <p className="text-green-300">
              These terms may be updated periodically. Continued use of the service constitutes acceptance 
              of any modifications.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Permitted Uses</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300">The Service may be used only for:</p>
            <ul className="list-disc list-inside space-y-2 text-green-300">
              <li>Educational research and learning about nuclear weapons effects</li>
              <li>Academic study and classroom instruction</li>
              <li>Raising awareness about nuclear weapons consequences</li>
              <li>Supporting nuclear disarmament advocacy and peace education</li>
              <li>Journalistic and documentary purposes</li>
              <li>Personal education and understanding</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-red-400">Prohibited Uses</h2>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <p className="mb-4 text-red-300 font-semibold">The Service must NOT be used for:</p>
            <ul className="list-disc list-inside space-y-2 text-red-300">
              <li>Planning, targeting, or facilitating any form of attack or violence</li>
              <li>Terrorism, extremism, or criminal activities of any kind</li>
              <li>Threatening individuals, groups, or nations</li>
              <li>Military targeting or operational planning</li>
              <li>Creating fear, panic, or psychological harm</li>
              <li>Violating any local, national, or international laws</li>
              <li>Circumventing or defeating security measures</li>
            </ul>
            <p className="mt-4 text-red-300 font-semibold">
              Violation of these prohibitions may result in immediate termination of access and 
              reporting to relevant authorities.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Data Accuracy and Limitations</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300">
              The Service provides estimates based on scientific models and historical data. However:
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-300">
              <li>Results are approximations and should not be considered precise predictions</li>
              <li>Real-world effects would vary significantly based on numerous factors</li>
              <li>The Service is not suitable for emergency planning or risk assessment</li>
              <li>Data may contain errors or become outdated</li>
              <li>We make no warranties regarding accuracy or completeness</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Age Restrictions</h2>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
            <p className="mb-4 text-yellow-300">
              This Service contains mature content related to weapons of mass destruction and their effects.
            </p>
            <ul className="list-disc list-inside space-y-2 text-yellow-300">
              <li>Users must be at least 16 years of age</li>
              <li>Users under 18 should have parental or educational supervision</li>
              <li>Content is intended for mature, educational audiences</li>
              <li>Not suitable for entertainment or casual use</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Privacy and Data Collection</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300">
              We are committed to protecting user privacy:
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-300">
              <li>We do not collect personal information or user accounts</li>
              <li>No location tracking or personal data storage</li>
              <li>Simulation parameters are processed locally in your browser</li>
              <li>Standard web server logs may record access patterns</li>
              <li>No data is shared with third parties</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Disclaimer of Liability</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300">
              The Service is provided "as is" without warranties of any kind. We disclaim all liability for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-300">
              <li>Accuracy or completeness of simulation results</li>
              <li>Emotional distress or psychological impact</li>
              <li>Misuse of information or violation of these terms</li>
              <li>Technical issues, downtime, or data loss</li>
              <li>Consequences of decisions based on simulation results</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Reporting Misuse</h2>
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6">
            <p className="mb-4 text-orange-300">
              If you become aware of misuse of this Service, please report it immediately:
            </p>
            <ul className="list-disc list-inside space-y-2 text-orange-300">
              <li>Contact: info@nukeblastsimulator.com</li>
              <li>Include details of the suspected misuse</li>
              <li>Report to appropriate authorities if necessary</li>
              <li>Help us maintain the educational integrity of this tool</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Contact Information</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="text-green-300 mb-4">
              For questions about these Terms of Service or to report concerns:
            </p>
            <div className="text-center">
              <p className="text-green-400 font-semibold text-lg">info@nukeblastsimulator.com</p>
              <p className="text-green-300 text-sm mt-2">Educational Use • Nuclear Awareness • Peace Advocacy</p>
            </div>
          </div>
        </section>

        <div className="text-center text-green-400/50 text-sm">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </main>
    </div>
  )
}