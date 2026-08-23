'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Analytics {
  overview: {
    totalDoctors: number
    totalPatients: number
    totalAppointments: number
    confirmed: number
    cancelled: number
    completed: number
    hold: number
  }
  topSpecializations: { name: string; count: number }[]
  recentActivity: { id: string; action: string; entityType: string; createdAt: string }[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((d) => setData(d.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  const stats = [
    { label: 'Total Doctors', value: data?.overview.totalDoctors ?? 0, color: 'bg-indigo-500', icon: '👨‍⚕️' },
    { label: 'Total Patients', value: data?.overview.totalPatients ?? 0, color: 'bg-blue-500', icon: '🏥' },
    { label: 'Total Appointments', value: data?.overview.totalAppointments ?? 0, color: 'bg-green-500', icon: '📅' },
    { label: 'Cancelled', value: data?.overview.cancelled ?? 0, color: 'bg-red-500', icon: '❌' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <span className="font-bold text-gray-900">Admin Portal</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/admin/doctors" className="text-sm text-gray-600 hover:text-indigo-600">Manage Doctors</Link>
          <Link href="/admin/leaves" className="text-sm text-gray-600 hover:text-indigo-600">Leave Management</Link>
          <button
            onClick={() => fetch('/api/auth/logout', { method: 'POST' }).then(() => (window.location.href = '/login'))}
            className="text-sm text-red-600"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointment Status Breakdown */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Appointment Status</h2>
            <div className="space-y-3">
              {[
                { label: 'Confirmed', value: data?.overview.confirmed, color: 'bg-green-500' },
                { label: 'Completed', value: data?.overview.completed, color: 'bg-blue-500' },
                { label: 'Cancelled', value: data?.overview.cancelled, color: 'bg-red-500' },
                { label: 'On Hold', value: data?.overview.hold, color: 'bg-yellow-500' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${s.color}`} />
                  <span className="text-sm text-gray-600 flex-1">{s.label}</span>
                  <span className="font-semibold">{s.value ?? 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Specializations */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Top Specializations</h2>
            <div className="space-y-3">
              {data?.topSpecializations.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm w-4">{i + 1}</span>
                  <span className="text-sm text-gray-700 flex-1">{s.name}</span>
                  <span className="font-semibold">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity (Audit Log)</h2>
          <div className="space-y-2">
            {data?.recentActivity.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-400 w-32 flex-shrink-0">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
                <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                  {log.action}
                </span>
                <span className="text-xs text-gray-500">{log.entityType}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
