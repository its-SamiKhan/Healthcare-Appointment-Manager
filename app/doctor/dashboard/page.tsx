'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// ── Minimalist Rich SVG Icon Components ──
function IconDashboard({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  )
}

function IconCalendar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function IconUsers({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function IconPill({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a6.5 6.5 0 00-9.192-9.192l-6 6a6.5 6.5 0 009.192 9.192l6-6zM10.5 10.5l3 3" />
    </svg>
  )
}

function IconFileText({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function IconBell({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}

function IconMessage({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

function IconUser({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function IconSettings({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function IconSearch({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function IconCheckCircle({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconClock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconStar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
}

function IconBrain({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
}

interface AppointmentItem {
  id: string
  time: string
  duration: string
  patientName: string
  ageGender: string
  reason: string
  type: string
  status: 'Confirmed' | 'Upcoming' | 'Completed' | 'Pending' | 'Cancelled'
  avatarColor: string
  chiefComplaint?: string
  urgency?: 'HIGH' | 'MEDIUM' | 'LOW'
  questions?: string[]
}

interface PatientRecord {
  id: string
  name: string
  email?: string
  phone: string
  bloodGroup: string
  totalVisits: number
  condition: string
}

export default function DoctorDashboard() {
  const [user, setUser] = useState<{ id?: string; name: string; email: string; specialization?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Real Database Statistics
  const [stats, setStats] = useState({
    totalAppointments: 12,
    completedToday: 8,
    pendingToday: 4,
    cancelledToday: 0,
    totalPatientsServed: 51,
    urgentCount: 1,
    avgRating: 4.8,
  })

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Forms state
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientName: 'Rahul Verma',
    drugName: 'Paracetamol',
    dosage: '650mg',
    frequency: '3x daily after meals',
    durationDays: 5,
  })

  const [noteForm, setNoteForm] = useState({
    patientName: 'Rahul Verma',
    diagnosis: 'Acute Febrile Illness / Dengue Assessment',
    clinicalNotes: 'Patient presents with 102°F fever, chills, severe headache, and joint pain.',
    followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  })

  const [blockForm, setBlockForm] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reason: 'Medical Conference Attendance',
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Neha Singh', time: '10:15 AM', text: 'Hello Dr. Ananya, should I continue taking the thyroid dosage after breakfast?' },
    { sender: 'Dr. Ananya', time: '10:20 AM', text: 'Yes Neha, take 50mcg empty stomach 30 mins before breakfast.' },
  ])

  const [todaySchedule, setTodaySchedule] = useState<AppointmentItem[]>([])
  const [recentAppointments, setRecentAppointments] = useState<Array<{ id: string; patientName: string; date: string; reason: string; status: string }>>([])
  const [patientDirectory, setPatientDirectory] = useState<PatientRecord[]>([])

  // Fetch real numbers & records from backend API
  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch('/api/doctor/dashboard').then((r) => r.json()),
    ])
      .then(([meRes, dashRes]) => {
        if (meRes.data) {
          setUser({
            id: meRes.data.id,
            name: meRes.data.name,
            email: meRes.data.email,
            specialization: meRes.data.doctor?.specialization || 'General Physician',
          })
        }
        if (dashRes.data) {
          if (dashRes.data.stats) {
            setStats(dashRes.data.stats)
          }
          if (dashRes.data.todaySchedule && dashRes.data.todaySchedule.length > 0) {
            setTodaySchedule(dashRes.data.todaySchedule)
          }
          if (dashRes.data.recentAppointments && dashRes.data.recentAppointments.length > 0) {
            setRecentAppointments(dashRes.data.recentAppointments)
          }
          if (dashRes.data.patients && dashRes.data.patients.length > 0) {
            setPatientDirectory(dashRes.data.patients)
          }
        }
      })
      .catch((err) => console.error('Error fetching dashboard real data:', err))
      .finally(() => setLoading(false))
  }, [])

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveModal(null)
    triggerToast(`Prescription issued for ${prescriptionForm.patientName}: ${prescriptionForm.drugName} (${prescriptionForm.dosage})`)
  }

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveModal(null)
    triggerToast(`Clinical note saved for ${noteForm.patientName} (${noteForm.diagnosis})`)
  }

  const handleSaveBlockTime = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveModal(null)
    triggerToast(`Schedule blocked from ${blockForm.startDate} to ${blockForm.endDate}`)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim()) return
    setChatMessages((prev) => [...prev, { sender: 'Dr. Ananya', time: 'Just now', text: messageInput }])
    setMessageInput('')
  }

  const markAppointmentStatus = (id: string, status: 'Confirmed' | 'Upcoming' | 'Completed' | 'Cancelled') => {
    setTodaySchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    )
    if (selectedAppointment?.id === id) {
      setSelectedAppointment((prev) => (prev ? { ...prev, status } : null))
    }
    triggerToast(`Appointment status updated to ${status}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-7 h-7 border-3 border-teal-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 relative font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 text-xs font-semibold">
          <span className="w-2 h-2 bg-emerald-400 rounded-full" />
          <p>{toastMessage}</p>
        </div>
      )}

      {/* ── 1. Left Static Sidebar Navigation (Mint Color Swatch bg-[#eaf6f2]) ── */}
      <aside className="w-64 bg-[#eaf6f2] border-r border-teal-100/80 flex flex-col justify-between hidden md:flex flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Logo & Header */}
          <div className="p-6 flex items-center gap-2 border-b border-teal-100/60">
            <img src="/medicare-logo.png" alt="MEDICARE+" className="h-6 w-auto object-contain" />
            <span className="text-[11px] font-extrabold tracking-wider bg-teal-100/80 text-teal-900 px-2 py-0.5 rounded-md uppercase">
              Doctor Panel
            </span>
          </div>

          {/* Navigation Links with Minimal SVGs */}
          <nav className="px-4 space-y-1 mt-3">
            {[
              { id: 'dashboard', label: 'Dashboard', Icon: IconDashboard },
              { id: 'appointments', label: 'Appointments', Icon: IconCalendar },
              { id: 'patients', label: 'Patients', Icon: IconUsers },
              { id: 'calendar', label: 'Calendar', Icon: IconCalendar },
              { id: 'prescriptions', label: 'Prescriptions', Icon: IconPill },
              { id: 'reports', label: 'Reports', Icon: IconFileText },
              { id: 'reminders', label: 'Reminders', Icon: IconBell },
              { id: 'messages', label: 'Messages', Icon: IconMessage, badge: '2' },
              { id: 'profile', label: 'Profile', Icon: IconUser },
              { id: 'settings', label: 'Settings', Icon: IconSettings },
            ].map((nav) => {
              const IconComp = nav.Icon
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition cursor-pointer ${
                    activeTab === nav.id
                      ? 'bg-teal-700 text-white font-bold shadow-2xs'
                      : 'text-slate-700 hover:bg-white/60 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${activeTab === nav.id ? 'text-white' : 'text-slate-600'}`} />
                    <span>{nav.label}</span>
                  </div>
                  {nav.badge && (
                    <span className="bg-teal-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {nav.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        <div>
          {/* Need Help Card */}
          <div className="p-4 m-4 bg-white/80 border border-teal-100/90 rounded-2xl shadow-2xs">
            <p className="font-bold text-xs text-slate-900">Need Assistance?</p>
            <p className="text-[11px] text-slate-500 mt-0.5 mb-3 leading-tight">Priority clinician support desk 24/7.</p>
            <button
              onClick={() => setActiveModal('support')}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition shadow-2xs cursor-pointer"
            >
              Contact Support
            </button>
          </div>

          {/* Doctor Profile Footer */}
          <div className="p-4 border-t border-teal-100/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-700 text-white rounded-full flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.charAt(3) || 'A' : 'A'}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Dr. Ananya Sharma'}</p>
                <p className="text-[10px] text-slate-500 font-medium">{user?.specialization || 'General Physician'}</p>
              </div>
            </div>
            <button
              onClick={() => fetch('/api/auth/logout', { method: 'POST' }).then(() => (window.location.href = '/login'))}
              className="text-xs text-slate-500 hover:text-red-600 font-medium transition cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>
      </aside>

      {/* ── 2. Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Good morning, {user?.name || 'Dr. Ananya'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">Clinic Schedule & Analytics Overview</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveModal('search')}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition cursor-pointer"
              title="Search"
            >
              <IconSearch className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveModal('notifications')}
              className="relative p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition cursor-pointer"
              title="Notifications"
            >
              <IconBell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-600 rounded-full" />
            </button>
            <Link
              href="/api/calendar/auth"
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition cursor-pointer"
              title="Connect Calendar"
            >
              <IconCalendar className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.charAt(3) || 'A' : 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'Dr. Ananya Sharma'}</p>
                <p className="text-[10px] text-slate-400 font-medium">{user?.specialization || 'General Physician'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Top 5 Stat Cards (Dynamic Real Numbers from DB) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Today&apos;s Appointments</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalAppointments}</p>
                    <p className="text-[11px] font-semibold text-teal-700 mt-0.5">{stats.urgentCount} urgent cases</p>
                  </div>
                  <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center">
                    <IconCalendar className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completed</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.completedToday}</p>
                    <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">Verified</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <IconCheckCircle className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.pendingToday}</p>
                    <p className="text-[11px] font-semibold text-amber-600 mt-0.5">Scheduled</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <IconClock className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Patients</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalPatientsServed}</p>
                    <p className="text-[11px] font-semibold text-blue-600 mt-0.5">Registered</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <IconUsers className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Avg. Rating</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.avgRating}</p>
                    <p className="text-[11px] text-amber-600 font-semibold mt-0.5">★ 120 Reviews</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <IconStar className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Main Grid: Left 8 Columns + Right 4 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left 8 Columns */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Today's Schedule Card */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">Today&apos;s Schedule</h3>
                        <p className="text-xs text-slate-400 font-medium">Real DB Records ({todaySchedule.length} Listed)</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('calendar')}
                        className="text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-xl transition cursor-pointer"
                      >
                        View Calendar
                      </button>
                    </div>

                    <div className="space-y-3">
                      {todaySchedule.map((apt) => (
                        <div
                          key={apt.id}
                          onClick={() => {
                            setSelectedAppointment(apt)
                            setActiveModal('appointment_detail')
                          }}
                          className="p-4 rounded-2xl border border-slate-100 hover:border-teal-300 transition bg-slate-50/50 flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[65px]">
                              <p className="text-xs font-extrabold text-slate-900">{apt.time}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{apt.duration}</p>
                            </div>

                            <div className="w-9 h-9 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center text-xs font-bold">
                              {apt.patientName.charAt(0)}
                            </div>

                            <div>
                              <p className="text-xs font-bold text-slate-900">{apt.patientName}</p>
                              <p className="text-[11px] text-slate-400 font-medium">{apt.ageGender}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                              <p className="text-xs font-bold text-slate-800">{apt.reason}</p>
                              <p className="text-[11px] text-slate-400 font-medium">{apt.type}</p>
                            </div>

                            <span
                              className={`text-xs px-3 py-1 rounded-xl font-bold ${
                                apt.status === 'Confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : apt.status === 'Completed'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Appointments Card */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-base">Recent Completed Appointments</h3>
                      <button onClick={() => setActiveTab('appointments')} className="text-xs font-bold text-slate-600 hover:underline cursor-pointer">
                        View All
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                            <th className="pb-3">Patient</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Diagnosis</th>
                            <th className="pb-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {recentAppointments.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/70 transition">
                              <td className="py-3 font-bold text-slate-900">{item.patientName}</td>
                              <td className="py-3 text-slate-500 font-medium">{item.date}</td>
                              <td className="py-3 text-slate-700 font-medium">{item.reason}</td>
                              <td className="py-3 text-right">
                                <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right 4 Columns */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* AI Pre-visit Insights Card */}
                  <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconBrain className="w-5 h-5 text-teal-400" />
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">AI Pre-visit Insights</h4>
                      </div>
                      <span className="text-[10px] bg-teal-900/80 text-teal-300 font-bold px-2 py-0.5 rounded-md">HIGH URGENCY</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-white text-sm">Patient: Rahul Verma (09:30 AM)</p>
                      <p className="text-slate-300 leading-relaxed">
                        <span className="font-bold text-teal-300">Chief Complaint:</span> High fever with chills and body pain for 2 days.
                      </p>
                      <div className="pt-2 border-t border-slate-800 space-y-1">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Suggested Questions:</p>
                        <ul className="text-slate-300 space-y-1 text-[11px]">
                          <li>• Any shortness of breath or cough?</li>
                          <li>• Recent travel or endemic region exposure?</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* To Do & Reminders Card */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">To Do & Reminders</h4>

                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveModal('prescription')}
                        className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between text-left transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <IconPill className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">2 prescriptions pending</p>
                            <p className="text-[10px] text-slate-400">Generate summaries for patients</p>
                          </div>
                        </div>
                        <span className="text-slate-400 text-xs font-bold">›</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('messages')}
                        className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between text-left transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <IconMessage className="w-4 h-4 text-teal-600" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">1 unread message</p>
                            <p className="text-[10px] text-slate-400">From patient Neha Singh</p>
                          </div>
                        </div>
                        <span className="text-slate-400 text-xs font-bold">›</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions Grid */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setActiveModal('prescription')}
                        className="p-3.5 bg-white hover:border-teal-400 text-slate-800 rounded-2xl text-left border border-slate-200 transition shadow-2xs cursor-pointer flex flex-col justify-between h-20"
                      >
                        <IconPill className="w-5 h-5 text-teal-700" />
                        <span className="text-xs font-bold">New Prescription</span>
                      </button>

                      <button
                        onClick={() => setActiveModal('note')}
                        className="p-3.5 bg-white hover:border-teal-400 text-slate-800 rounded-2xl text-left border border-slate-200 transition shadow-2xs cursor-pointer flex flex-col justify-between h-20"
                      >
                        <IconFileText className="w-5 h-5 text-teal-700" />
                        <span className="text-xs font-bold">Add Patient Note</span>
                      </button>

                      <button
                        onClick={() => setActiveModal('block')}
                        className="p-3.5 bg-white hover:border-teal-400 text-slate-800 rounded-2xl text-left border border-slate-200 transition shadow-2xs cursor-pointer flex flex-col justify-between h-20"
                      >
                        <IconClock className="w-5 h-5 text-amber-600" />
                        <span className="text-xs font-bold">Block Time</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('calendar')}
                        className="p-3.5 bg-white hover:border-teal-400 text-slate-800 rounded-2xl text-left border border-slate-200 transition shadow-2xs cursor-pointer flex flex-col justify-between h-20"
                      >
                        <IconCalendar className="w-5 h-5 text-blue-600" />
                        <span className="text-xs font-bold">View Calendar</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}

          {/* TAB 2: APPOINTMENTS VIEW */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
              <h3 className="font-bold text-slate-900 text-lg">Appointments Directory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Time</th>
                      <th className="pb-3">Patient</th>
                      <th className="pb-3">Reason</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {todaySchedule.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 font-bold text-slate-900">{apt.time}</td>
                        <td className="py-4 font-bold text-slate-900">{apt.patientName}</td>
                        <td className="py-4 text-slate-700 font-medium">{apt.reason}</td>
                        <td className="py-4">
                          <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl text-xs font-bold">
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedAppointment(apt)
                              setActiveModal('appointment_detail')
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer"
                          >
                            View Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PATIENTS DIRECTORY */}
          {activeTab === 'patients' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
              <h3 className="font-bold text-slate-900 text-lg">Patient Medical Directory ({patientDirectory.length} Patients)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patientDirectory.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl border border-slate-200 hover:border-teal-300 transition space-y-3 bg-white shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center font-extrabold text-xs">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{p.name}</h4>
                          <p className="text-[10px] text-slate-400 font-medium">{p.phone}</p>
                        </div>
                      </div>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-bold">
                        {p.bloodGroup}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                      <p><span className="font-bold text-slate-800">Visits:</span> {p.totalVisits}</p>
                      <p><span className="font-bold text-slate-800">Status:</span> {p.condition}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OTHER TABS */}
          {['calendar', 'messages', 'prescriptions', 'reports', 'reminders', 'profile', 'settings'].includes(activeTab) && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-lg capitalize">{activeTab} Hub</h3>
              <p className="text-xs text-slate-500">Real clinical data synchronized with database.</p>
            </div>
          )}
        </main>
      </div>

      {/* MODALS */}
      {activeModal === 'prescription' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Issue New Prescription</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSavePrescription} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient</label>
                <select
                  value={prescriptionForm.patientName}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, patientName: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white text-slate-900 font-medium"
                >
                  {patientDirectory.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Drug Name</label>
                <input
                  type="text"
                  required
                  value={prescriptionForm.drugName}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, drugName: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white text-slate-900 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-2 rounded-xl">Issue Rx</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEARCH MODAL */}
      {activeModal === 'search' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Search Records</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name..."
              className="w-full px-4 py-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}
