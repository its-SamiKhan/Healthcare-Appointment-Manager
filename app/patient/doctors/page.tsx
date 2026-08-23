'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const SPECIALIZATIONS = [
  'All', 'Cardiology', 'Dermatology', 'Orthopedics', 'General Physician',
  'Neurology', 'Pediatrics', 'Gynecology', 'ENT', 'Ophthalmology', 'Psychiatry',
]

interface Doctor {
  id: string
  specialization: string
  bio: string | null
  slotDuration: number
  user: { name: string; email: string }
  _count: { appointments: number }
}

export default function PatientDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [specialization, setSpecialization] = useState('All')

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (specialization !== 'All') params.set('specialization', specialization)

    setLoading(true)
    fetch(`/api/doctors?${params}`)
      .then((r) => r.json())
      .then((d) => setDoctors(d.data || []))
      .finally(() => setLoading(false))
  }, [search, specialization])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/patient/dashboard" className="font-bold text-gray-900">
          ← HealthCare Manager
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Find a Doctor</h1>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by doctor name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {SPECIALIZATIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Doctor Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No doctors found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <Link
                key={doctor.id}
                href={`/patient/doctors/${doctor.id}`}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition hover:border-blue-200 border border-transparent"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
                    {doctor.user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">Dr. {doctor.user.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{doctor.specialization}</p>
                    {doctor.bio && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{doctor.bio}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                      <span>⏱ {doctor.slotDuration} min slots</span>
                      <span>·</span>
                      <span>{doctor._count.appointments} appointments</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-blue-600 font-medium">Book appointment →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
