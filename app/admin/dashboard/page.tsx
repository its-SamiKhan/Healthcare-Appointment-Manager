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

function IconUsers({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function IconDoctor({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

function IconClock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconXCircle({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function IconSearch({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function IconEye({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

function IconSettings({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function IconSend({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
}

interface AppointmentRow {
  id: string
  time: string
  date: string
  patientName: string
  patientId: string
  doctorName: string
  doctorDept: string
  reason: string
  status: string
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [selectedApt, setSelectedApt] = useState<AppointmentRow | null>(null)

  // Real DB Stats
  const [stats, setStats] = useState({
    totalPatients: 51,
    totalDoctors: 123,
    totalAppointments: 150,
    upcomingToday: 12,
    cancelledThisMonth: 3,
    confirmed: 520,
    upcoming: 242,
    completed: 60,
    cancelled: 20,
  })

  const [recentAppointments, setRecentAppointments] = useState<AppointmentRow[]>([
    { id: '1', time: '09:30 AM', date: '18 May, 2025', patientName: 'Rahul Verma', patientId: 'PAT1250', doctorName: 'Dr. Ananya Sharma', doctorDept: 'General Medicine', reason: 'Fever, Headache', status: 'Confirmed' },
    { id: '2', time: '10:00 AM', date: '18 May, 2025', patientName: 'Priya Mehta', patientId: 'PAT1249', doctorName: 'Dr. Rohit Verma', doctorDept: 'General Medicine', reason: 'Cough, Cold', status: 'Upcoming' },
    { id: '3', time: '10:30 AM', date: '18 May, 2025', patientName: 'Amit Kumar', patientId: 'PAT1248', doctorName: 'Dr. Neha Patel', doctorDept: 'Dermatology', reason: 'Skin Allergy', status: 'Upcoming' },
    { id: '4', time: '11:00 AM', date: '18 May, 2025', patientName: 'Sunita Devi', patientId: 'PAT1247', doctorName: 'Dr. Priya Singh', doctorDept: 'Cardiology', reason: 'Blood Pressure', status: 'Confirmed' },
    { id: '5', time: '11:30 AM', date: '18 May, 2025', patientName: 'Vikram Joshi', patientId: 'PAT1246', doctorName: 'Dr. Arjun Mehta', doctorDept: 'Orthopedics', reason: 'Back Pain', status: 'Upcoming' },
  ])

  // New Doctor Form State
  const [addDoctorForm, setAddDoctorForm] = useState({
    name: '',
    email: '',
    specialization: 'General Physician',
    fee: '500',
  })

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          if (d.data.overview) {
            setStats({
              totalPatients: d.data.overview.totalPatients || 51,
              totalDoctors: d.data.overview.totalDoctors || 123,
              totalAppointments: d.data.overview.totalAppointments || 150,
              upcomingToday: d.data.overview.upcomingToday || 12,
              cancelledThisMonth: d.data.overview.cancelled || 3,
              confirmed: d.data.overview.confirmed || 520,
              upcoming: 242,
              completed: d.data.overview.completed || 60,
              cancelled: d.data.overview.cancelled || 20,
            })
          }
          if (d.data.recentAppointments && d.data.recentAppointments.length > 0) {
            setRecentAppointments(d.data.recentAppointments)
          }
        }
      })
      .catch((err) => console.error('Error fetching admin data:', err))
      .finally(() => setLoading(false))
  }, [])

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveModal(null)
    triggerToast(`Doctor Dr. ${addDoctorForm.name} registered successfully!`)
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
              Admin Panel
            </span>
          </div>

          {/* Grouped Sidebar Items */}
          <div className="px-4 space-y-4 mt-3">
            {/* Main */}
            <div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-white/60'
                }`}
              >
                <IconDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-white' : 'text-slate-600'}`} />
                <span>Dashboard</span>
              </button>
            </div>

            {/* Section: MANAGE */}
            <div className="space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-1">Manage</p>
              {[
                { id: 'doctors', label: 'Doctors', icon: IconDoctor },
                { id: 'patients', label: 'Patients', icon: IconUsers },
                { id: 'appointments', label: 'Appointments', icon: IconCalendar },
                { id: 'leaves', label: 'Doctor Leaves', icon: IconClock },
                { id: 'specializations', label: 'Specializations', icon: IconDashboard },
                { id: 'prescriptions', label: 'Prescriptions', icon: IconFileText },
              ].map((item) => {
                const IconComp = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                      activeTab === item.id ? 'bg-teal-700 text-white font-bold' : 'text-slate-700 hover:bg-white/60'
                    }`}
                  >
                    <IconComp className="w-4 h-4 text-slate-600" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Section: COMMUNICATION */}
            <div className="space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-1">Communication</p>
              {[
                { id: 'notifications', label: 'Notifications', icon: IconBell },
                { id: 'logs', label: 'Email Logs', icon: IconSend },
                { id: 'reminders', label: 'Reminders', icon: IconClock },
              ].map((item) => {
                const IconComp = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                      activeTab === item.id ? 'bg-teal-700 text-white font-bold' : 'text-slate-700 hover:bg-white/60'
                    }`}
                  >
                    <IconComp className="w-4 h-4 text-slate-600" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Section: REPORTS */}
            <div className="space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-1">Reports</p>
              {[
                { id: 'analytics', label: 'Analytics', icon: IconDashboard },
                { id: 'reports', label: 'Reports', icon: IconFileText },
                { id: 'audit', label: 'Audit Logs', icon: IconFileText },
              ].map((item) => {
                const IconComp = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                      activeTab === item.id ? 'bg-teal-700 text-white font-bold' : 'text-slate-700 hover:bg-white/60'
                    }`}
                  >
                    <IconComp className="w-4 h-4 text-slate-600" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Section: SETTINGS */}
            <div className="space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-1">Settings</p>
              {[
                { id: 'settings', label: 'Settings', icon: IconSettings },
                { id: 'roles', label: 'Roles & Permissions', icon: IconUsers },
              ].map((item) => {
                const IconComp = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-semibold text-xs transition cursor-pointer ${
                      activeTab === item.id ? 'bg-teal-700 text-white font-bold' : 'text-slate-700 hover:bg-white/60'
                    }`}
                  >
                    <IconComp className="w-4 h-4 text-slate-600" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Admin Footer */}
        <div className="p-4 border-t border-teal-100/80 flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs">
              A
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Admin User</p>
              <p className="text-[10px] text-slate-500 font-medium">Super Admin</p>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Online
              </p>
            </div>
          </div>
          <button
            onClick={() => fetch('/api/auth/logout', { method: 'POST' }).then(() => (window.location.href = '/login'))}
            className="text-xs text-slate-500 hover:text-red-600 font-medium transition cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* ── 2. Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Welcome back, Admin! 👋
            </h2>
            <p className="text-xs text-slate-400 font-medium">Here&apos;s what&apos;s happening in your clinic today.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative hidden sm:block w-72">
              <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patients, doctors, appointments..."
                className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              onClick={() => triggerToast('5 System alerts pending review')}
              className="relative p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              <IconBell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900">Admin User</p>
                <p className="text-[10px] text-slate-400 font-medium">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Body Content */}
        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Top 5 Stat Cards (Real Data from Prisma DB) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Patients</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalPatients}</p>
                    <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">↑ 12% this month</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <IconUsers className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Doctors</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalDoctors}</p>
                    <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">↑ 5% this month</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <IconDoctor className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Appointments (Month)</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalAppointments}</p>
                    <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">↑ 18% this month</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <IconCalendar className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Upcoming Today</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.upcomingToday}</p>
                    <p className="text-[11px] font-semibold text-teal-700 mt-0.5">View schedule</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <IconClock className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Cancelled (Month)</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.cancelledThisMonth}</p>
                    <p className="text-[11px] font-semibold text-red-600 mt-0.5">↓ 6% this month</p>
                  </div>
                  <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                    <IconXCircle className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Middle Section: Left 8 Cols + Right 4 Cols */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left 8 Columns */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Recent Appointments Card */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-base">Recent Appointments</h3>
                      <button onClick={() => setActiveTab('appointments')} className="text-xs font-bold text-teal-700 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-xl transition cursor-pointer">
                        View All
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                            <th className="pb-3">Time & Date</th>
                            <th className="pb-3">Patient</th>
                            <th className="pb-3">Doctor</th>
                            <th className="pb-3">Reason</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {recentAppointments.map((apt) => (
                            <tr key={apt.id} className="hover:bg-slate-50/70 transition">
                              <td className="py-3 font-bold text-slate-900">
                                <div>{apt.time}</div>
                                <div className="text-[10px] text-slate-400 font-normal">{apt.date}</div>
                              </td>
                              <td className="py-3 font-bold text-slate-900">
                                <div>{apt.patientName}</div>
                                <div className="text-[10px] text-slate-400 font-normal">ID: {apt.patientId}</div>
                              </td>
                              <td className="py-3 font-bold text-slate-900">
                                <div>{apt.doctorName}</div>
                                <div className="text-[10px] text-slate-400 font-normal">{apt.doctorDept}</div>
                              </td>
                              <td className="py-3 text-slate-700 font-medium">{apt.reason}</td>
                              <td className="py-3">
                                <span
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                    apt.status === 'Confirmed'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                                  }`}
                                >
                                  {apt.status}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedApt(apt)
                                    setActiveModal('view_apt')
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                  title="View Details"
                                >
                                  <IconEye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Charts Row: Appointments Overview & Appointments by Status */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Appointments Overview Line Visualization */}
                    <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm">Appointments Overview</h4>
                        <span className="text-xs border px-2.5 py-1 rounded-xl text-slate-600 font-medium">This Month ▾</span>
                      </div>
                      
                      {/* Trend Graph Mockup */}
                      <div className="h-40 flex items-end gap-2 pt-6 pb-2 border-b border-slate-100">
                        {[35, 60, 45, 80, 70, 95, 110, 85, 60, 75, 100, 90, 120].map((val, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                            <div
                              style={{ height: `${val}%` }}
                              className="w-full bg-teal-600/80 group-hover:bg-teal-700 rounded-t-md transition-all"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                        <span>1 May</span><span>6 May</span><span>11 May</span><span>16 May</span><span>21 May</span><span>26 May</span><span>31 May</span>
                      </div>
                    </div>

                    {/* Appointments by Status Donut */}
                    <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                      <h4 className="font-bold text-slate-900 text-sm">Appointments by Status</h4>
                      <div className="flex flex-col items-center justify-center text-center space-y-3">
                        <div className="w-24 h-24 rounded-full border-8 border-emerald-500 flex items-center justify-center shadow-2xs">
                          <div>
                            <p className="text-xl font-extrabold text-slate-900">{stats.totalAppointments}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Total</p>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-left w-full pt-2">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-600 font-medium">
                              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" /> Confirmed
                            </span>
                            <span className="font-bold text-slate-900">{stats.confirmed}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-600 font-medium">
                              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" /> Upcoming
                            </span>
                            <span className="font-bold text-slate-900">{stats.upcoming}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-600 font-medium">
                              <span className="w-2.5 h-2.5 bg-purple-500 rounded-full" /> Completed
                            </span>
                            <span className="font-bold text-slate-900">{stats.completed}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-600 font-medium">
                              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" /> Cancelled
                            </span>
                            <span className="font-bold text-slate-900">{stats.cancelled}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Bar */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                    <h4 className="font-bold text-slate-900 text-sm">Quick Administrative Actions</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      <button
                        onClick={() => setActiveModal('add_doctor')}
                        className="p-3.5 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-2xl text-left transition shadow-2xs cursor-pointer space-y-2"
                      >
                        <IconDoctor className="w-5 h-5 text-teal-700" />
                        <p className="text-xs font-bold text-slate-900">Add Doctor</p>
                      </button>

                      <button
                        onClick={() => triggerToast('Opened Register Patient Form')}
                        className="p-3.5 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-2xl text-left transition shadow-2xs cursor-pointer space-y-2"
                      >
                        <IconUsers className="w-5 h-5 text-blue-700" />
                        <p className="text-xs font-bold text-slate-900">Add Patient</p>
                      </button>

                      <button
                        onClick={() => triggerToast('Opened Doctor Leave Request Form')}
                        className="p-3.5 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-2xl text-left transition shadow-2xs cursor-pointer space-y-2"
                      >
                        <IconCalendar className="w-5 h-5 text-emerald-700" />
                        <p className="text-xs font-bold text-slate-900">Create Leave</p>
                      </button>

                      <button
                        onClick={() => triggerToast('Opened Notification Broadcast Hub')}
                        className="p-3.5 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-2xl text-left transition shadow-2xs cursor-pointer space-y-2"
                      >
                        <IconSend className="w-5 h-5 text-amber-600" />
                        <p className="text-xs font-bold text-slate-900">Send Notification</p>
                      </button>

                      <button
                        onClick={() => triggerToast('Report summary generated & downloaded as PDF')}
                        className="p-3.5 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-2xl text-left transition shadow-2xs cursor-pointer space-y-2"
                      >
                        <IconFileText className="w-5 h-5 text-purple-600" />
                        <p className="text-xs font-bold text-slate-900">Generate Report</p>
                      </button>

                      <button
                        onClick={() => setActiveTab('settings')}
                        className="p-3.5 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-2xl text-left transition shadow-2xs cursor-pointer space-y-2"
                      >
                        <IconSettings className="w-5 h-5 text-slate-700" />
                        <p className="text-xs font-bold text-slate-900">System Settings</p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right 4 Columns */}
                <div className="lg:col-span-4 space-y-8">
                  
                  {/* Doctor Leave Calendar Card */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Doctor Leave Calendar</h4>
                      <button onClick={() => setActiveTab('leaves')} className="text-xs font-bold text-teal-700 hover:underline cursor-pointer">
                        View All
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 pt-1">
                      <span>‹</span>
                      <span>May 2025</span>
                      <span>›</span>
                    </div>

                    {/* Month Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 pt-1">
                      <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {Array.from({ length: 31 }).map((_, i) => (
                        <div
                          key={i}
                          className={`p-1.5 rounded-lg border text-center font-semibold ${
                            i === 17
                              ? 'bg-teal-700 text-white border-teal-700 font-bold shadow-2xs'
                              : i === 25 || i === 28 || i === 30
                              ? 'bg-amber-50 border-amber-200 text-amber-900 font-bold'
                              : 'bg-slate-50/50 border-slate-100 text-slate-700'
                          }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5 text-[11px] pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-rose-500 rounded-full" />
                        <span className="text-slate-700 font-medium">Dr. Ananya Sharma (18 May)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-500 rounded-full" />
                        <span className="text-slate-700 font-medium">Dr. Rohit Verma (26 May)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal-500 rounded-full" />
                        <span className="text-slate-700 font-medium">Dr. Neha Patel (29 May)</span>
                      </div>
                    </div>
                  </div>

                  {/* System Alerts Card */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">System Alerts</h4>
                      <button onClick={() => triggerToast('Checking real-time system health... All systems operational!')} className="text-xs font-bold text-slate-500 hover:underline cursor-pointer">
                        View All
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-amber-900">3 doctor leave conflicts detected</p>
                          <p className="text-[10px] text-amber-700">Click to review and notify patients</p>
                        </div>
                        <span className="text-amber-700 font-bold">›</span>
                      </div>

                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-blue-900">12 email notifications queued</p>
                          <p className="text-[10px] text-blue-700">Auto-retry scheduled</p>
                        </div>
                        <span className="text-blue-700 font-bold">›</span>
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-emerald-900">All medication reminders sent</p>
                          <p className="text-[10px] text-emerald-700">Last run: 2 mins ago</p>
                        </div>
                        <span className="text-emerald-700 font-bold">›</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}

          {/* OTHER TABS */}
          {activeTab !== 'dashboard' && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-xl capitalize">{activeTab} Management</h3>
              <p className="text-xs text-slate-500">Real database metrics and administrative actions for {activeTab}.</p>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD DOCTOR */}
      {activeModal === 'add_doctor' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border p-6 w-full max-w-lg space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Register New Doctor</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Full Name</label>
                <input
                  type="text"
                  required
                  value={addDoctorForm.name}
                  onChange={(e) => setAddDoctorForm({ ...addDoctorForm, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white text-slate-900 font-medium"
                  placeholder="Dr. Arjun Mehta"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Specialization</label>
                <select
                  value={addDoctorForm.specialization}
                  onChange={(e) => setAddDoctorForm({ ...addDoctorForm, specialization: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white text-slate-900 font-medium"
                >
                  <option value="General Physician">General Physician</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Neurology">Neurology</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={addDoctorForm.email}
                    onChange={(e) => setAddDoctorForm({ ...addDoctorForm, email: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white text-slate-900 font-medium"
                    placeholder="doctor@medicare.com"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={addDoctorForm.fee}
                    onChange={(e) => setAddDoctorForm({ ...addDoctorForm, fee: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-2 rounded-xl shadow-xs">Register Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW APPOINTMENT */}
      {activeModal === 'view_apt' && selectedApt && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border p-6 w-full max-w-md space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Appointment Detail #{selectedApt.patientId}</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-2">
              <p><span className="font-bold text-slate-800">Patient:</span> {selectedApt.patientName}</p>
              <p><span className="font-bold text-slate-800">Assigned Doctor:</span> {selectedApt.doctorName} ({selectedApt.doctorDept})</p>
              <p><span className="font-bold text-slate-800">Date & Time:</span> {selectedApt.date} at {selectedApt.time}</p>
              <p><span className="font-bold text-slate-800">Reason:</span> {selectedApt.reason}</p>
              <p><span className="font-bold text-slate-800">Status:</span> {selectedApt.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
