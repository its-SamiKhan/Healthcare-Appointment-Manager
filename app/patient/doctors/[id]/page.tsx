'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { GenderAvatar } from '@/components/gender-avatar'

interface Slot {
  startTime: string
  endTime: string
  status: 'AVAILABLE' | 'BOOKED' | 'HOLD'
}

interface Doctor {
  id: string
  specialization: string
  bio: string | null
  slotDuration: number
  workingHours: Record<string, { start: string; end: string; available: boolean }>
  user: { name: string; email: string }
}

export default function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date()
    return d.toISOString().split('T')[0]
  })
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [booking, setBooking] = useState(false)
  const [step, setStep] = useState<'slots' | 'symptoms' | 'confirm'>('slots')
  const [symptoms, setSymptoms] = useState({
    chiefComplaint: '',
    duration: '',
    severity: 5,
    previousConditions: '',
    currentMedicines: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/doctors?id=${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          const found = d.data.find((doc: Doctor) => doc.id === id)
          setDoctor(found || null)
        }
      })
  }, [id])

  useEffect(() => {
    if (!selectedDate) return
    setLoadingSlots(true)
    fetch(`/api/doctors/${id}/slots?date=${selectedDate}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.data?.slots || []))
      .finally(() => setLoadingSlots(false))
  }, [id, selectedDate])

  const handleHoldSlot = async () => {
    if (!selectedSlot) return
    setError('')
    try {
      const res = await fetch('/api/appointments/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId: id, date: selectedDate, startTime: selectedSlot.startTime }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message)
        return
      }
      setStep('symptoms')
    } catch {
      setError('Failed to hold slot. Please try again.')
    }
  }

  const handleBook = async () => {
    if (!selectedSlot) return
    setBooking(true)
    setError('')
    try {
      // Book the appointment
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId: id, date: selectedDate, startTime: selectedSlot.startTime }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message)
        return
      }

      const appointmentId = data.data.id

      // Submit symptoms
      if (symptoms.chiefComplaint) {
        await fetch(`/api/appointments/${appointmentId}/symptoms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(symptoms),
        })
      }

      router.push(`/patient/appointments/${appointmentId}?booked=true`)
    } catch {
      setError('Booking failed. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <Link href="/patient/doctors" className="text-sm text-blue-600">← Back to Doctors</Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Doctor Profile */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <GenderAvatar name={doctor.user.name} className="w-16 h-16" iconClassName="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dr. {doctor.user.name}</h1>
              <p className="text-blue-600 font-medium">{doctor.specialization}</p>
              {doctor.bio && <p className="text-gray-600 text-sm mt-2">{doctor.bio}</p>}
              <p className="text-xs text-gray-400 mt-1">⏱ {doctor.slotDuration}-minute appointments</p>
            </div>
          </div>
        </div>

        {/* Step: Select Slot */}
        {step === 'slots' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Select a Date & Time</h2>

            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null) }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

            {loadingSlots ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full" />
              </div>
            ) : slots.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No available slots for this date</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-6">
                {slots.map((slot) => {
                  const isOccupied = slot.status !== 'AVAILABLE'
                  return (
                    <button
                      key={slot.startTime}
                      disabled={isOccupied}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 ${
                        slot.status === 'AVAILABLE'
                          ? selectedSlot?.startTime === slot.startTime
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 cursor-pointer'
                          : slot.status === 'HOLD'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed opacity-80'
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-80'
                      }`}
                    >
                      <span className={isOccupied ? 'line-through' : ''}>{slot.startTime}</span>
                      {isOccupied && (
                        <span className="text-[9px] font-extrabold uppercase bg-slate-200/90 text-slate-600 px-1 py-0.2 rounded-xs">
                          {slot.status === 'HOLD' ? 'Reserved' : 'Occupied'}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-100 rounded"></span>Available</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-50 border border-yellow-200 rounded"></span>On Hold</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-100 rounded"></span>Booked</span>
            </div>

            <button
              disabled={!selectedSlot}
              onClick={handleHoldSlot}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              Continue with {selectedSlot?.startTime || 'selected slot'} →
            </button>
          </div>
        )}

        {/* Step: Symptoms */}
        {step === 'symptoms' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold">Describe Your Symptoms</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">AI-Powered</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">Our AI will analyze your symptoms to help the doctor prepare for your visit.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint *</label>
                <textarea
                  required
                  rows={2}
                  value={symptoms.chiefComplaint}
                  onChange={(e) => setSymptoms({ ...symptoms, chiefComplaint: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Persistent headache for 3 days"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    value={symptoms.duration}
                    onChange={(e) => setSymptoms({ ...symptoms, duration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., 3 days, 2 weeks"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity: <strong>{symptoms.severity}/10</strong>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={symptoms.severity}
                    onChange={(e) => setSymptoms({ ...symptoms, severity: Number(e.target.value) })}
                    className="w-full mt-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Conditions</label>
                <input
                  type="text"
                  value={symptoms.previousConditions}
                  onChange={(e) => setSymptoms({ ...symptoms, previousConditions: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Hypertension, Diabetes (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Medicines</label>
                <input
                  type="text"
                  value={symptoms.currentMedicines}
                  onChange={(e) => setSymptoms({ ...symptoms, currentMedicines: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Metformin 500mg (optional)"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep('slots')} className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition">
                ← Back
              </button>
              <button
                onClick={() => setStep('confirm')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Review Booking →
              </button>
            </div>
          </div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Confirm Your Appointment</h2>

            {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

            <div className="bg-blue-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Doctor</span>
                <span className="font-medium">Dr. {doctor.user.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time</span>
                <span className="font-medium">{selectedSlot?.startTime} – {selectedSlot?.endTime}</span>
              </div>
              {symptoms.chiefComplaint && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Complaint</span>
                  <span className="font-medium text-right max-w-xs">{symptoms.chiefComplaint}</span>
                </div>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 text-sm text-green-700">
              ✅ After booking: You will receive a confirmation email and your Google Calendar will be updated automatically.
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('symptoms')} className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition">
                ← Back
              </button>
              <button
                onClick={handleBook}
                disabled={booking}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
              >
                {booking ? 'Booking…' : '✓ Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
