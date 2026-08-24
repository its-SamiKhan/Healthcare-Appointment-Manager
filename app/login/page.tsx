'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function IconGoogle({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  )
}

const TEST_ACCOUNTS = [
  {
    role: 'Patient',
    email: 'patient@example.com',
    password: 'MediCare#Secure2026!',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
    badge: '🏥 Patient',
  },
  {
    role: 'Doctor',
    email: 'ananya.sharma@healthcare.com',
    password: 'MediCare#Secure2026!',
    color: 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100',
    badge: '👨‍⚕️ Dr. Ananya',
  },
  {
    role: 'Admin',
    email: 'admin@healthcare.com',
    password: 'MediCare#Secure2026!',
    color: 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200',
    badge: '⚡ Admin',
  },
]

const ROLES = [
  { value: 'PATIENT', label: 'Patient', icon: '🏥', desc: 'Book appointments & health records' },
  { value: 'DOCTOR', label: 'Doctor', icon: '👨‍⚕️', desc: 'Manage schedule & patient records' },
]

interface LoginPageProps {
  initialMode?: 'login' | 'register'
}

export default function LoginPage({ initialMode = 'login' }: LoginPageProps) {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [activePortal, setActivePortal] = useState<'PATIENT' | 'DOCTOR' | 'ADMIN'>('PATIENT')

  // Listen to browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      if (path.includes('register')) {
        setMode('register')
      } else {
        setMode('login')
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'login'
            ? { email: form.email, password: form.password }
            : form
        ),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || `${mode === 'login' ? 'Login' : 'Registration'} failed`)
        return
      }

      const role = data.data.user.role
      router.push(`/${role.toLowerCase()}/dashboard`)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = (email: string, password: string) => {
    setForm((prev) => ({ ...prev, email, password }))
  }

  const toggleMode = (newMode: 'login' | 'register') => {
    setError('')
    setMode(newMode)
    // Update browser URL without reloading
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/${newMode}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100/90 py-8 px-4 sm:px-8 overflow-hidden [perspective:1200px]">
      {/* ── 3D Card Flip Wrapper (Fixed Equal Dimensions for Both Faces) ── */}
      <div
        className={`w-full max-w-5xl lg:max-w-6xl h-[680px] relative transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
          mode === 'register' ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* ── FRONT FACE: LOGIN MODE ── */}
        <div
          className={`absolute inset-0 w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-slate-200/80 [backface-visibility:hidden] ${
            mode === 'login' ? 'pointer-events-auto z-20' : 'pointer-events-none z-0'
          }`}
        >
          {/* Left 6/12 Columns: Female Doctor Image Artwork */}
          <div className="md:col-span-6 relative h-full bg-slate-50 overflow-hidden border-r border-slate-100 hidden md:block">
            <img
              src="/login-artwork.png"
              alt="MediCare+ Login Artwork"
              className="w-full h-full object-cover object-left"
            />
            <div className="absolute top-8 left-8 z-10">
              <img src="/medicare-logo.png" alt="MEDICARE+" className="h-7 w-auto object-contain" />
              <p className="text-[10px] text-teal-800 font-bold tracking-widest uppercase mt-1">
                Healthcare Simplified
              </p>
            </div>
          </div>

          {/* Right 6/12 Columns: Login Form Panel */}
          <div className="md:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-between h-full bg-white z-10 overflow-y-auto">
            <div>
              {/* Header */}
              <div className="mb-4">
                <h1 className="text-3xl sm:text-4xl font-serif text-slate-800 font-bold tracking-tight">
                  Login to MEDICARE+
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                  Enter your email and password to access your portal
                </p>
              </div>

              {/* Quick Test Accounts */}
              <div className="mb-3 bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs">
                <p className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                  🔑 Quick Demo Login (Click to Auto-fill)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {TEST_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => {
                        setActivePortal(acc.role.toUpperCase() as 'PATIENT' | 'DOCTOR' | 'ADMIN')
                        handleQuickLogin(acc.email, acc.password)
                      }}
                      className={`py-1.5 px-2 border rounded-xl text-xs font-bold transition text-center shadow-xs ${acc.color}`}
                    >
                      {acc.badge}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 text-center mt-1.5 font-medium">
                  Password: <code className="font-mono text-slate-700 font-bold">MediCare#Secure2026!</code>
                </p>
              </div>

              {/* Pill-Shaped Portal Selector Switch */}
              <div className="mb-4 bg-slate-100 p-1.5 rounded-full flex items-center justify-between border border-slate-200/90 shadow-2xs">
                {[
                  { role: 'PATIENT', label: '🏥 Patient Portal', email: 'patient@example.com' },
                  { role: 'DOCTOR', label: '👨‍⚕️ Doctor Portal', email: 'ananya.sharma@healthcare.com' },
                  { role: 'ADMIN', label: '⚡ Admin Portal', email: 'admin@healthcare.com' },
                ].map((p) => (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => {
                      setActivePortal(p.role as 'PATIENT' | 'DOCTOR' | 'ADMIN')
                      handleQuickLogin(p.email, 'MediCare#Secure2026!')
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-full text-[10px] sm:text-[11px] font-extrabold transition-all duration-200 text-center cursor-pointer ${
                      activePortal === p.role
                        ? 'bg-teal-700 text-white shadow-md scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {error && mode === 'login' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs font-medium">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 bg-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-sm font-medium shadow-2xs"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 bg-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-sm font-medium shadow-2xs"
                    placeholder="••••••••"
                  />
                </div>

                <div className="text-left">
                  <a href="#" className="text-xs text-slate-500 hover:text-slate-800 underline font-medium">
                    Forgot your password?
                  </a>
                </div>

                <div className="pt-1 flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-40 bg-[#1a2035] hover:bg-[#252d48] disabled:opacity-50 text-white font-bold py-3 px-6 rounded-full transition shadow-lg shadow-slate-900/20 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    {loading ? 'Logging in…' : 'LOGIN'}
                  </button>

                  <a
                    href="/api/auth/google"
                    className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold py-2.5 px-4 rounded-full transition text-xs shadow-2xs cursor-pointer"
                  >
                    <IconGoogle className="w-4 h-4" />
                    <span>Continue with Google</span>
                  </a>
                </div>
              </form>
            </div>

            {/* Bottom Link */}
            <div className="pt-3 border-t border-slate-100 mt-2">
              <p className="text-xs text-slate-500">
                Need an account?{' '}
                <button
                  type="button"
                  onClick={() => toggleMode('register')}
                  className="text-slate-900 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Create account
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* ── BACK FACE: REGISTER MODE (Identical Outer Dimensions) ── */}
        <div
          className={`absolute inset-0 w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-slate-200/80 [transform:rotateY(180deg)] [backface-visibility:hidden] ${
            mode === 'register' ? 'pointer-events-auto z-20' : 'pointer-events-none z-0'
          }`}
        >
          {/* Left 6/12 Columns: Register Form (On Left Side) */}
          <div className="md:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-between h-full bg-white z-10 overflow-y-auto">
            <div>
              {/* Header */}
              <div className="mb-4">
                <h1 className="text-3xl sm:text-4xl font-serif text-slate-800 font-bold tracking-tight">
                  Create an Account
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                  Join MEDICARE+ to manage your health or practice seamlessly
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {error && mode === 'register' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs font-medium">
                    {error}
                  </div>
                )}

                {/* Role Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    I am registering as a…
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {ROLES.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setForm({ ...form, role: r.value })}
                        className={`p-2.5 rounded-xl border-2 text-left transition cursor-pointer ${
                          form.role === r.value
                            ? 'border-teal-600 bg-teal-50/60 shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="text-base mb-0.5">{r.icon}</div>
                        <div className="font-bold text-xs text-slate-900">{r.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-medium leading-tight">{r.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 bg-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-sm font-medium shadow-2xs"
                    placeholder="Dr. Rahul Sharma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 bg-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-sm font-medium shadow-2xs"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 bg-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-sm font-medium shadow-2xs"
                    placeholder="Min. 8 characters"
                  />
                </div>

                <div className="pt-1 flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-44 bg-[#1a2035] hover:bg-[#252d48] disabled:opacity-50 text-white font-bold py-3 px-6 rounded-full transition shadow-lg shadow-slate-900/20 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    {loading ? 'Creating account…' : 'CREATE ACCOUNT'}
                  </button>

                  <a
                    href="/api/auth/google"
                    className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold py-2.5 px-4 rounded-full transition text-xs shadow-2xs cursor-pointer"
                  >
                    <IconGoogle className="w-4 h-4" />
                    <span>Sign up with Google</span>
                  </a>
                </div>
              </form>
            </div>

            {/* Bottom Link */}
            <div className="pt-3 border-t border-slate-100 mt-2">
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => toggleMode('login')}
                  className="text-slate-900 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>

          {/* Right 6/12 Columns: Male Doctor Flipped Image Artwork */}
          <div className="md:col-span-6 relative h-full bg-slate-50 overflow-hidden border-l border-slate-100 hidden md:block">
            <img
              src="/register-artwork.png"
              alt="MediCare+ Register Artwork"
              className="w-full h-full object-cover object-right"
            />
            <div className="absolute top-8 right-8 z-10 text-right flex flex-col items-end">
              <img src="/medicare-logo.png" alt="MEDICARE+" className="h-7 w-auto object-contain" />
              <p className="text-[10px] text-teal-800 font-bold tracking-widest uppercase mt-1">
                Healthcare Simplified
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
