'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Appointment {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  notes: string | null
  doctor: {
    specialization: string
    user: { name: string; email: string }
  }
  symptoms?: {
    chiefComplaint: string
    severity: number
    summary?: { urgency: string } | null
  } | null
}

const STATUS_OPTIONS = ['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']

const STATUS_BADGES: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
  RESCHEDULED: 'bg-amber-100 text-amber-800 border-amber-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200',
}

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    const url = selectedStatus === 'ALL' ? '/api/appointments' : `/api/appointments?status=${selectedStatus}`
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data.data || [])
      })
      .catch(() => setError('Failed to load appointments'))
      .finally(() => setLoading(false))
  }, [selectedStatus])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/patient/dashboard" className="text-sm font-semibold text-gray-500 hover:text-blue-600">
            ← Dashboard
          </Link>
          <span className="text-gray-300">|</span>
          <span className="font-bold text-gray-900">My Appointments</span>
        </div>
        <Link
          href="/patient/doctors"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
        >
          + Book New Appointment
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400 space-y-3">
            <div className="text-3xl">📅</div>
            <p className="font-medium text-gray-700">No {selectedStatus !== 'ALL' ? selectedStatus.toLowerCase() : ''} appointments found</p>
            <Link
              href="/patient/doctors"
              className="inline-block text-sm text-blue-600 font-semibold hover:underline"
            >
              Book an appointment with a doctor →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base">Dr. {apt.doctor.user.name}</h3>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold">
                      {apt.doctor.specialization}
                    </span>
                    {apt.symptoms?.summary?.urgency && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-bold ${
                          apt.symptoms.summary.urgency === 'HIGH'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {apt.symptoms.summary.urgency} Urgency
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600">
                    📅 {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    <span className="mx-2">•</span>
                    ⏰ {apt.startTime} – {apt.endTime}
                  </p>

                  {apt.symptoms?.chiefComplaint && (
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                      <span className="font-medium text-gray-700">Complaint:</span> {apt.symptoms.chiefComplaint}
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                      STATUS_BADGES[apt.status] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {apt.status}
                  </span>
                  <Link
                    href={`/patient/appointments/${apt.id}`}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    View Details & Summary →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
