'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'

interface SymptomSummary {
  urgency: string
  chiefComplaint: string
  doctorQuestions: string[]
  status: string
}

interface Symptom {
  chiefComplaint: string
  duration: string
  severity: number
  previousConditions: string | null
  currentMedicines: string | null
  summary: SymptomSummary | null
}

interface VisitNote {
  clinicalNotes: string
  diagnosis: string
  followUpDate: string | null
  patientSummary: string | null
  prescriptions: Array<{
    id: string
    drugName: string
    dosage: string
    frequency: string
    durationDays: number
  }>
}

interface AppointmentDetail {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  notes: string | null
  doctor: {
    specialization: string
    phone: string | null
    user: { name: string; email: string }
  }
  patient: {
    user: { name: string; email: string }
  }
  symptoms: Symptom | null
  visitNote: VisitNote | null
}

export default function PatientAppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')

  const fetchAppointment = () => {
    setLoading(true)
    fetch(`/api/appointments/${id}`)
      .then((res) => res.json())
      .then((data) => setAppointment(data.data))
      .catch(() => setError('Failed to load appointment details'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAppointment()
  }, [id])

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.message)
        return
      }
      fetchAppointment()
    } catch {
      alert('Failed to cancel appointment')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-red-600 font-semibold mb-4">{error || 'Appointment not found'}</p>
        <Link href="/patient/dashboard" className="text-blue-600 hover:underline text-sm font-semibold">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/patient/dashboard" className="text-sm font-semibold text-gray-500 hover:text-blue-600">
          ← Dashboard
        </Link>
        <span className="font-bold text-gray-900">Appointment Details</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Header Overview Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
              {appointment.doctor.specialization}
            </span>
            <h1 className="text-xl font-bold text-gray-900 mt-2">Dr. {appointment.doctor.user.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              📅 {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-sm text-gray-500">
              ⏰ {appointment.startTime} – {appointment.endTime}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                appointment.status === 'CONFIRMED'
                  ? 'bg-green-100 text-green-800'
                  : appointment.status === 'CANCELLED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {appointment.status}
            </span>
            {appointment.status === 'CONFIRMED' && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-xs text-red-600 hover:underline font-semibold"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            )}
          </div>
        </div>

        {/* Symptoms & AI Pre-visit summary */}
        {appointment.symptoms && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Reported Symptoms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block text-xs">Chief Complaint</span>
                <span className="font-semibold text-gray-900">{appointment.symptoms.chiefComplaint}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Duration & Severity</span>
                <span className="font-semibold text-gray-900">
                  {appointment.symptoms.duration} (Severity: {appointment.symptoms.severity}/10)
                </span>
              </div>
            </div>

            {/* AI Summary */}
            {appointment.symptoms.summary && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                    🤖 AI Urgency Assessment
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-bold ${
                      appointment.symptoms.summary.urgency === 'HIGH'
                        ? 'bg-red-100 text-red-800'
                        : appointment.symptoms.summary.urgency === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {appointment.symptoms.summary.urgency} URGENCY
                  </span>
                </div>
                <p className="text-xs text-indigo-900">{appointment.symptoms.summary.chiefComplaint}</p>
              </div>
            )}
          </div>
        )}

        {/* Visit Summary & Prescription */}
        {appointment.visitNote && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 border-2 border-green-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Post-Visit Summary</h2>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">Completed</span>
            </div>

            {appointment.visitNote.patientSummary && (
              <div className="bg-green-50 p-4 rounded-lg text-sm text-green-900 border border-green-200">
                <h3 className="font-bold text-xs text-green-800 uppercase tracking-wider mb-1">Doctor&apos;s Friendly Notes</h3>
                <p className="leading-relaxed">{appointment.visitNote.patientSummary}</p>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-gray-800">Diagnosis</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{appointment.visitNote.diagnosis}</p>
            </div>

            {appointment.visitNote.prescriptions.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="font-semibold text-sm text-gray-800">Prescribed Medications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {appointment.visitNote.prescriptions.map((rx) => (
                    <div key={rx.id} className="border p-3 rounded-lg bg-gray-50">
                      <div className="font-bold text-sm text-gray-900">{rx.drugName}</div>
                      <div className="text-xs text-gray-600 mt-1">Dosage: {rx.dosage}</div>
                      <div className="text-xs text-gray-600">Frequency: {rx.frequency}</div>
                      <div className="text-xs text-gray-500 mt-1">Duration: {rx.durationDays} days</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
