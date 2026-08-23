'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Doctor {
  id: string
  specialization: string
  slotDuration: number
  experienceYears: number
  fee: number
  rating: number
  totalReviews: number
  languages: string
  bio: string | null
  user: { name: string; email: string }
}

interface Slot {
  startTime: string
  endTime: string
  status: 'AVAILABLE' | 'BOOKED' | 'HOLD'
}

interface UserProfile {
  name: string
  email: string
}

const SPECIALIZATION_CATEGORIES = [
  { id: 'All', label: 'All', icon: '⚡' },
  { id: 'General Physician', label: 'General Physician', icon: '🩺' },
  { id: 'Cardiology', label: 'Cardiologist', icon: '❤️' },
  { id: 'Dermatology', label: 'Dermatologist', icon: '🧪' },
  { id: 'Orthopedics', label: 'Orthopedic', icon: '🦴' },
  { id: 'Pediatrics', label: 'Pediatrician', icon: '👶' },
  { id: 'Neurology', label: 'Neurologist', icon: '🧠' },
]

export default function PatientDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationSearch, setLocationSearch] = useState('')

  // Right Drawer Selection
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [bookingHold, setBookingHold] = useState(false)
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {
    // Fetch logged in user profile
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setUser({ name: d.data.name, email: d.data.email })
      })

    // Fetch doctors list
    fetch('/api/doctors')
      .then((r) => r.json())
      .then((d) => {
        const docs: Doctor[] = d.data || []
        setDoctors(docs)
        if (docs.length > 0) setSelectedDoctor(docs[0])
      })
  }, [])

  // Fetch slots whenever selected doctor or date changes
  useEffect(() => {
    if (!selectedDoctor) return
    setLoadingSlots(true)
    fetch(`/api/doctors/${selectedDoctor.id}/slots?date=${selectedDate}`)
      .then((r) => r.json())
      .then((d) => {
        setSlots(d.data?.slots || [])
        setSelectedSlot(null)
      })
      .finally(() => setLoadingSlots(false))
  }, [selectedDoctor, selectedDate])

  const filteredDoctors = doctors.filter((doc) => {
    const matchCat = selectedCategory === 'All' || doc.specialization === selectedCategory
    const matchSearch =
      doc.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  const handleContinueToSymptoms = async () => {
    if (!selectedDoctor || !selectedSlot) return
    setBookingHold(true)
    setBookingError('')

    try {
      const res = await fetch('/api/appointments/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          date: selectedDate,
          startTime: selectedSlot.startTime,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setBookingError(data.message || 'Failed to hold slot')
        return
      }

      // Redirect to booking detail page step
      window.location.href = `/patient/doctors/${selectedDoctor.id}?date=${selectedDate}&slot=${selectedSlot.startTime}`
    } catch {
      setBookingError('Error placing slot hold. Try again.')
    } finally {
      setBookingHold(false)
    }
  }

  // Generate date tabs (Today, Sun, Mon, Tue...)
  const dateOptions = Array.from({ length: 4 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const isoStr = d.toISOString().split('T')[0]
    const dayName = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' })
    const dayNum = d.getDate()
    const monthName = d.toLocaleDateString('en-US', { month: 'short' })
    return { isoStr, dayName, dayNum, monthName }
  })

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      {/* ── 1. Left Sidebar Navigation (Sticky Static) ── */}
      <aside className="w-64 bg-[#eaf6f2] border-r border-teal-100/80 flex flex-col justify-between hidden md:flex flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center gap-2 border-b border-teal-100/60">
            <img src="/medicare-logo.png" alt="MEDICARE+" className="h-6 w-auto object-contain" />
            <span className="text-xs font-extrabold tracking-wider bg-blue-100/80 text-blue-900 px-2 py-0.5 rounded-md">
              Patient Panel
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 space-y-1 mt-3">
            <Link
              href="/patient/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 bg-teal-700 text-white rounded-xl font-bold text-xs shadow-2xs transition"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </Link>
            <Link
              href="/patient/doctors"
              className="flex items-center gap-3 px-3.5 py-2.5 text-slate-700 hover:bg-white/60 hover:text-slate-900 rounded-xl font-semibold text-xs transition"
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Book Appointment</span>
            </Link>
            <Link
              href="/patient/appointments"
              className="flex items-center gap-3 px-3.5 py-2.5 text-slate-700 hover:bg-white/60 hover:text-slate-900 rounded-xl font-semibold text-xs transition"
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>My Appointments</span>
            </Link>
            <Link
              href="/patient/appointments?status=COMPLETED"
              className="flex items-center gap-3 px-3.5 py-2.5 text-slate-700 hover:bg-white/60 hover:text-slate-900 rounded-xl font-semibold text-xs transition"
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Past Visits</span>
            </Link>
            <Link
              href="/patient/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 text-slate-700 hover:bg-white/60 hover:text-slate-900 rounded-xl font-semibold text-xs transition"
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a6.5 6.5 0 00-9.192-9.192l-6 6a6.5 6.5 0 009.192 9.192l6-6zM10.5 10.5l3 3" />
              </svg>
              <span>Medication Reminders</span>
            </Link>
          </nav>
        </div>

        {/* Need Help Card */}
        <div className="p-4 m-4 bg-white/80 border border-teal-100/90 rounded-2xl shadow-2xs">
          <p className="font-bold text-xs text-slate-900">Need Help?</p>
          <p className="text-[11px] text-slate-500 mt-0.5 mb-3 leading-tight">Our support team is here to help you</p>
          <button className="w-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition shadow-2xs cursor-pointer">
            Contact Support →
          </button>
        </div>
      </aside>

      {/* ── 2. Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Good morning, {user?.name || 'John'} 👋
            </h2>
            <p className="text-xs text-slate-500 font-medium">Take charge of your health today.</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition">
              <span>🔔</span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 font-bold text-sm">
                {user?.name ? user.name.charAt(0) : 'J'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'John Doe'}</p>
                <p className="text-[11px] text-slate-400 font-medium">Patient</p>
              </div>
            </div>
            <button
              onClick={() => fetch('/api/auth/logout', { method: 'POST' }).then(() => (window.location.href = '/login'))}
              className="text-xs text-red-600 font-semibold hover:underline ml-2"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">Book Appointment</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Find the right doctor and book your slot</p>
          </div>

          {/* Main Grid: Left Doctor Listing + Right Doctor Booking Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Columns: Search, Categories & Doctors List */}
            <div className="lg:col-span-8 space-y-6">
              {/* Search Bar Row */}
              <div className="bg-white p-2 rounded-2xl shadow-xs border border-slate-200 flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl flex-1 border border-slate-100">
                  <span className="text-slate-400">📍</span>
                  <input
                    type="text"
                    placeholder="Current Location"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="bg-transparent text-xs font-medium text-slate-900 placeholder-slate-400 outline-none w-full"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl flex-[2] border border-slate-100">
                  <span className="text-slate-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search doctors, specialties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs font-medium text-slate-900 placeholder-slate-400 outline-none w-full"
                  />
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-blue-600/20">
                  Search
                </button>
              </div>

              {/* Specializations Horizontal Scroll Bar */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-3">Specializations</p>
                <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
                  {SPECIALIZATION_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex flex-col items-center justify-center p-3 min-w-[85px] rounded-2xl border transition flex-shrink-0 ${
                        selectedCategory === cat.id
                          ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1 ${
                          selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {cat.icon}
                      </div>
                      <span
                        className={`text-[11px] font-semibold text-center truncate max-w-[80px] ${
                          selectedCategory === cat.id ? 'text-blue-700' : 'text-slate-600'
                        }`}
                      >
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Doctors List */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-700">Available Doctors</p>

                {filteredDoctors.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400">
                    No doctors found for this filter.
                  </div>
                ) : (
                  filteredDoctors.map((doc) => {
                    const isSelected = selectedDoctor?.id === doc.id
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctor(doc)}
                        className={`bg-white rounded-2xl p-5 border transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          isSelected
                            ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-700 font-extrabold text-xl border border-blue-200">
                              {doc.user.name.charAt(3) || 'D'}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-slate-900 text-sm">{doc.user.name}</h4>
                              <span className="text-blue-600 text-xs font-bold">✓</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">MBBS, MD - {doc.specialization}</p>
                            <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                              <span>👨‍⚕️ {doc.experienceYears}+ Years Exp.</span>
                              <span>•</span>
                              <span>🌐 {doc.languages}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                              <span>★ {doc.rating}</span>
                              <span className="text-[11px] text-slate-400 font-normal">({doc.totalReviews} reviews)</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                          <div>
                            <p className="text-[11px] text-slate-400 font-medium">Next Available</p>
                            <p className="text-xs font-bold text-emerald-600 mt-0.5">Today, 11:30 AM</p>
                            <p className="text-xs font-bold text-slate-900 mt-1">Fee: ₹{doc.fee}</p>
                          </div>
                          <span className="text-slate-400 text-sm font-bold sm:mt-2">›</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Right 4 Columns: Selected Doctor Profile & Time Slot Selector */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 sticky top-24">
              {selectedDoctor ? (
                <>
                  {/* Doctor Profile Header */}
                  <div className="text-center pb-6 border-b border-slate-100">
                    <div className="relative inline-block mb-3">
                      <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
                        {selectedDoctor.user.name.charAt(3) || 'D'}
                      </div>
                      <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <h4 className="font-bold text-slate-900 text-base">{selectedDoctor.user.name}</h4>
                      <span className="text-blue-600 text-xs font-bold">✓</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      MBBS, MD - {selectedDoctor.specialization}
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-2 text-xs text-slate-500">
                      <span>👨‍⚕️ {selectedDoctor.experienceYears}+ Years Exp.</span>
                      <span>•</span>
                      <span>🌐 {selectedDoctor.languages}</span>
                    </div>
                    <p className="text-xs text-amber-500 font-bold mt-1">
                      ★ {selectedDoctor.rating}{' '}
                      <span className="text-[11px] text-slate-400 font-normal">({selectedDoctor.totalReviews} reviews)</span>
                    </p>
                  </div>

                  {/* About Doctor */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-slate-900">About Doctor</p>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {selectedDoctor.bio || `${selectedDoctor.user.name} is a dedicated physician with over ${selectedDoctor.experienceYears} years of experience in providing comprehensive healthcare.`}
                    </p>
                  </div>

                  {/* Select Date */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">Select Date</p>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="text-xs border rounded-lg px-2 py-1 outline-none text-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {dateOptions.map((opt) => (
                        <button
                          key={opt.isoStr}
                          onClick={() => setSelectedDate(opt.isoStr)}
                          className={`py-2 rounded-xl text-center border transition ${
                            selectedDate === opt.isoStr
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <p className="text-[10px] font-medium opacity-80">{opt.dayName}</p>
                          <p className="text-xs font-bold mt-0.5">{opt.dayNum} {opt.monthName}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Available Time Slots */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-900">Available Time Slots</p>
                    {loadingSlots ? (
                      <div className="flex justify-center py-6">
                        <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                      </div>
                    ) : slots.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No slots available for this date</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {slots.slice(0, 12).map((slot) => (
                          <button
                            key={slot.startTime}
                            disabled={slot.status !== 'AVAILABLE'}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 px-1 rounded-xl text-xs font-medium text-center border transition ${
                              slot.status === 'AVAILABLE'
                                ? selectedSlot?.startTime === slot.startTime
                                  ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                                : 'bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed line-through'
                            }`}
                          >
                            {slot.startTime}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {bookingError && (
                    <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">
                      {bookingError}
                    </div>
                  )}

                  {/* Continue Button */}
                  <button
                    disabled={!selectedSlot || bookingHold}
                    onClick={handleContinueToSymptoms}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
                  >
                    {bookingHold ? 'Holding Slot...' : `Continue to Symptoms (${selectedSlot?.startTime || 'Select Slot'}) →`}
                  </button>
                </>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Select a doctor to view slots and book an appointment.
                </div>
              )}
            </div>
          </div>

          {/* Bottom 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
            <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/10 text-blue-700 rounded-xl flex items-center justify-center text-lg font-bold">
                🛡️
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Secure & Private</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Encrypted health information</p>
              </div>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600/10 text-emerald-700 rounded-xl flex items-center justify-center text-lg font-bold">
                📅
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Easy Booking</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Book in just a few clicks</p>
              </div>
            </div>

            <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-600/10 text-amber-700 rounded-xl flex items-center justify-center text-lg font-bold">
                🔔
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Timely Reminders</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Appointments & medications</p>
              </div>
            </div>

            <div className="bg-purple-50/60 border border-purple-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600/10 text-purple-700 rounded-xl flex items-center justify-center text-lg font-bold">
                📄
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">AI Health Insights</p>
                <p className="text-[11px] text-slate-500 mt-0.5">AI pre-visit & post-visit summaries</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
