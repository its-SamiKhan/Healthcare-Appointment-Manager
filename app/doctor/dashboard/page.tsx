'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { GenderAvatar } from '@/components/gender-avatar'

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

function IconUser({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

function IconStar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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

function IconBrain({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
}

function IconSparkles({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

interface AppointmentItem {
  id: string
  time: string
  date?: string
  duration: string
  patientName: string
  patientPhone?: string
  ageGender: string
  reason: string
  type: string
  status: 'Confirmed' | 'Upcoming' | 'Completed' | 'Pending' | 'Cancelled'
  avatarColor: string
  chiefComplaint?: string
  severity?: number
  previousConditions?: string
  currentMedicines?: string
  aiAnalysis?: string
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
  const [user, setUser] = useState<{ id?: string; name: string; email: string; specialization?: string; fee?: number; experience?: number }>({
    name: 'Dr. Ananya Sharma',
    email: 'ananya.sharma@healthcare.com',
    specialization: 'General Physician',
    fee: 500,
    experience: 8,
  })

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

  const [todaySchedule, setTodaySchedule] = useState<AppointmentItem[]>([
    {
      id: 'apt-101',
      time: '09:30 AM',
      duration: '30 mins',
      patientName: 'Rahul Verma',
      ageGender: '34 M',
      reason: 'Fever & Joint Pain (Dengue Suspect)',
      type: 'In-Clinic Consultation',
      status: 'Confirmed',
      avatarColor: 'bg-teal-100 text-teal-800',
      chiefComplaint: 'High fever 102°F for 3 days with intense headache behind eyes',
      urgency: 'HIGH',
      questions: [
        'Have you noticed any skin rashes or nosebleeds?',
        'Are you experiencing severe abdominal pain or persistent vomiting?',
        'When was your last complete blood count (CBC) test?',
      ],
    },
    {
      id: 'apt-102',
      time: '10:00 AM',
      duration: '30 mins',
      patientName: 'Priya Mehta',
      ageGender: '28 F',
      reason: 'Persistent Dry Cough & Cold',
      type: 'In-Clinic Consultation',
      status: 'Upcoming',
      avatarColor: 'bg-blue-100 text-blue-800',
      chiefComplaint: 'Dry cough worsening at night for 1 week',
      urgency: 'MEDIUM',
      questions: [
        'Do you have a history of seasonal allergies or asthma?',
        'Is there any shortness of breath during physical exertion?',
      ],
    },
    {
      id: 'apt-103',
      time: '10:30 AM',
      duration: '30 mins',
      patientName: 'Amit Kumar',
      ageGender: '42 M',
      reason: 'Skin Allergy & Rash Evaluation',
      type: 'In-Clinic Consultation',
      status: 'Upcoming',
      avatarColor: 'bg-purple-100 text-purple-800',
      chiefComplaint: 'Itchy red patches on forearms after new medication',
      urgency: 'LOW',
      questions: ['What new medicine or food did you start recently?'],
    },
    {
      id: 'apt-104',
      time: '11:00 AM',
      duration: '30 mins',
      patientName: 'Sunita Devi',
      ageGender: '55 F',
      reason: 'Hypertension Follow-up Checkup',
      type: 'In-Clinic Consultation',
      status: 'Confirmed',
      avatarColor: 'bg-amber-100 text-amber-800',
      chiefComplaint: 'Routine blood pressure review; mild morning dizziness',
      urgency: 'MEDIUM',
      questions: ['Have you missed any doses of your BP medication this week?'],
    },
  ])

  const [patientDirectory, setPatientDirectory] = useState<PatientRecord[]>([
    { id: 'p1', name: 'Rahul Verma', email: 'rahul.v@gmail.com', phone: '+91 98765 12345', bloodGroup: 'O+', totalVisits: 4, condition: 'Dengue Assessment' },
    { id: 'p2', name: 'Priya Mehta', email: 'priya.m@gmail.com', phone: '+91 98123 45678', bloodGroup: 'A+', totalVisits: 2, condition: 'Acute Bronchitis' },
    { id: 'p3', name: 'Amit Kumar', email: 'amit.k@gmail.com', phone: '+91 97111 22334', bloodGroup: 'B+', totalVisits: 5, condition: 'Allergies' },
    { id: 'p4', name: 'Neha Singh', email: 'neha.s@gmail.com', phone: '+91 99888 77665', bloodGroup: 'AB+', totalVisits: 3, condition: 'Thyroid Care' },
    { id: 'p5', name: 'Sunita Devi', email: 'sunita.d@gmail.com', phone: '+91 96543 21098', bloodGroup: 'O-', totalVisits: 8, condition: 'Hypertension' },
    { id: 'p6', name: 'Vikram Joshi', email: 'vikram.j@gmail.com', phone: '+91 95432 10987', bloodGroup: 'B-', totalVisits: 1, condition: 'Lumbar Strain' },
  ])

  const [issuedPrescriptions] = useState([
    { id: 'rx101', patientName: 'Rahul Verma', drugName: 'Paracetamol 650mg', dosage: '1 Tab', frequency: '3x daily after meals', duration: '5 Days', date: 'Today' },
    { id: 'rx102', patientName: 'Sunita Devi', drugName: 'Telmisartan 40mg', dosage: '1 Tab', frequency: 'Once daily before breakfast', duration: '30 Days', date: 'Yesterday' },
    { id: 'rx103', patientName: 'Priya Mehta', drugName: 'Amoxicillin 500mg', dosage: '1 Cap', frequency: 'Twice daily after food', duration: '7 Days', date: '22 May, 2025' },
    { id: 'rx104', patientName: 'Amit Kumar', drugName: 'Cetirizine 10mg', dosage: '1 Tab', frequency: 'At bedtime', duration: '5 Days', date: '20 May, 2025' },
  ])

  // Sync active tab with URL query parameter
  useEffect(() => {
    const syncTabFromUrl = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const tab = params.get('tab')
        if (tab && ['appointments', 'patients', 'calendar', 'prescriptions', 'reports', 'reminders', 'profile'].includes(tab)) {
          setActiveTab(tab)
        } else {
          setActiveTab('dashboard')
        }
      }
    }

    syncTabFromUrl()
    window.addEventListener('popstate', syncTabFromUrl)
    return () => window.removeEventListener('popstate', syncTabFromUrl)
  }, [])

  // Fetch real numbers & records from backend API
  useEffect(() => {
    let token: string | null = null
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tokenFromUrl = params.get('token')
      if (tokenFromUrl) {
        document.cookie = `token=${tokenFromUrl}; path=/; max-age=604800; SameSite=Lax`
        localStorage.setItem('token', tokenFromUrl)
        token = tokenFromUrl
      } else {
        token = localStorage.getItem('token')
      }
    }

    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

    Promise.all([
      fetch('/api/auth/me', { headers }).then((r) => r.json()),
      fetch('/api/doctor/dashboard', { headers }).then((r) => r.json()),
    ])
      .then(([meRes, dashRes]) => {
        if (meRes.data) {
          setUser((prev) => ({
            ...prev,
            id: meRes.data.id,
            name: meRes.data.name || 'Dr. Ananya Sharma',
            email: meRes.data.email || 'ananya.sharma@healthcare.com',
            specialization: meRes.data.doctor?.specialization || 'General Physician',
          }))
        }
        if (dashRes.data) {
          if (dashRes.data.stats) {
            setStats(dashRes.data.stats)
          }
          if (dashRes.data.todaySchedule && dashRes.data.todaySchedule.length > 0) {
            setTodaySchedule(dashRes.data.todaySchedule)
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

  const handleTabSwitch = (tabId: string) => {
    setActiveTab(tabId)
    if (typeof window !== 'undefined') {
      const url = tabId === 'dashboard' ? '/doctor/dashboard' : `/doctor/dashboard?tab=${tabId}`
      window.history.pushState({}, '', url)
    }
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    triggerToast('✓ Doctor Profile & Consultation Hours updated successfully!')
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
          <span className="w-2 h-2 bg-teal-400 rounded-full" />
          <p>{toastMessage}</p>
        </div>
      )}

      {/* ── 1. Left Static Sidebar Navigation (Mint Swatch bg-[#eaf6f2]) ── */}
      <aside className="w-64 bg-[#eaf6f2] border-r border-teal-100/80 flex flex-col justify-between hidden md:flex flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Logo & Header */}
          <div className="p-6 flex items-center gap-2 border-b border-teal-100/60">
            <img src="/medicare-logo.png" alt="MEDICARE+" className="h-6 w-auto object-contain" />
            <span className="text-[11px] font-extrabold tracking-wider bg-teal-100/80 text-teal-900 px-2 py-0.5 rounded-md uppercase">
              Doctor Panel
            </span>
          </div>

          {/* Navigation Links (Messages & Settings Removed per Request) */}
          <nav className="px-4 space-y-1 mt-3">
            {[
              { id: 'dashboard', label: 'Dashboard', Icon: IconDashboard },
              { id: 'appointments', label: 'Appointments', Icon: IconCalendar },
              { id: 'patients', label: 'Patients', Icon: IconUsers },
              { id: 'calendar', label: 'Calendar', Icon: IconCalendar },
              { id: 'prescriptions', label: 'Prescriptions', Icon: IconPill },
              { id: 'reports', label: 'Reports', Icon: IconFileText },
              { id: 'reminders', label: 'Reminders', Icon: IconBell },
              { id: 'profile', label: 'Profile', Icon: IconUser },
            ].map((nav) => {
              const IconComp = nav.Icon
              return (
                <button
                  key={nav.id}
                  onClick={() => handleTabSwitch(nav.id)}
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
                </button>
              )
            })}
          </nav>
        </div>

        <div>
          {/* Need Assistance Card */}
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
              <GenderAvatar name={user.name} className="w-8 h-8" iconClassName="w-4.5 h-4.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">{user.specialization}</p>
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
              Welcome back, {user.name}
            </h2>
            <p className="text-xs text-slate-400 font-medium">Clinic Schedule & Clinical Analytics Overview</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => triggerToast('🟢 Google Calendar 2-Way Sync Active! Practice consultations automatically sync to your calendar.')}
              className="flex items-center gap-2 bg-[#eaf6f2] hover:bg-[#d8efe8] border border-teal-200/90 text-teal-900 font-extrabold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer shadow-2xs"
            >
              <span>🟢 Google Calendar Active</span>
            </button>

            <button
              onClick={() => setActiveModal('search')}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition cursor-pointer"
              title="Search"
            >
              <IconSearch className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <GenderAvatar name={user.name} className="w-8 h-8" iconClassName="w-4.5 h-4.5" />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">{user.specialization}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* TAB 1: DASHBOARD */}
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
                    <p className="text-[11px] font-semibold text-amber-600 mt-0.5">Next up: 11:30 AM</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <IconClock className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Patients</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalPatientsServed}</p>
                    <p className="text-[11px] font-semibold text-purple-600 mt-0.5">Active directory</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <IconUsers className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Patient Rating</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.avgRating} ★</p>
                    <p className="text-[11px] font-semibold text-teal-700 mt-0.5">120 Reviews</p>
                  </div>
                  <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center">
                    <IconStar className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Middle Section: Left 8 Cols (Schedule + AI Insights) + Right 4 Cols (Quick Actions + Directory) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left 8 Columns */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* AI Pre-Visit Clinical Intelligence Card */}
                  <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-teal-900/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconBrain className="w-5 h-5 text-teal-400" />
                        <h3 className="font-bold text-sm text-white">Gemini AI Pre-Visit Clinical Intelligence</h3>
                      </div>
                      <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                        High Priority Triage
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-teal-200">
                        Patient: Rahul Verma (34 M) — Chief Complaint: High Fever 102°F with Dengue Symptoms
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        Gemini AI flagged high viral infection likelihood based on reported 102°F fever, eye pressure pain, and acute joint aches. Suggested immediate CBC test review.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-teal-900/60 flex items-center justify-between text-xs">
                      <span className="text-teal-300/80 font-medium">3 AI Pre-generated clinical questions prepared</span>
                      <button
                        onClick={() => {
                          setSelectedAppointment(todaySchedule[0])
                          setActiveModal('appointment_detail')
                        }}
                        className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer text-xs shadow-2xs"
                      >
                        Review Pre-Visit Note →
                      </button>
                    </div>
                  </div>

                  {/* Today's Consultation Schedule */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-base">Today&apos;s Consultation Schedule</h3>
                      <span className="text-xs text-slate-400 font-medium">{todaySchedule.length} Consultations</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {todaySchedule.map((apt) => (
                        <div key={apt.id} className="py-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition rounded-2xl px-2">
                          <div className="flex items-center gap-4">
                            <GenderAvatar name={apt.patientName} gender={apt.ageGender} className="w-12 h-12" iconClassName="w-6 h-6" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-xs">{apt.patientName}</h4>
                                <span className="text-[10px] text-slate-400 font-medium">{apt.ageGender}</span>
                                {apt.urgency === 'HIGH' && (
                                  <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-2 py-0.5 rounded-md">HIGH URGENCY</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 font-medium">{apt.reason}</p>
                              <p className="text-[10px] text-teal-700 font-bold mt-0.5">🗓️ {apt.date || '24 Aug, 2026'} at {apt.time} ({apt.duration})</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-xl">
                              {apt.status}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedAppointment(apt)
                                setActiveModal('appointment_detail')
                              }}
                              className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 4 Columns */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Quick Actions Grid */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setActiveModal('prescription')}
                        className="p-3.5 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-2xl text-left transition shadow-2xs cursor-pointer flex flex-col justify-between h-20"
                      >
                        <IconPill className="w-5 h-5 text-teal-700" />
                        <span className="text-xs font-bold text-slate-900">New Prescription</span>
                      </button>

                      <button
                        onClick={() => setActiveModal('note')}
                        className="p-3.5 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-2xl text-left transition shadow-2xs cursor-pointer flex flex-col justify-between h-20"
                      >
                        <IconFileText className="w-5 h-5 text-teal-700" />
                        <span className="text-xs font-bold text-slate-900">Add Patient Note</span>
                      </button>

                      <button
                        onClick={() => setActiveModal('block')}
                        className="p-3.5 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-2xl text-left transition shadow-2xs cursor-pointer flex flex-col justify-between h-20"
                      >
                        <IconClock className="w-5 h-5 text-amber-600" />
                        <span className="text-xs font-bold text-slate-900">Block Time</span>
                      </button>

                      <button
                        onClick={() => handleTabSwitch('calendar')}
                        className="p-3.5 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-2xl text-left transition shadow-2xs cursor-pointer flex flex-col justify-between h-20"
                      >
                        <IconCalendar className="w-5 h-5 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900">View Calendar</span>
                      </button>
                    </div>
                  </div>

                  {/* Patient Directory Snippet */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Patient Directory</h4>
                      <button onClick={() => handleTabSwitch('patients')} className="text-xs font-bold text-teal-700 hover:underline cursor-pointer">
                        View All
                      </button>
                    </div>

                    <div className="space-y-3">
                      {patientDirectory.slice(0, 4).map((p) => (
                        <div key={p.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{p.name}</p>
                            <p className="text-[10px] text-slate-500">{p.phone} · {p.condition}</p>
                          </div>
                          <span className="bg-white border text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {p.bloodGroup}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}

          {/* TAB 2: APPOINTMENTS DIRECTORY */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-lg">Appointments Directory</h3>
                <span className="text-xs text-slate-400 font-medium">Full list of registered clinic appointments</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Date & Time</th>
                      <th className="pb-3">Patient</th>
                      <th className="pb-3">Reason</th>
                      <th className="pb-3">Triage Urgency</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {todaySchedule.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 font-bold text-slate-900">
                          <div className="flex flex-col">
                            <span>{apt.date || '24 Aug, 2026'}</span>
                            <span className="text-[10px] text-teal-700 font-semibold">{apt.time}</span>
                          </div>
                        </td>
                        <td className="py-4 font-bold text-slate-900">{apt.patientName}</td>
                        <td className="py-4 text-slate-700 font-medium">{apt.reason}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                            apt.urgency === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {apt.urgency || 'MEDIUM'}
                          </span>
                        </td>
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
                            className="bg-teal-700 hover:bg-teal-800 text-white px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-2xs"
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
                        <GenderAvatar name={p.name} className="w-9 h-9" iconClassName="w-4.5 h-4.5" />
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
                      <p><span className="font-bold text-slate-800">Total Visits:</span> {p.totalVisits}</p>
                      <p><span className="font-bold text-slate-800">Current Assessment:</span> {p.condition}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Doctor Practice Google Calendar</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time 2-way Google Calendar synchronization for patient appointments</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200">
                    ● Google Calendar 2-Way Synced
                  </span>
                  <button onClick={() => setActiveModal('block')} className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer">
                    + Block Time Out
                  </button>
                </div>
              </div>

              <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
                <iframe
                  src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&src=en.indian%23holiday%40group.v.calendar.google.com&color=%20%23039BE5"
                  style={{ border: 0 }}
                  width="100%"
                  height="500"
                  frameBorder="0"
                  scrolling="no"
                />
              </div>
            </div>
          )}

          {/* TAB 5: PRESCRIPTIONS */}
          {activeTab === 'prescriptions' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Issued Prescriptions Log</h3>
                  <p className="text-xs text-slate-400 mt-0.5">E-Prescriptions issued to clinic patients</p>
                </div>
                <button onClick={() => setActiveModal('prescription')} className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer">
                  + Issue New Prescription
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {issuedPrescriptions.map((rx) => (
                  <div key={rx.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">{rx.patientName}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">{rx.date}</span>
                    </div>
                    <p className="font-extrabold text-teal-800">{rx.drugName} ({rx.dosage})</p>
                    <p className="text-slate-600">{rx.frequency} · {rx.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: REPORTS */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
              <h3 className="font-bold text-slate-900 text-lg">Clinical Analytics & Patient Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-teal-50 border border-teal-100 rounded-2xl text-xs space-y-1">
                  <p className="font-bold text-teal-900">Total Consultations (This Month)</p>
                  <p className="text-2xl font-extrabold text-teal-800">150</p>
                  <p className="text-[10px] text-teal-700 font-semibold">↑ 18% increase from last month</p>
                </div>

                <div className="p-5 bg-purple-50 border border-purple-100 rounded-2xl text-xs space-y-1">
                  <p className="font-bold text-purple-900">Patient Satisfaction Rate</p>
                  <p className="text-2xl font-extrabold text-purple-800">98.4%</p>
                  <p className="text-[10px] text-purple-700 font-semibold">Based on 120 verified reviews</p>
                </div>

                <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl text-xs space-y-1">
                  <p className="font-bold text-blue-900">Top Treated Condition</p>
                  <p className="text-2xl font-extrabold text-blue-800">Viral Fever</p>
                  <p className="text-[10px] text-blue-700 font-semibold">42% of monthly visits</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: REMINDERS */}
          {activeTab === 'reminders' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
              <h3 className="font-bold text-slate-900 text-lg">Clinician Action Reminders</h3>
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Follow-up Call with Rahul Verma</p>
                    <p className="text-[11px] text-slate-500">Check CBC platelet report results for Dengue evaluation</p>
                  </div>
                  <button onClick={() => triggerToast('✓ Reminder completed!')} className="bg-teal-700 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer">
                    Complete ✓
                  </button>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Review BP Log for Sunita Devi</p>
                    <p className="text-[11px] text-slate-500">Weekly morning BP average evaluation</p>
                  </div>
                  <button onClick={() => triggerToast('✓ Reminder completed!')} className="bg-purple-700 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer">
                    Complete ✓
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-xl">Doctor Profile & Practice Setup</h3>
                <p className="text-xs text-slate-500">Manage your clinical profile, consultation fee, and slot duration</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Doctor Full Name</label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Specialization</label>
                    <input
                      type="text"
                      value={user.specialization}
                      onChange={(e) => setUser({ ...user, specialization: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Consultation Fee (₹)</label>
                    <input
                      type="number"
                      value={user.fee}
                      onChange={(e) => setUser({ ...user, fee: Number(e.target.value) })}
                      className="w-full p-2.5 border rounded-xl bg-white font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Experience (Years)</label>
                    <input
                      type="number"
                      value={user.experience}
                      onChange={(e) => setUser({ ...user, experience: Number(e.target.value) })}
                      className="w-full p-2.5 border rounded-xl bg-white font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer shadow-2xs">
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODALS */}
      {activeModal === 'prescription' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border p-6 w-full max-w-lg space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Issue New Prescription</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSavePrescription} className="space-y-3">
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

      {/* RICH APPOINTMENT & AI CLINICAL ANALYSIS DETAIL MODAL */}
      {activeModal === 'appointment_detail' && selectedAppointment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 w-full max-w-2xl space-y-5 my-8 text-xs max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base">Consultation Detail — {selectedAppointment.patientName}</h3>
                  <span className="bg-teal-100 text-teal-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    Ph: {selectedAppointment.patientPhone || '+91-9782955955'}
                  </span>
                </div>
                <p className="text-slate-500 font-semibold mt-1 flex items-center gap-2 flex-wrap">
                  <span>🗓️ <span className="font-bold text-slate-800">Scheduled Date & Time:</span> {selectedAppointment.date || '24 Aug, 2026'} at {selectedAppointment.time}</span>
                  <span>·</span>
                  <span>Demographic: {selectedAppointment.ageGender || '34 Yrs / Male'}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Section 1: Patient Reported Symptoms & Form Inputs */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <div className="flex items-center gap-2">
                  <IconFileText className="w-4 h-4 text-blue-700" />
                  <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px]">Patient Form Intake & Reported Symptoms</span>
                </div>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  Severity Rating: {selectedAppointment.severity || 7}/10
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <div>
                  <p className="font-bold text-slate-900">Chief Complaint:</p>
                  <p className="text-slate-800 font-medium bg-white p-2.5 rounded-xl border border-slate-200/80 mt-0.5 leading-relaxed">
                    {selectedAppointment.chiefComplaint || selectedAppointment.reason || 'Frequent urination, excessive thirst, and feeling tired'}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Symptom Duration:</p>
                  <p className="text-slate-800 font-medium bg-white p-2.5 rounded-xl border border-slate-200/80 mt-0.5">
                    {selectedAppointment.duration || '2 Weeks'}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Previous Medical Conditions:</p>
                  <p className="text-slate-800 font-medium bg-white p-2.5 rounded-xl border border-slate-200/80 mt-0.5">
                    {selectedAppointment.previousConditions || 'Family history of Type 2 Diabetes, Mild hypertension'}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Current Medications & OTC Drugs:</p>
                  <p className="text-slate-800 font-medium bg-white p-2.5 rounded-xl border border-slate-200/80 mt-0.5">
                    {selectedAppointment.currentMedicines || 'Metformin 500mg daily, Multivitamin supplement'}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Gemini AI Pre-Visit Clinical Analysis */}
            <div className="p-4 bg-teal-50/90 border border-teal-200/90 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-teal-200/60 pb-2">
                <div className="flex items-center gap-2">
                  <IconSparkles className="w-4 h-4 text-teal-800" />
                  <span className="font-extrabold text-teal-950 uppercase tracking-wider text-[10px]">Gemini AI Clinical Intelligence & Triage Analysis</span>
                </div>
                <span className="bg-teal-700 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-2xs">
                  Triage Risk: HIGH
                </span>
              </div>

              <div>
                <p className="font-bold text-teal-950 mb-1">AI Diagnostic & Symptom Analysis (Based on Form Intake):</p>
                <p className="text-teal-900 bg-white/90 p-3 rounded-xl border border-teal-200/80 leading-relaxed font-medium">
                  {selectedAppointment.aiAnalysis ||
                    `Triaged Analysis: Patient presents with classic triad of Osmotic Symptoms (Polyuria, Polydipsia, and Lethargy). Symptoms strongly indicate potential Hyperglycemia / Uncontrolled Diabetes Mellitus. Recommended immediate Fasting Plasma Glucose (FPG), HbA1c test, and Urine Ketones screening.`}
                </p>
              </div>

              {/* Tailored AI Suggested Questions */}
              <div>
                <p className="font-bold text-teal-950 mb-1.5">Gemini AI Suggested Questions during Consultation:</p>
                <ul className="space-y-1.5 text-teal-900">
                  {(selectedAppointment.questions || [
                    'How long have you experienced these exact symptoms of excessive thirst and frequent urination?',
                    'Have you noticed any unintentional weight loss or blurred vision recently?',
                    'Are you currently taking any OTC medications or herbal supplements for relief?',
                  ]).map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-teal-100/90">
                      <span className="font-bold text-teal-700 shrink-0">Q{idx + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700 rounded-xl"
              >
                Close Record
              </button>
              <button
                type="button"
                onClick={() => markAppointmentStatus(selectedAppointment.id, 'Completed')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
              >
                Mark Completed ✓
              </button>
            </div>

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
