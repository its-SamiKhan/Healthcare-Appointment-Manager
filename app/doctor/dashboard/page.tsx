'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardData {
  today: {
    appointments: Array<{
      id: string
      startTime: string
      endTime: string
      status: string
      patient: { user: { name: string; email: string } }
      symptoms?: {
        chiefComplaint: string
        severity: number
        summary?: { urgency: string; chiefComplaint: string; doctorQuestions: string[] } | null
      } | null
    }>
    urgentCount: number
  }
  upcoming: Array<{
    id: string
    date: string
    startTime: string
    patient: { user: { name: string } }
    symptoms?: { summary?: { urgency: string } | null } | null
  }>
  stats: {
    totalPatientsServed: number
    todayCount: number
    urgentToday: number
  }
}

export default function DoctorDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/doctor/dashboard')
      .then((r) => r.json())
      .then((d) => setData(d.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  const urgencyBadge = (urgency?: string) => {
    if (!urgency) return null
    const colors: Record<string, string> = {
      HIGH: 'bg-red-100 text-red-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      LOW: 'bg-green-100 text-green-800',
    }
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${colors[urgency] || 'bg-gray-100 text-gray-600'}`}>
        {urgency}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">D</span>
          </div>
          <span className="font-bold text-gray-900">Doctor Portal</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/api/calendar/auth" className="text-sm text-teal-600 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition">
            📅 Connect Calendar
          </Link>
          <button
            onClick={() => fetch('/api/auth/logout', { method: 'POST' }).then(() => (window.location.href = '/login'))}
            className="text-sm text-red-600"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Good morning, Doctor 👋</h1>
        <p className="text-gray-500 mb-6">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="text-2xl font-bold text-gray-900">{data?.stats.todayCount ?? 0}</div>
            <div className="text-sm text-gray-500">Today&apos;s Appointments</div>
          </div>
          <div className={`rounded-xl shadow-sm p-5 ${data?.stats.urgentToday ? 'bg-red-50 border border-red-200' : 'bg-white'}`}>
            <div className={`text-2xl font-bold ${data?.stats.urgentToday ? 'text-red-700' : 'text-gray-900'}`}>{data?.stats.urgentToday ?? 0}</div>
            <div className="text-sm text-gray-500">Urgent Cases Today</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="text-2xl font-bold text-gray-900">{data?.stats.totalPatientsServed ?? 0}</div>
            <div className="text-sm text-gray-500">Total Patients Served</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Today&apos;s Schedule</h2>
            {data?.today.appointments.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No appointments today</p>
            ) : (
              <div className="space-y-3">
                {data?.today.appointments.map((apt) => (
                  <Link
                    key={apt.id}
                    href={`/doctor/appointments/${apt.id}`}
                    className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="text-sm font-mono text-gray-500 w-16 flex-shrink-0">{apt.startTime}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{apt.patient.user.name}</p>
                        {urgencyBadge(apt.symptoms?.summary?.urgency)}
                      </div>
                      {apt.symptoms?.chiefComplaint && (
                        <p className="text-sm text-gray-500 mt-1">{apt.symptoms.chiefComplaint}</p>
                      )}
                      {apt.symptoms?.summary?.urgency === 'HIGH' && apt.symptoms.summary.doctorQuestions?.length > 0 && (
                        <div className="mt-2 bg-red-50 rounded-lg p-2">
                          <p className="text-xs text-red-700 font-medium">AI suggests asking:</p>
                          <ul className="text-xs text-red-600 mt-1 space-y-0.5">
                            {(apt.symptoms.summary.doctorQuestions as string[]).slice(0, 2).map((q, i) => (
                              <li key={i}>• {q}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                      apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {apt.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming (Next 10)</h2>
            <div className="space-y-3">
              {data?.upcoming.map((apt) => (
                <div key={apt.id} className="p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 flex-1 truncate">{apt.patient.user.name}</p>
                    {urgencyBadge(apt.symptoms?.summary?.urgency)}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {apt.startTime}
                  </p>
                </div>
              ))}
              {data?.upcoming.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No upcoming appointments</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
