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

interface Prescription {
  drugName: string
  dosage: string
  frequency: string
  durationDays: number
}

interface AppointmentDetail {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  patient: {
    user: { name: string; email: string }
  }
  symptoms: Symptom | null
  visitNote: {
    clinicalNotes: string
    diagnosis: string
    patientSummary: string | null
    prescriptions: Prescription[]
  } | null
}

export default function DoctorAppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null)
  const [loading, setLoading] = useState(true)

  // Visit Note Form
  const [clinicalNotes, setClinicalNotes] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { drugName: '', dosage: '', frequency: '1x daily', durationDays: 5 },
  ])
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const fetchAppointment = () => {
    setLoading(true)
    fetch(`/api/appointments/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAppointment(data.data)
        if (data.data?.visitNote) {
          setClinicalNotes(data.data.visitNote.clinicalNotes)
          setDiagnosis(data.data.visitNote.diagnosis)
          setPrescriptions(data.data.visitNote.prescriptions || [])
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAppointment()
  }, [id])

  const addPrescriptionRow = () => {
    setPrescriptions([
      ...prescriptions,
      { drugName: '', dosage: '', frequency: '1x daily', durationDays: 5 },
    ])
  }

  const removePrescriptionRow = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index))
  }

  const handlePrescriptionChange = (
    index: number,
    field: keyof Prescription,
    value: string | number
  ) => {
    const updated = [...prescriptions]
    updated[index] = { ...updated[index], [field]: value }
    setPrescriptions(updated)
  }

  const handleSubmitNotes = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    const validPrescriptions = prescriptions.filter((p) => p.drugName.trim() !== '')

    try {
      const res = await fetch(`/api/doctor/appointments/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicalNotes,
          diagnosis,
          followUpDate: followUpDate || null,
          prescriptions: validPrescriptions,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(`Error: ${data.message}`)
        return
      }

      setMessage('✅ Visit notes saved successfully & medication reminders generated.')
      fetchAppointment()
    } catch {
      setMessage('Failed to save visit notes.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-red-600 font-semibold mb-4">Appointment not found</p>
        <Link href="/doctor/dashboard" className="text-teal-600 hover:underline text-sm font-semibold">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/doctor/dashboard" className="text-sm font-semibold text-gray-500 hover:text-teal-600">
          ← Doctor Dashboard
        </Link>
        <span className="font-bold text-gray-900">Patient Consultation Record</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Patient Info Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{appointment.patient.user.name}</h1>
            <p className="text-sm text-gray-500">{appointment.patient.user.email}</p>
            <p className="text-xs text-gray-400 mt-2">
              📅 {new Date(appointment.date).toLocaleDateString()} ({appointment.startTime} – {appointment.endTime})
            </p>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
              appointment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
            }`}
          >
            {appointment.status}
          </span>
        </div>

        {/* AI Pre-Visit Summary Card */}
        {appointment.symptoms && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Patient Symptoms & AI Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
              <div>
                <span className="text-gray-500 text-xs block">Chief Complaint</span>
                <span className="font-semibold text-gray-900">{appointment.symptoms.chiefComplaint}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Duration / Severity</span>
                <span className="font-semibold text-gray-900">
                  {appointment.symptoms.duration} (Severity: {appointment.symptoms.severity}/10)
                </span>
              </div>
            </div>

            {appointment.symptoms.summary && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900">🤖 AI Pre-Visit Summary</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-bold ${
                      appointment.symptoms.summary.urgency === 'HIGH'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {appointment.symptoms.summary.urgency} Urgency
                  </span>
                </div>
                {appointment.symptoms.summary.doctorQuestions.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-indigo-800 block mb-1">Recommended Questions to Ask:</span>
                    <ul className="list-disc list-inside text-xs text-indigo-900 space-y-1">
                      {appointment.symptoms.summary.doctorQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Clinical Notes & Prescription Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Post-Visit Clinical Documentation</h2>

          {message && (
            <div className="p-3 rounded-lg text-sm bg-blue-50 text-blue-800 border border-blue-200">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmitNotes} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Diagnosis *</label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. Acute Bronchitis"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Clinical Notes *</label>
              <textarea
                required
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Detailed clinical findings, test observations, and advice..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Follow-up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Prescriptions */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-800">Prescription & Medication Schedule</h3>
                <button
                  type="button"
                  onClick={addPrescriptionRow}
                  className="text-xs text-teal-600 font-semibold hover:underline"
                >
                  + Add Medication
                </button>
              </div>

              {prescriptions.map((p, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-gray-50 p-3 rounded-lg">
                  <input
                    type="text"
                    placeholder="Drug Name (e.g. Paracetamol)"
                    value={p.drugName}
                    onChange={(e) => handlePrescriptionChange(idx, 'drugName', e.target.value)}
                    className="px-3 py-1.5 border rounded text-xs outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 500mg)"
                    value={p.dosage}
                    onChange={(e) => handlePrescriptionChange(idx, 'dosage', e.target.value)}
                    className="px-3 py-1.5 border rounded text-xs outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Frequency (e.g. 3x daily)"
                    value={p.frequency}
                    onChange={(e) => handlePrescriptionChange(idx, 'frequency', e.target.value)}
                    className="px-3 py-1.5 border rounded text-xs outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Days"
                      value={p.durationDays}
                      onChange={(e) => handlePrescriptionChange(idx, 'durationDays', Number(e.target.value))}
                      className="w-full px-3 py-1.5 border rounded text-xs outline-none"
                    />
                    {prescriptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePrescriptionRow(idx)}
                        className="text-red-500 font-bold text-sm px-2"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg text-sm transition"
            >
              {submitting ? 'Saving Notes & Generating Summary...' : 'Save Consultation Record & Complete Visit'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
