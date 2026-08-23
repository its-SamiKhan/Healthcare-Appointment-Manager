'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Appointment {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  doctor: { user: { name: string }; specialization: string }
  symptoms?: { summary?: { urgency: string } | null } | null
}

interface MedicationReminder {
  id: string
  scheduledAt: string
  prescription: { drugName: string; dosage: string }
}

interface DashboardData {
  upcoming: Appointment[]
  past: Appointment[]
  medicationReminders: MedicationReminder[]
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800',
  RESCHEDULED: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
}

export default function PatientDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/patient/dashboard')
      .then((r) => r.json())
      .then((d) => setData(d.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">H</span>
          </div>
          <span className="font-bold text-gray-900">HealthCare Manager</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/patient/doctors" className="text-sm text-gray-600 hover:text-blue-600">
            Find Doctors
          </Link>
          <Link href="/patient/appointments" className="text-sm text-gray-600 hover:text-blue-600">
            My Appointments
          </Link>
          <button
            onClick={() => fetch('/api/auth/logout', { method: 'POST' }).then(() => (window.location.href = '/login'))}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Patient Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
              <Link href="/patient/doctors" className="text-sm text-blue-600 hover:underline">
                + Book New
              </Link>
            </div>
            {data?.upcoming.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No upcoming appointments</p>
                <Link href="/patient/doctors" className="text-blue-600 hover:underline text-sm mt-2 block">
                  Find a doctor →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data?.upcoming.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                    <div>
                      <p className="font-medium text-gray-900">Dr. {apt.doctor.user.name}</p>
                      <p className="text-sm text-gray-500">{apt.doctor.specialization}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {apt.startTime}–{apt.endTime}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[apt.status] || 'bg-gray-100 text-gray-600'}`}>
                        {apt.status}
                      </span>
                      <Link href={`/patient/appointments/${apt.id}`} className="text-xs text-blue-600 hover:underline">
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medication Reminders */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">💊 Upcoming Medications</h2>
            {data?.medicationReminders.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No pending reminders</p>
            ) : (
              <div className="space-y-3">
                {data?.medicationReminders.map((r) => (
                  <div key={r.id} className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="font-medium text-sm text-gray-900">{r.prescription.drugName}</p>
                    <p className="text-xs text-gray-500">{r.prescription.dosage}</p>
                    <p className="text-xs text-green-700 mt-1">
                      {new Date(r.scheduledAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Past Visits */}
        {(data?.past.length ?? 0) > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Visits</h2>
            <div className="space-y-3">
              {data?.past.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Dr. {apt.doctor.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(apt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <Link href={`/patient/appointments/${apt.id}`} className="text-sm text-blue-600 hover:underline">
                    View Summary →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
