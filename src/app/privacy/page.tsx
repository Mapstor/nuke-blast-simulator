import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Data Collection and Protection',
  description: 'Privacy policy for the nuclear blast simulator. Learn how we protect your privacy and what data we collect.'
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-400">Privacy Policy</h1>
        
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Privacy Commitment</h2>
          <p className="text-green-300 text-lg">
            We are committed to protecting your privacy. This simulator operates with minimal data collection 
            and maximum user privacy protection.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">What Data We Collect</h2>
          <div className="space-y-6">
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Personal Information</h3>
              <p className="text-green-300 mb-3 font-semibold">We do NOT collect:</p>
              <ul className="list-disc list-inside space-y-2 text-green-300">
                <li>Names, email addresses, or contact information</li>
                <li>User accounts or registration data</li>
                <li>Location tracking or GPS coordinates</li>
                <li>Personal preferences or settings</li>
                <li>Social media profiles or connections</li>
                <li>Payment or financial information</li>
              </ul>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Technical Data</h3>
              <p className="text-green-300 mb-3">We may collect minimal technical information:</p>
              <ul className="list-disc list-inside space-y-2 text-green-300">
                <li>IP addresses (automatically anonymized)</li>
                <li>Browser type and version (for compatibility)</li>
                <li>Device type (desktop/mobile) for responsive design</li>
                <li>Page access times (for performance monitoring)</li>
                <li>Error logs (for technical troubleshooting)</li>
              </ul>
              <p className="text-green-300 mt-3 text-sm">
                This data is collected automatically by standard web servers and is not linked to individual users.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">How Data is Processed</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">Client-Side Processing</h3>
            <p className="mb-4 text-green-300">
              All simulation calculations are performed locally in your browser:
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-300">
              <li>Weapon selections and map coordinates are processed on your device</li>
              <li>Blast calculations run entirely in your browser</li>
              <li>No simulation data is transmitted to our servers</li>
              <li>No tracking of what weapons or locations you select</li>
              <li>Your simulation choices remain completely private</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Third-Party Services</h2>
          <div className="space-y-6">
            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Mapbox Maps</h3>
              <p className="mb-3 text-green-300">
                We use Mapbox for interactive mapping functionality:
              </p>
              <ul className="list-disc list-inside space-y-2 text-green-300">
                <li>Map tiles are loaded from Mapbox servers</li>
                <li>Mapbox may collect standard analytics data</li>
                <li>No personal simulation data is shared with Mapbox</li>
                <li>Mapbox Privacy Policy: <a href="https://www.mapbox.com/privacy" className="text-blue-400 hover:underline">mapbox.com/privacy</a></li>
              </ul>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Web Hosting</h3>
              <p className="mb-3 text-green-300">
                Standard hosting infrastructure may collect:
              </p>
              <ul className="list-disc list-inside space-y-2 text-green-300">
                <li>Server access logs (IP addresses, request times)</li>
                <li>Error logs for troubleshooting</li>
                <li>Basic performance metrics</li>
                <li>No personal or simulation data is stored</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Cookies and Local Storage</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300">
              We use minimal browser storage for functionality:
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-300">
              <li>No tracking cookies or advertising cookies</li>
              <li>Essential technical cookies only (session management)</li>
              <li>Local storage for temporary map state (zoom, position)</li>
              <li>All data is cleared when you close the browser</li>
              <li>No persistent user tracking across sessions</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Data Sharing and Disclosure</h2>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-red-400">We DO NOT Share Data</h3>
            <p className="mb-4 text-red-300">
              We do not sell, rent, or share any user data with third parties, except:
            </p>
            <ul className="list-disc list-inside space-y-2 text-red-300">
              <li>When required by law or legal process</li>
              <li>To protect against misuse or illegal activities</li>
              <li>In case of suspected terrorism or security threats</li>
              <li>To comply with national security requirements</li>
            </ul>
            <p className="mt-4 text-red-300 font-semibold">
              Any disclosure would be limited to the minimum necessary information.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Your Rights</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300">
              Since we collect minimal data, your privacy rights are inherently protected:
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-300">
              <li>No personal data to access, correct, or delete</li>
              <li>No user profiles to modify or remove</li>
              <li>Anonymous usage by design</li>
              <li>You can clear browser data at any time</li>
              <li>No opt-out required since there's no tracking</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Security Measures</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300">
              We implement security measures to protect any technical data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-300">
              <li>HTTPS encryption for all communications</li>
              <li>Secure server configurations</li>
              <li>Regular security updates and monitoring</li>
              <li>Access controls and logging</li>
              <li>No persistent storage of sensitive information</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">International Users</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="mb-4 text-green-300">
              This service is designed to comply with international privacy standards:
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-300">
              <li>GDPR compliant (minimal data collection)</li>
              <li>CCPA compliant (no personal data sales)</li>
              <li>Privacy by design principles</li>
              <li>No cross-border data transfers of personal information</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Contact Us</h2>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <p className="text-green-300 mb-4">
              For privacy questions or concerns:
            </p>
            <div className="text-center">
              <p className="text-green-400 font-semibold text-lg">info@nukeblastsimulator.com</p>
              <p className="text-green-300 text-sm mt-2">Privacy-First • Educational Use • Nuclear Awareness</p>
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