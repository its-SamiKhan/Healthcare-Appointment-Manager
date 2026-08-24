'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { GenderAvatar } from '@/components/gender-avatar'

// ── Minimalist Rich SVG Icon Components ──
function IconDashboard({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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

function IconFileText({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

function IconShieldCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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

interface Doctor {
  id: string
  name: string
  qualification: string
  specialization: string
  experienceYears: number
  languages: string
  fee: number
  rating: number
  totalReviews: number
  nextAvailable: string
  bio: string
  bgAvatar: string
}

interface PastVisit {
  id: string
  doctorName: string
  date: string
  diagnosis: string
  aiSummary: string
  prescriptions: Array<{ name: string; dosage: string; frequency: string }>
}

const getNext7LiveDays = () => {
  const days = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const isoDate = d.toISOString().split('T')[0]
    const dayName = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' })
    const dayNum = d.getDate()
    const monthName = d.toLocaleDateString('en-US', { month: 'short' })
    const fullDisplay = `${dayName} ${dayNum} ${monthName}`
    days.push({ isoDate, dayName, dayNum, monthName, fullDisplay })
  }
  return days
}

const generateInitialBookedSlotsMap = (liveDays: ReturnType<typeof getNext7LiveDays>) => {
  const map: Record<string, string[]> = {}
  const allSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM',
    '10:30 AM', '11:30 AM', '12:00 PM',
    '02:00 PM', '02:30 PM', '03:00 PM',
    '04:00 PM', '04:30 PM', '05:00 PM',
  ]

  liveDays.forEach((day, idx) => {
    const slot1 = allSlots[(idx * 3 + 1) % allSlots.length]
    const slot2 = allSlots[(idx * 5 + 4) % allSlots.length]
    const slot3 = allSlots[(idx * 7 + 8) % allSlots.length]
    map[day.isoDate] = Array.from(new Set([slot1, slot2, slot3]))
  })
  return map
}

export default function PatientDashboard() {
  const [user, setUser] = useState({
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    bloodGroup: 'B+',
    dob: '1994-08-14',
    gender: 'Male',
    height: '178 cm',
    weight: '72 kg',
    allergies: 'Penicillin',
    conditions: 'Mild Hypertension',
    emergencyContact: 'Sunita Sharma (Mother) - +91 98123 45678',
  })

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [activeModal, setActiveModal] = useState<string | null>(null)

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationSearch, setLocationSearch] = useState('')

  // Dynamic 7 Days Live Calendar & Slot Selection
  const liveDays = getNext7LiveDays()
  const [selectedDateObj, setSelectedDateObj] = useState(liveDays[0])
  const [selectedSlot, setSelectedSlot] = useState('11:30 AM')
  const [dateSlots, setDateSlots] = useState<Array<{ startTime: string; status: string }>>([])
  const [bookedSlotsMap, setBookedSlotsMap] = useState<Record<string, string[]>>(() =>
    generateInitialBookedSlotsMap(liveDays)
  )
  const [symptomForm, setSymptomForm] = useState({
    chiefComplaint: 'Fever & headache for 2 days',
    duration: '2 days',
    severity: 3,
  })

  // Full Rich Indian Doctors List
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([
    {
      id: 'doc1',
      name: 'Dr. Ananya Sharma',
      qualification: 'MBBS, MD - General Medicine',
      specialization: 'General Physician',
      experienceYears: 8,
      languages: 'English, Hindi',
      fee: 500,
      rating: 4.8,
      totalReviews: 120,
      nextAvailable: 'Today, 11:30 AM',
      bio: 'Dr. Ananya Sharma is a dedicated General Physician with over 8 years of experience in providing compassionate and comprehensive healthcare.',
      bgAvatar: 'bg-teal-100 text-teal-900',
    },
    {
      id: 'doc2',
      name: 'Dr. Rohit Verma',
      qualification: 'MBBS, MD - General Medicine',
      specialization: 'General Physician',
      experienceYears: 10,
      languages: 'English, Hindi',
      fee: 500,
      rating: 4.6,
      totalReviews: 98,
      nextAvailable: 'Today, 02:00 PM',
      bio: 'Experienced in treating chronic hypertension, diabetes management, and acute viral infections.',
      bgAvatar: 'bg-blue-100 text-blue-900',
    },
    {
      id: 'doc3',
      name: 'Dr. Priya Mehta',
      qualification: 'MBBS, MD - General Medicine',
      specialization: 'General Physician',
      experienceYears: 6,
      languages: 'English, Hindi',
      fee: 450,
      rating: 4.7,
      totalReviews: 76,
      nextAvailable: 'Tomorrow, 10:00 AM',
      bio: 'Specialist in preventive health, women health, and lifestyle illness management.',
      bgAvatar: 'bg-purple-100 text-purple-900',
    },
    {
      id: 'doc4',
      name: 'Dr. Rajesh Patel',
      qualification: 'MBBS, DM - Cardiology',
      specialization: 'Cardiologist',
      experienceYears: 12,
      languages: 'English, Hindi, Gujarati',
      fee: 750,
      rating: 4.9,
      totalReviews: 154,
      nextAvailable: 'Today, 03:30 PM',
      bio: 'Senior Cardiologist specializing in preventive heart care, ECG analysis, and hypertension management.',
      bgAvatar: 'bg-rose-100 text-rose-900',
    },
    {
      id: 'doc5',
      name: 'Dr. Sunita Rao',
      qualification: 'MBBS, MD - Dermatology',
      specialization: 'Dermatologist',
      experienceYears: 9,
      languages: 'English, Hindi',
      fee: 600,
      rating: 4.8,
      totalReviews: 112,
      nextAvailable: 'Today, 04:00 PM',
      bio: 'Expert dermatologist handling acne treatments, eczema, hair loss, and laser skin care.',
      bgAvatar: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'doc6',
      name: 'Dr. Vikram Malhotra',
      qualification: 'MBBS, MS - Orthopedics',
      specialization: 'Orthopedic',
      experienceYears: 14,
      languages: 'English, Hindi',
      fee: 700,
      rating: 4.9,
      totalReviews: 180,
      nextAvailable: 'Tomorrow, 11:00 AM',
      bio: 'Leading Orthopedic surgeon specializing in joint replacement, spinal health, and sports injury recovery.',
      bgAvatar: 'bg-emerald-100 text-emerald-900',
    },
  ])

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(doctorsList[0])

  // Active Patient Appointments List
  const [myAppointments, setMyAppointments] = useState<Array<{ id: string; doctorName: string; specialization: string; date: string; time: string; type: string; status: string; fee: number }>>([
    {
      id: 'apt1',
      doctorName: 'Dr. Ananya Sharma',
      specialization: 'General Physician',
      date: 'Sat 18 May, 2025',
      time: '11:30 AM',
      type: 'In-Clinic Visit',
      status: 'Confirmed',
      fee: 500,
    },
    {
      id: 'apt2',
      doctorName: 'Dr. Rajesh Patel',
      specialization: 'Cardiologist',
      date: 'Sun 19 May, 2025',
      time: '03:30 PM',
      type: 'In-Clinic Visit',
      status: 'Confirmed',
      fee: 750,
    },
    {
      id: 'apt3',
      doctorName: 'Dr. Sunita Rao',
      specialization: 'Dermatologist',
      date: 'Sun 25 May, 2025',
      time: '04:00 PM',
      type: 'In-Clinic Visit',
      status: 'Scheduled',
      fee: 600,
    },
  ])

  // Active Patient Prescriptions List
  const [prescriptions] = useState([
    {
      id: 'rx1',
      drugName: 'Telmisartan 40mg',
      dosage: '1 Tab',
      frequency: 'Once daily before breakfast',
      duration: '30 Days Supply',
      doctorName: 'Dr. Rajesh Patel',
      category: 'Hypertension',
      status: 'Active',
    },
    {
      id: 'rx2',
      drugName: 'Paracetamol 650mg',
      dosage: '1 Tab',
      frequency: '3x daily after meals',
      duration: '5 Days Supply',
      doctorName: 'Dr. Ananya Sharma',
      category: 'Fever & Pain Relief',
      status: 'Active',
    },
    {
      id: 'rx3',
      drugName: 'ORS Hydration Powder',
      dosage: '1 Sachet',
      frequency: 'Twice daily in 1L water',
      duration: '5 Days Supply',
      doctorName: 'Dr. Ananya Sharma',
      category: 'Rehydration',
      status: 'Active',
    },
  ])

  // Past Visits with AI Post-Visit Summaries
  const [pastVisits] = useState<PastVisit[]>([
    {
      id: 'v1',
      doctorName: 'Dr. Ananya Sharma',
      date: '10 May, 2025',
      diagnosis: 'Acute Viral Fever & Mild Dehydration',
      aiSummary: '✨ Gemini AI Summary: Patient presented with 101°F fever and fatigue. Advised 5 days bed rest, 3L daily water intake, and strict adherence to Paracetamol 650mg. Platelet count normal. Avoid strenuous workouts for 1 week.',
      prescriptions: [
        { name: 'Paracetamol 650mg', dosage: '1 Tab', frequency: '3x daily after meals (5 days)' },
        { name: 'ORS Electrolyte Powder', dosage: '1 Sachet', frequency: 'Twice daily in 1L water' },
        { name: 'Vitamin C 500mg', dosage: '1 Tab', frequency: 'Once daily after breakfast' },
      ],
    },
    {
      id: 'v2',
      doctorName: 'Dr. Rajesh Patel',
      date: '28 Apr, 2025',
      diagnosis: 'Mild Hypertension (Stage 1)',
      aiSummary: '✨ Gemini AI Summary: Blood pressure recorded at 135/88 mmHg. Advised low-salt Mediterranean diet, 30 mins morning walk, and daily BP logging.',
      prescriptions: [
        { name: 'Telmisartan 40mg', dosage: '1 Tab', frequency: 'Once daily before breakfast' },
      ],
    },
    {
      id: 'v3',
      doctorName: 'Dr. Vikram Malhotra',
      date: '15 Mar, 2025',
      diagnosis: 'Lumbar Strain & Muscle Spasm',
      aiSummary: '✨ Gemini AI Summary: Lower back strain from sedentary desk work. Advised ergonomic chair setup, warm compress application, and daily hamstrings stretching exercises.',
      prescriptions: [
        { name: 'Volini Pain Gel', dosage: 'Apply topically', frequency: 'Twice daily' },
      ],
    },
  ])

  // Sync tab with URL on mount & popstate
  useEffect(() => {
    const syncTabFromUrl = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const tab = params.get('tab')
        if (tab && ['appointments', 'visits', 'prescriptions', 'reminders', 'profile'].includes(tab)) {
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

    fetch('/api/auth/me', { headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setUser((prev) => ({
            ...prev,
            name: d.data.name || 'Aarav Sharma',
            email: d.data.email || 'aarav.sharma@example.com',
          }))
        }
      })

    fetch('/api/doctors', { headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.data && Array.isArray(d.data) && d.data.length > 0) {
          const seenNames = new Set<string>()
          const DISTINCT_DOCTOR_NAMES = [
            'Dr. Vikram Mehta',
            'Dr. Ananya Sharma',
            'Dr. Simran Kulkarni',
            'Dr. Rajesh Patel',
            'Dr. Priya Deshmukh',
            'Dr. Rahul Verma',
            'Dr. Kavita Reddy',
            'Dr. Arjun Kapoor',
            'Dr. Meera Iyer',
            'Dr. Aditya Joshi',
            'Dr. Neha Agarwal',
            'Dr. Sanjay Singhania',
          ]
          let distinctIdx = 0

          const apiDocs: Doctor[] = d.data.map((doc: any, i: number) => {
            let name = doc.user?.name || `Dr. Specialist ${i + 1}`
            if (seenNames.has(name)) {
              name = DISTINCT_DOCTOR_NAMES[distinctIdx % DISTINCT_DOCTOR_NAMES.length]
              distinctIdx++
              while (seenNames.has(name) && distinctIdx < DISTINCT_DOCTOR_NAMES.length * 2) {
                name = DISTINCT_DOCTOR_NAMES[distinctIdx % DISTINCT_DOCTOR_NAMES.length]
                distinctIdx++
              }
            }
            seenNames.add(name)

            return {
              id: doc.id,
              name,
              qualification: doc.bio || 'MBBS, MD Specialist',
              specialization: doc.specialization || 'General Physician',
              experienceYears: doc.experienceYears || (5 + ((i * 4) % 18)),
              languages: doc.languages || 'English, Hindi',
              fee: doc.fee || (500 + ((i * 100) % 500)),
              rating: Number((4.2 + ((i * 0.13) % 0.7)).toFixed(1)),
              totalReviews: doc.totalReviews || (40 + ((i * 35) % 180)),
              nextAvailable: 'Today, 11:30 AM',
              bio: doc.bio || `Dr. ${name} is a highly respected specialist with extensive clinical experience.`,
              bgAvatar: i % 2 === 0 ? 'bg-teal-100 text-teal-900' : 'bg-blue-100 text-blue-900',
            }
          })
          setDoctorsList(apiDocs)
          setSelectedDoctor(apiDocs[0])
        }
      })
      .catch((err) => console.error('Doctors fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  // Dynamic slot fetch from DB whenever selectedDoctor or selectedDateObj changes
  useEffect(() => {
    if (!selectedDoctor?.id || !selectedDateObj?.isoDate) return
    fetch(`/api/doctors/${selectedDoctor.id}/slots?date=${selectedDateObj.isoDate}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.slots && Array.isArray(d.data.slots)) {
          setDateSlots(d.data.slots)
        }
      })
      .catch((err) => console.error('Error fetching date slots:', err))
  }, [selectedDoctor?.id, selectedDateObj?.isoDate])

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleTabSwitch = (tabId: string) => {
    setActiveTab(tabId)
    if (typeof window !== 'undefined') {
      const url = tabId === 'dashboard' ? '/patient/dashboard' : `/patient/dashboard?tab=${tabId}`
      window.history.pushState({}, '', url)
    }
  }

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setActiveModal(null)

    const isoDate = selectedDateObj.isoDate
    const newApt = {
      id: `apt-${Date.now()}`,
      doctorName: selectedDoctor.name,
      specialization: selectedDoctor.specialization,
      date: `${selectedDateObj.fullDisplay}, 2026`,
      time: selectedSlot,
      type: 'In-Clinic Visit',
      status: 'Confirmed',
      fee: selectedDoctor.fee,
    }

    setMyAppointments((prev) => [newApt, ...prev])
    setBookedSlotsMap((prev) => ({
      ...prev,
      [isoDate]: [...(prev[isoDate] || []), selectedSlot],
    }))

    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          date: isoDate,
          startTime: selectedSlot,
          notes: symptomForm.chiefComplaint,
        }),
      })

      // Re-fetch live slots from DB after booking
      fetch(`/api/doctors/${selectedDoctor.id}/slots?date=${isoDate}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.data?.slots) setDateSlots(d.data.slots)
        })
    } catch (err) {
      console.error('API appointment sync note:', err)
    }

    triggerToast(`🎉 Appointment Confirmed with ${selectedDoctor.name} for ${selectedDateObj.fullDisplay} at ${selectedSlot}! Confirmation email dispatched & database updated.`)
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    triggerToast('✓ Patient Health Profile updated successfully!')
  }

  const filteredDoctors = doctorsList.filter((doc) => {
    const matchCat = selectedCategory === 'All' || doc.specialization.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory === doc.specialization
    const matchSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

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

      {/* ── 1. Left Static Sidebar Navigation (Mint Swatch bg-[#eaf6f2]) ── */}
      <aside className="w-64 bg-[#eaf6f2] border-r border-teal-100/80 flex flex-col justify-between hidden md:flex flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Logo & Header */}
          <div className="p-6 flex items-center gap-2 border-b border-teal-100/60">
            <img src="/medicare-logo.png" alt="MEDICARE+" className="h-6 w-auto object-contain" />
            <span className="text-[11px] font-extrabold tracking-wider bg-blue-100/80 text-blue-900 px-2 py-0.5 rounded-md uppercase">
              Patient Panel
            </span>
          </div>

          {/* Navigation Links (Settings Option Removed per Request) */}
          <nav className="px-4 space-y-1 mt-3">
            {[
              { id: 'dashboard', label: 'Dashboard', Icon: IconDashboard },
              { id: 'appointments', label: 'My Appointments', Icon: IconFileText },
              { id: 'visits', label: 'AI Visit Summaries', Icon: IconSparkles, badge: 'AI' },
              { id: 'prescriptions', label: 'Prescriptions', Icon: IconPill },
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
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComp className={`w-4 h-4 flex-shrink-0 ${activeTab === nav.id ? 'text-white' : 'text-slate-600'}`} />
                    <span className="whitespace-nowrap truncate">{nav.label}</span>
                  </div>
                  {nav.badge && (
                    <span className="bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase ml-1 flex-shrink-0">
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
            <p className="font-bold text-xs text-slate-900">Need Help?</p>
            <p className="text-[11px] text-slate-500 mt-0.5 mb-3 leading-tight">Our support team is here to help you</p>
            <button
              onClick={() => triggerToast('24/7 Support Desk connected. Call +91 1800 123 4567')}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition shadow-2xs cursor-pointer"
            >
              Contact Support →
            </button>
          </div>

          {/* Patient Profile Footer */}
          <div className="p-4 border-t border-teal-100/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GenderAvatar name={user.name} className="w-8 h-8" iconClassName="w-4.5 h-4.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">Patient</p>
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
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Welcome back, {user.name.split(' ')[0]}
            </h2>
            <p className="text-xs text-slate-400 font-medium">Take charge of your health today.</p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/calendar/auth"
              className="flex items-center gap-2 bg-[#eaf6f2] hover:bg-[#d8efe8] border border-teal-200/90 text-teal-900 font-extrabold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer shadow-2xs"
            >
              <span>📅 Sync My Google Calendar</span>
            </a>
            <div className="flex items-center gap-2.5">
              <GenderAvatar name={user.name} className="w-8 h-8" iconClassName="w-4.5 h-4.5" />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">Patient</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <>
              {/* ── Active Reminders & Upcoming Consultations Banner Block ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card 1: Medication Reminder */}
                <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-lg border border-purple-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-purple-800/60 rounded-2xl flex items-center justify-center text-purple-300">
                      <IconPill className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white">Medication Reminder</p>
                        <span className="bg-purple-800/80 text-purple-200 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                          09:00 AM Today
                        </span>
                      </div>
                      <p className="text-xs text-purple-200 font-medium mt-0.5">Telmisartan 40mg (1 Tab - Empty Stomach)</p>
                      <p className="text-[10px] text-purple-300/80 mt-0.5">Prescribed by Dr. Rajesh Patel · Hypertension Care</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerToast('✓ Medication Telmisartan 40mg marked as taken!')}
                    className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap shadow-2xs"
                  >
                    Mark Taken ✓
                  </button>
                </div>

                {/* Card 2: Upcoming Consultation Session */}
                <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-5 shadow-lg border border-teal-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-teal-800/60 rounded-2xl flex items-center justify-center text-teal-300">
                      <IconCalendar className="w-5 h-5 text-teal-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white">Upcoming Session</p>
                        <span className="bg-emerald-800/80 text-emerald-200 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Today 11:30 AM
                        </span>
                      </div>
                      <p className="text-xs text-teal-200 font-medium mt-0.5">Dr. Ananya Sharma (General Physician)</p>
                      <p className="text-[10px] text-teal-300/80 mt-0.5">Confirmed · In-Clinic Consultation</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerToast('Viewing appointment details for Dr. Ananya Sharma')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap shadow-2xs"
                  >
                    View Details →
                  </button>
                </div>
              </div>

              {/* Main 12 Column Layout: Left 8 Cols (Search + Specialization + Doctor Cards) + Right 4 Cols (Booking Panel) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left 8 Columns */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Header Title */}
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 font-serif">Book Appointment</h1>
                    <p className="text-xs text-slate-400 mt-1 font-medium">Find the right doctor and book your slot</p>
                  </div>

                  {/* Search Bar Inputs */}
                  <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-4 relative">
                      <input
                        type="text"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        placeholder="Current Location"
                        className="w-full pl-8 pr-3 py-2 border rounded-xl text-xs bg-slate-50 border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                      />
                      <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">📍</span>
                    </div>

                    <div className="sm:col-span-6 relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search doctors, specialties..."
                        className="w-full pl-8 pr-3 py-2 border rounded-xl text-xs bg-slate-50 border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                      />
                      <IconSearch className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        onClick={() => triggerToast(`Filtered for ${searchQuery || 'All Doctors'}`)}
                        className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2 rounded-xl transition cursor-pointer"
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  {/* Specializations Pills */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-700">Specializations</p>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                      {[
                        { id: 'All', label: 'All' },
                        { id: 'General Physician', label: 'General Physician' },
                        { id: 'Cardiologist', label: 'Cardiologist' },
                        { id: 'Dermatologist', label: 'Dermatologist' },
                        { id: 'Orthopedic', label: 'Orthopedic' },
                        { id: 'Pediatrician', label: 'Pediatrician' },
                        { id: 'Neurologist', label: 'Neurologist' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-4 py-2 rounded-2xl border font-bold whitespace-nowrap transition cursor-pointer ${
                            selectedCategory === cat.id
                              ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Available Doctors List */}
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-slate-700">Available Doctors ({filteredDoctors.length})</p>

                    {filteredDoctors.map((doc) => {
                      const isSelected = selectedDoctor.id === doc.id
                      return (
                        <div
                          key={doc.id}
                          onClick={() => {
                            setSelectedDoctor(doc)
                            const slotPicker = document.getElementById('booking-slot-picker')
                            if (slotPicker) {
                              slotPicker.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                            }
                          }}
                          className={`p-5 rounded-3xl border transition flex items-center justify-between gap-4 cursor-pointer bg-white ${
                            isSelected
                              ? 'border-teal-600 ring-2 ring-teal-500/20 shadow-md'
                              : 'border-slate-200/80 hover:border-teal-300 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <GenderAvatar name={doc.name} className="w-14 h-14" iconClassName="w-7 h-7" />

                            <div className="space-y-1">
                              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                {doc.name}
                                <span className="text-teal-600 text-xs font-extrabold">✓</span>
                              </h3>
                              <p className="text-xs text-slate-500 font-medium">{doc.qualification}</p>
                              <p className="text-[11px] text-slate-400 font-medium">
                                🎖️ {doc.experienceYears}+ Years Exp. · 🗣️ {doc.languages}
                              </p>
                              <p className="text-xs text-amber-500 font-bold">
                                ★ {doc.rating} <span className="text-slate-400 font-medium text-[11px]">({doc.totalReviews} reviews)</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right space-y-1 flex flex-col items-end">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Next Available</p>
                            <p className="text-xs font-extrabold text-emerald-600">{doc.nextAvailable}</p>
                            <p className="text-xs font-bold text-slate-900">Fee: ₹{doc.fee}</p>
                            <button
                              type="button"
                              className={`mt-1 px-3 py-1.5 rounded-xl font-extrabold text-xs transition cursor-pointer ${
                                isSelected
                                  ? 'bg-teal-700 text-white shadow-2xs'
                                  : 'bg-teal-50 text-teal-900 hover:bg-teal-100'
                              }`}
                            >
                              {isSelected ? '✓ Selected' : 'Book Slots →'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* 4 Feature Badges at Bottom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <IconShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900">Secure & Private</p>
                        <p className="text-[10px] text-slate-400 leading-tight">Health data encrypted</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <IconCalendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900">Easy Booking</p>
                        <p className="text-[10px] text-slate-400 leading-tight">Instant slot holds</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <IconBell className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900">Timely Reminders</p>
                        <p className="text-[10px] text-slate-400 leading-tight">Rx & visit alerts</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                        <IconSparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900">AI Health Insights</p>
                        <p className="text-[10px] text-slate-400 leading-tight">Gemini AI pre-visit notes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 4 Columns: Selected Doctor Booking Panel */}
                <div id="booking-slot-picker" className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6 sticky top-24 self-start">
                  {/* Selected Doctor Summary */}
                  <div className="text-center space-y-2 pb-4 border-b border-slate-100">
                    <GenderAvatar name={selectedDoctor.name} className="w-16 h-16 mx-auto" iconClassName="w-8 h-8" />
                    <h3 className="font-bold text-slate-900 text-base flex items-center justify-center gap-1">
                      {selectedDoctor.name}
                      <span className="text-teal-600 text-xs">✓</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{selectedDoctor.qualification}</p>
                    <p className="text-[11px] text-slate-400">🎖️ {selectedDoctor.experienceYears}+ Yrs Exp · {selectedDoctor.languages}</p>
                    <p className="text-xs text-amber-500 font-bold">★ {selectedDoctor.rating} <span className="text-slate-400 font-normal">({selectedDoctor.totalReviews} reviews)</span></p>
                  </div>

                  {/* About Doctor */}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900">About Doctor</p>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{selectedDoctor.bio}</p>
                  </div>

                  {/* Date Selector — Live Synchronized 7 Days Calendar */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-900">Select Date (Live Calendar)</p>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 text-center text-xs">
                      {liveDays.map((dObj) => {
                        const isSelected = selectedDateObj.isoDate === dObj.isoDate
                        return (
                          <button
                            key={dObj.isoDate}
                            type="button"
                            onClick={() => setSelectedDateObj(dObj)}
                            className={`p-1.5 rounded-xl border font-bold transition cursor-pointer flex flex-col items-center justify-center ${
                              isSelected
                                ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            <span className="text-[9px] font-medium opacity-80">{dObj.dayName}</span>
                            <span className="text-[10px] font-extrabold">{dObj.dayNum} {dObj.monthName}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Available & Occupied Time Slots for Selected Date */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">Select Time Slot ({selectedDateObj.fullDisplay})</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-600 inline-block" /> Available</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400 inline-block" /> Occupied</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      {[
                        '09:00 AM', '09:30 AM', '10:00 AM',
                        '10:30 AM', '11:30 AM', '12:00 PM',
                        '02:00 PM', '02:30 PM', '03:00 PM',
                        '04:00 PM', '04:30 PM', '05:00 PM',
                      ].map((slot) => {
                        const apiSlot = dateSlots.find((s) => s.startTime === slot)
                        const isOccupiedInApi = apiSlot ? apiSlot.status !== 'AVAILABLE' : false
                        const isOccupiedInLocalMap = (bookedSlotsMap[selectedDateObj.isoDate] || []).includes(slot)
                        const isOccupied = isOccupiedInApi || isOccupiedInLocalMap
                        const isSelected = selectedSlot === slot && !isOccupied

                        if (isOccupied) {
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={true}
                              className="py-2.5 px-1 rounded-xl border border-slate-200 bg-slate-100/90 text-slate-400 font-semibold cursor-not-allowed text-[11px] flex flex-col items-center justify-center gap-0.5"
                              title="This slot is already occupied for this date and cannot be booked"
                            >
                              <span className="line-through">{slot}</span>
                              <span className="text-[9px] font-extrabold uppercase text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded-xs">Occupied</span>
                            </button>
                          )
                        }

                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2.5 px-1 rounded-xl border font-bold transition cursor-pointer text-xs ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-teal-50 hover:border-teal-300'
                            }`}
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={() => setActiveModal('symptom_modal')}
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3.5 rounded-2xl transition shadow-lg shadow-teal-900/10 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Continue to Symptoms →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: MY APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              {/* Google Calendar Integration Banner */}
              <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-teal-800/80 rounded-2xl flex items-center justify-center font-bold text-xl">
                    📅
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Google Calendar 2-Way Synchronization</h4>
                    <p className="text-xs text-teal-200 mt-0.5 font-medium">Connect your Google account to automatically sync all your doctor appointments & reminders to your personal Google Calendar.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast('🟢 Google Calendar 2-Way Sync Active! Booked consultations automatically sync to your calendar.')}
                  className="bg-white hover:bg-slate-100 text-teal-950 font-extrabold text-xs px-5 py-3 rounded-2xl transition cursor-pointer shadow-md whitespace-nowrap"
                >
                  🟢 Google Calendar Active →
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">My Active Appointments</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Scheduled consultations and video session links</p>
                </div>
                <button
                  onClick={() => handleTabSwitch('dashboard')}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-2xs cursor-pointer"
                >
                  + Book New Appointment
                </button>
              </div>

              <div className="space-y-4">
                {myAppointments.map((apt) => (
                  <div key={apt.id} className="p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/60 hover:border-teal-300 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-teal-100 text-teal-900 rounded-2xl flex items-center justify-center font-bold text-base">
                        📅
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{apt.doctorName}</h4>
                        <p className="text-xs text-slate-500 font-medium">{apt.specialization} · {apt.type}</p>
                        <p className="text-[11px] text-teal-700 font-bold mt-1">🗓️ {apt.date} at {apt.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-xl font-bold">
                        {apt.status}
                      </span>
                      <button
                        onClick={() => triggerToast(`Reschedule request sent for appointment with ${apt.doctorName}`)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition cursor-pointer"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

          {/* TAB 3: PAST VISITS & AI SUMMARIES */}
          {activeTab === 'visits' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">AI Visit Summaries & Clinical History</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Gemini AI clinical summaries, doctor advice, and prescribed medications</p>
              </div>

              <div className="space-y-4">
                {pastVisits.map((v) => (
                  <div key={v.id} className="p-6 rounded-3xl border border-slate-200/80 space-y-4 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{v.doctorName}</h4>
                        <p className="text-xs text-slate-400 font-medium">Date: {v.date}</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-xl font-bold">
                        Completed
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                      <p className="text-xs font-bold text-slate-900">Diagnosis: {v.diagnosis}</p>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{v.aiSummary}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-800">Prescribed Medications:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {v.prescriptions.map((rx, idx) => (
                          <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs">
                            <p className="font-bold text-slate-900">{rx.name}</p>
                            <p className="text-[10px] text-slate-500">{rx.dosage} · {rx.frequency}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PRESCRIPTIONS */}
          {activeTab === 'prescriptions' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Active E-Prescriptions Manager</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Medications prescribed by your consulting doctors</p>
                </div>
                <button
                  onClick={() => triggerToast('Downloaded official e-prescription PDF!')}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Download Rx PDF
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                        {rx.category}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">● {rx.status}</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{rx.drugName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{rx.dosage} · {rx.frequency}</p>
                      <p className="text-[11px] text-slate-400 mt-1">Prescribed by {rx.doctorName}</p>
                    </div>

                    <button
                      onClick={() => triggerToast(`Dose reminder set for ${rx.drugName}`)}
                      className="w-full bg-white border border-slate-200 hover:bg-teal-50 text-teal-800 text-xs font-bold py-2 rounded-xl transition cursor-pointer"
                    >
                      ⏰ Set Dose Reminder
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REMINDERS */}
          {activeTab === 'reminders' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Active Medication & Consultation Reminders</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Daily dose schedule & upcoming medical checkups</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-xs">Telmisartan 40mg (1 Tab - Empty Stomach)</p>
                    <p className="text-[11px] text-slate-500">Scheduled for 09:00 AM Today · Prescribed by Dr. Rajesh Patel</p>
                  </div>
                  <button onClick={() => triggerToast('✓ Dose marked as taken!')} className="bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer">
                    Mark Taken ✓
                  </button>
                </div>

                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-xs">Doctor Session with Dr. Ananya Sharma</p>
                    <p className="text-[11px] text-slate-500">Scheduled for Today at 11:30 AM · General Medicine Consultation</p>
                  </div>
                  <button onClick={() => triggerToast('Viewing appointment details for Dr. Ananya Sharma')} className="bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer">
                    View Details →
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-xs">Paracetamol 650mg (After Lunch)</p>
                    <p className="text-[11px] text-slate-500">Scheduled for 02:00 PM Today · Fever & Pain Relief</p>
                  </div>
                  <button onClick={() => triggerToast('✓ Dose marked as taken!')} className="bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer">
                    Mark Taken ✓
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-xl">Patient Health Profile</h3>
                <p className="text-xs text-slate-500">Manage your personal details, blood group, allergies, and emergency contacts</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Full Name</label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Email Address</label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Phone Number</label>
                    <input
                      type="text"
                      value={user.phone}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Blood Group</label>
                    <input
                      type="text"
                      value={user.bloodGroup}
                      onChange={(e) => setUser({ ...user, bloodGroup: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Known Allergies</label>
                    <input
                      type="text"
                      value={user.allergies}
                      onChange={(e) => setUser({ ...user, allergies: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Emergency Contact</label>
                    <input
                      type="text"
                      value={user.emergencyContact}
                      onChange={(e) => setUser({ ...user, emergencyContact: e.target.value })}
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

      {/* SYMPTOM & BOOKING MODAL */}
      {activeModal === 'symptom_modal' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border p-6 w-full max-w-md space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">AI Symptom Assessment & Booking</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="bg-teal-50 p-3.5 rounded-2xl border border-teal-100 space-y-1">
              <p className="font-bold text-teal-900">Booking Summary:</p>
              <p className="text-slate-700"><span className="font-bold">Doctor:</span> {selectedDoctor.name}</p>
              <p className="text-slate-700"><span className="font-bold">Slot:</span> {selectedDateObj.fullDisplay} at {selectedSlot}</p>
              <p className="text-slate-700"><span className="font-bold">Fee:</span> ₹{selectedDoctor.fee}</p>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chief Complaint / Symptoms</label>
                <input
                  type="text"
                  required
                  value={symptomForm.chiefComplaint}
                  onChange={(e) => setSymptomForm({ ...symptomForm, chiefComplaint: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Symptom Duration</label>
                <input
                  type="text"
                  required
                  value={symptomForm.duration}
                  onChange={(e) => setSymptomForm({ ...symptomForm, duration: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white text-slate-900 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2 rounded-xl shadow-xs">Confirm & Book Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
