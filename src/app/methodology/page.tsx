import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Methodology - How We Calculate Nuclear Blast Effects',
  description: 'Learn about the scientific formulas and data sources used to calculate nuclear blast effects, casualties, and damage zones in our simulator.'
}

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Scientific Methodology</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Blast Effect Calculations</h2>
          <p className="mb-4 text-gray-700">
            Our simulator uses scientifically validated formulas derived from nuclear weapons testing data
            and the seminal work "The Effects of Nuclear Weapons" by Glasstone & Dolan.
          </p>
          
          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-3">Fireball Radius</h3>
            <code className="block bg-gray-100 p-3 rounded">
              Radius (km) = 0.28 × Yield^0.33
            </code>
            <p className="mt-3 text-gray-600">
              The fireball vaporizes everything within this radius. Temperature exceeds 10 million degrees Celsius.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-3">Air Blast Zones</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="font-semibold mr-2">20 PSI (Severe):</span>
                <span className="text-gray-600">0.28 × Yield^0.33 km - Reinforced concrete structures destroyed</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">5 PSI (Moderate):</span>
                <span className="text-gray-600">1.03 × Yield^0.33 km - Most residential buildings collapse</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">1 PSI (Light):</span>
                <span className="text-gray-600">2.93 × Yield^0.33 km - Windows shatter, light injuries</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-3">Thermal Radiation</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="font-semibold mr-2">3rd Degree Burns:</span>
                <span className="text-gray-600">0.67 × Yield^0.41 km - Severe burns requiring immediate medical care</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">2nd Degree Burns:</span>
                <span className="text-gray-600">1.2 × Yield^0.41 km - Painful burns, potential scarring</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Casualty Estimates</h2>
          <p className="mb-4 text-gray-700">
            Casualties are calculated based on population density and empirically-derived mortality rates
            for each blast effect zone:
          </p>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Zone</th>
                  <th className="text-right py-2">Mortality Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Fireball</td>
                  <td className="text-right">100%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">20 PSI Overpressure</td>
                  <td className="text-right">98%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">5 PSI Overpressure</td>
                  <td className="text-right">50%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">3rd Degree Burns</td>
                  <td className="text-right">95%</td>
                </tr>
                <tr>
                  <td className="py-2">Fallout (24-48h)</td>
                  <td className="text-right">30%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Data Sources</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Glasstone, S., & Dolan, P. J. (1977). The Effects of Nuclear Weapons (3rd ed.)</li>
            <li>Federation of American Scientists - Nuclear Weapons Effects Calculator</li>
            <li>NUKEMAP by Alex Wellerstein - Validation data</li>
            <li>Defense Threat Reduction Agency publications</li>
            <li>Oak Ridge National Laboratory - Nuclear Weapons FAQ</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Important Disclaimers</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-gray-700">
              This simulator provides estimates based on idealized conditions. Actual effects would vary based on:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>Terrain and geographic features</li>
              <li>Weather conditions</li>
              <li>Building construction standards</li>
              <li>Time of day (population distribution)</li>
              <li>Altitude of detonation</li>
              <li>Emergency response capabilities</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}