'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Doctor {
  id: string
  specialization: string
  user: { name: string }
}

interface Leave {
  id: string
  doctorId: string
  startDate: string
  endDate: string
  reason: string | null
  createdAt: string
}

export default function AdminLeavesPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  })

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/doctors')
      .then((res) => res.json())
      .then((data) => {
        const docs = data.data || []
        setDoctors(docs)
        if (docs.length > 0) setSelectedDoctorId(docs[0].id)
      })
  }, [])

  useEffect(() => {
    if (!selectedDoctorId) return
    setLoading(true)
    fetch(`/api/admin/doctors/${selectedDoctorId}/leave`)
      .then((res) => res.json())
      .then((data) => setLeaves(data.data || []))
      .finally(() => setLoading(false))
  }, [selectedDoctorId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctorId) return
    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/admin/doctors/${selectedDoctorId}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Failed to apply leave' })
        return
      }

      setMessage({ type: 'success', text: data.message })
      setFormData({ startDate: '', endDate: '', reason: '' })

      // Refresh leaves list
      const updated = await fetch(`/api/admin/doctors/${selectedDoctorId}/leave`).then((r) => r.json())
      setLeaves(updated.data || [])
    } catch {
      setMessage({ type: 'error', text: 'An error occurred while submitting leave.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="text-sm font-semibold text-gray-500 hover:text-indigo-600">
            ← Dashboard
          </Link>
          <span className="text-gray-300">|</span>
          <span className="font-bold text-gray-900">Doctor Leave Management</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Doctor Selector & Leave Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Mark Doctor Leave</h2>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm mb-4 ${
                  message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Select Doctor</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      Dr. {doc.user.name} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Reason (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Medical conference, Annual leave"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs">
                ⚠️ Marking leave will automatically cancel conflicting patient appointments, send notification emails, and delete calendar events.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition"
              >
                {submitting ? 'Processing Leave...' : 'Apply Leave & Cascade Cancel'}
              </button>
            </form>
          </div>

          {/* Existing Leaves List */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Leave Records</h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full" />
              </div>
            ) : leaves.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No leave records for this doctor.</div>
            ) : (
              <div className="space-y-3">
                {leaves.map((leave) => (
                  <div key={leave.id} className="p-4 border rounded-lg flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {new Date(leave.startDate).toLocaleDateString()} — {new Date(leave.endDate).toLocaleDateString()}
                      </div>
                      {leave.reason && <p className="text-xs text-gray-500 mt-1">Reason: {leave.reason}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        Applied on: {new Date(leave.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-semibold">
                      On Leave
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
